import fs from "fs";
import path from "path";

// Simple native env file loader
function loadEnvFile(filepath: string) {
  if (!fs.existsSync(filepath)) return;
  const content = fs.readFileSync(filepath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx !== -1) {
      const key = trimmed.substring(0, eqIdx).trim();
      let val = trimmed.substring(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.substring(1, val.length - 1);
      }
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

loadEnvFile(path.resolve(process.cwd(), ".env.local"));
loadEnvFile(path.resolve(process.cwd(), ".env.production"));
loadEnvFile(path.resolve(process.cwd(), ".env"));

import { generateEmbedding } from "../src/lib/gemini";
import { supabaseAdmin, isSupabaseConfigured, KnowledgeMetadata } from "../src/lib/supabase";

interface Chunk {
  content: string;
  metadata: KnowledgeMetadata;
}

const KNOWLEDGE_DIR = path.resolve(process.cwd(), "data/knowledge");
const LOCAL_CACHE_PATH = path.resolve(process.cwd(), "data/knowledge/knowledge-cache.json");

/**
 * Determine category from filename or title
 */
function getCategoryFromFilename(filename: string): string {
  const lower = filename.toLowerCase();
  if (lower.includes("bio")) return "bio";
  if (lower.includes("experience")) return "experience";
  if (lower.includes("project")) return "projects";
  if (lower.includes("skill")) return "skills";
  if (lower.includes("contact")) return "contact";
  if (lower.includes("faq")) return "faq";
  return "general";
}

/**
 * Split text into chunks with maximum character length and overlap
 */
function splitWithOverlap(text: string, maxChars = 600, overlap = 100): string[] {
  const trimmed = text.trim();
  if (trimmed.length <= maxChars) {
    return [trimmed];
  }

  const chunks: string[] = [];
  let startIndex = 0;

  while (startIndex < trimmed.length) {
    let endIndex = startIndex + maxChars;

    if (endIndex < trimmed.length) {
      // Try to break at paragraph, line break, or sentence ending
      const lastParagraph = trimmed.lastIndexOf("\n\n", endIndex);
      const lastNewline = trimmed.lastIndexOf("\n", endIndex);
      const lastPeriod = trimmed.lastIndexOf(". ", endIndex);

      if (lastParagraph > startIndex + 200) {
        endIndex = lastParagraph;
      } else if (lastPeriod > startIndex + 200) {
        endIndex = lastPeriod + 1;
      } else if (lastNewline > startIndex + 200) {
        endIndex = lastNewline;
      }
    }

    const chunk = trimmed.substring(startIndex, endIndex).trim();
    if (chunk.length > 20) {
      chunks.push(chunk);
    }

    if (endIndex >= trimmed.length) {
      break;
    }

    startIndex = Math.max(endIndex - overlap, startIndex + 50);
  }

  return chunks;
}

/**
 * Heading-aware Markdown chunker (## and ###)
 */
function chunkMarkdownFile(filepath: string): Chunk[] {
  const content = fs.readFileSync(filepath, "utf-8");
  const filename = path.basename(filepath);
  const category = getCategoryFromFilename(filename);

  // Extract main title if present (# Document Title)
  const mainTitleMatch = content.match(/^#\s+(.+)$/m);
  const docTitle = mainTitleMatch ? mainTitleMatch[1].trim() : filename;

  const chunks: Chunk[] = [];

  // Split content by heading lines (## or ###)
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const sections: { heading: string; level: number; startIndex: number }[] = [];

  let match: RegExpExecArray | null;
  while ((match = headingRegex.exec(content)) !== null) {
    sections.push({
      heading: match[2].trim(),
      level: match[1].length,
      startIndex: match.index,
    });
  }

  if (sections.length === 0) {
    // If no subheadings, chunk the entire file
    const subChunks = splitWithOverlap(content, 600, 100);
    for (const sc of subChunks) {
      chunks.push({
        content: sc,
        metadata: {
          source: filename,
          category,
          title: docTitle,
          heading: docTitle,
        },
      });
    }
    return chunks;
  }

  // Include preamble before the first heading if substantive
  if (sections[0].startIndex > 0) {
    const preamble = content.substring(0, sections[0].startIndex).trim();
    if (preamble.length > 50) {
      const subChunks = splitWithOverlap(preamble, 600, 100);
      for (const sc of subChunks) {
        chunks.push({
          content: sc,
          metadata: {
            source: filename,
            category,
            title: docTitle,
            heading: `${docTitle} - Overview`,
          },
        });
      }
    }
  }

  // Process each section
  for (let i = 0; i < sections.length; i++) {
    const current = sections[i];
    const nextStart = i + 1 < sections.length ? sections[i + 1].startIndex : content.length;
    const sectionBody = content.substring(current.startIndex, nextStart).trim();

    const subChunks = splitWithOverlap(sectionBody, 600, 100);
    for (const sc of subChunks) {
      chunks.push({
        content: sc,
        metadata: {
          source: filename,
          category,
          title: docTitle,
          heading: current.heading,
        },
      });
    }
  }

  return chunks;
}

/**
 * Main ingestion routine
 */
async function runIngestion() {
  console.log("==========================================================");
  console.log("   Nugroho Adi - AI RAG Pipeline Ingestion & Chunking     ");
  console.log("==========================================================\n");

  if (!fs.existsSync(KNOWLEDGE_DIR)) {
    console.error(`Knowledge directory not found: ${KNOWLEDGE_DIR}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(KNOWLEDGE_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort();

  console.log(`Found ${files.length} knowledge markdown files:`, files);

  const allChunks: Chunk[] = [];

  for (const file of files) {
    const fullPath = path.join(KNOWLEDGE_DIR, file);
    const fileChunks = chunkMarkdownFile(fullPath);
    console.log(`  - [${file}]: ${fileChunks.length} chunks generated.`);
    allChunks.push(...fileChunks);
  }

  console.log(`\nTotal chunks to process: ${allChunks.length}`);

  console.log("\nGenerating vector embeddings via Google Gen AI SDK (768 dimensions)...");

  const embeddedChunks: Array<{
    content: string;
    metadata: KnowledgeMetadata;
    embedding: number[];
  }> = [];

  for (let i = 0; i < allChunks.length; i++) {
    const chunk = allChunks[i];
    process.stdout.write(`  Processing chunk ${i + 1}/${allChunks.length} (${chunk.metadata.heading})... `);

    try {
      // Prepend heading to chunk content to enrich embedding context
      const textToEmbed = `[${chunk.metadata.category.toUpperCase()}] ${chunk.metadata.heading}: ${chunk.content}`;
      const embedding = await generateEmbedding(textToEmbed);

      embeddedChunks.push({
        content: chunk.content,
        metadata: chunk.metadata,
        embedding,
      });

      console.log("DONE");

      // Short delay to respect API rate limits
      await new Promise((res) => setTimeout(res, 350));
    } catch (err) {
      console.error(`FAILED: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // Save local fallback cache
  fs.writeFileSync(
    LOCAL_CACHE_PATH,
    JSON.stringify(
      embeddedChunks.map((c) => ({
        content: c.content,
        metadata: c.metadata,
        embedding: c.embedding,
      })),
      null,
      2
    ),
    "utf-8"
  );
  console.log(`\n[SUCCESS] Local knowledge cache saved to: ${LOCAL_CACHE_PATH}`);

  // Upsert to Supabase if credentials are provided
  if (isSupabaseConfigured() && supabaseAdmin) {
    console.log("\nConnecting to Supabase PostgreSQL vector database...");

    try {
      // Optional: Clear existing records to ensure fresh state
      const { error: deleteError } = await supabaseAdmin
        .from("personal_knowledge")
        .delete()
        .neq("id", 0);

      if (deleteError) {
        console.warn("Notice: Table might be empty or permissions restricted:", deleteError.message);
      }

      console.log("Upserting chunks to 'personal_knowledge' table...");
      const batchSize = 10;
      for (let i = 0; i < embeddedChunks.length; i += batchSize) {
        const batch = embeddedChunks.slice(i, i + batchSize).map((item) => ({
          content: item.content,
          metadata: item.metadata,
          embedding: item.embedding,
        }));

        const { error: insertError } = await supabaseAdmin
          .from("personal_knowledge")
          .insert(batch);

        if (insertError) {
          throw insertError;
        }

        console.log(`  Upserted batch ${i / batchSize + 1}/${Math.ceil(embeddedChunks.length / batchSize)}`);
      }

      console.log("\n[SUCCESS] All chunks successfully stored in Supabase pgvector!");
    } catch (dbError) {
      console.error("[WARNING] Supabase insertion error:", dbError instanceof Error ? dbError.message : dbError);
      console.log("Local fallback cache is active and will serve queries in the meantime.");
    }
  } else {
    console.log("\n[INFO] Supabase credentials not detected in .env.local.");
    console.log("Chunks and embeddings are cached locally in data/knowledge/knowledge-cache.json.");
    console.log("To sync to Supabase:");
    console.log("  1. Run supabase/schema.sql in your Supabase SQL Editor.");
    console.log("  2. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local");
    console.log("  3. Re-run 'npm run ingest'");
  }

  console.log("\n==========================================================");
  console.log("   Ingestion Pipeline Completed Successfully!             ");
  console.log("==========================================================\n");
}

runIngestion().catch((err) => {
  console.error("Fatal error during ingestion:", err);
  process.exit(1);
});
