import { GoogleGenAI } from "@google/genai";

// Dynamic singleton instance holder
let _genAI: GoogleGenAI | null = null;

export function getGenAI(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY || "";
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not defined in environment variables. Please check your .env.local file."
    );
  }
  if (!_genAI) {
    _genAI = new GoogleGenAI({ apiKey });
  }
  return _genAI;
}

/**
 * Generate 768-dimensional text embedding for RAG vector search.
 * Uses gemini-embedding-001 with outputDimensionality: 768 (or text-embedding-004 if available).
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const ai = getGenAI();
  const cleanedText = text.replace(/\n+/g, " ").trim();
  if (!cleanedText) {
    throw new Error("Text content for embedding cannot be empty.");
  }

  // Model cascade: gemini-embedding-001 (768 dim), gemini-embedding-2, text-embedding-004
  const models = ["gemini-embedding-001", "gemini-embedding-2", "text-embedding-004"];

  let lastError: unknown = null;

  for (const model of models) {
    try {
      const response = await ai.models.embedContent({
        model,
        contents: cleanedText,
        config: {
          outputDimensionality: 768,
        },
      });

      // Handle response formats from @google/genai SDK
      if (response.embeddings && response.embeddings[0]?.values) {
        return response.embeddings[0].values;
      }
      if ((response as unknown as { embedding?: { values?: number[] } }).embedding?.values) {
        return (response as unknown as { embedding: { values: number[] } }).embedding.values;
      }
    } catch (err: unknown) {
      lastError = err;
      // Try next candidate model
      continue;
    }
  }

  console.error("[generateEmbedding] All embedding models failed:", lastError);
  throw new Error(
    `Failed to generate embedding: ${lastError instanceof Error ? lastError.message : "Unknown error"}`
  );
}

/**
 * Stream conversational response from Gemini Flash with fallback resilience
 */
export async function createChatStream({
  contents,
  systemInstruction,
  temperature = 0.2,
}: {
  contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }>;
  systemInstruction: string;
  temperature?: number;
}) {
  const ai = getGenAI();

  // Active production models cascade
  const candidateModels = [
    "gemini-3.5-flash",
    "gemini-3.7-flash",
    "gemini-3.8-flash",
    "gemini-2.5-flash",
  ];

  let lastError: unknown = null;

  for (const model of candidateModels) {
    try {
      const stream = await ai.models.generateContentStream({
        model,
        contents,
        config: {
          systemInstruction,
          temperature,
        },
      });

      return { stream, modelUsed: model };
    } catch (err: unknown) {
      lastError = err;
      console.warn(`[createChatStream] Model ${model} failed, trying candidate fallback...`, err);
      continue;
    }
  }

  throw new Error(
    `Failed to initiate Gemini stream: ${lastError instanceof Error ? lastError.message : "Service unavailable"}`
  );
}
