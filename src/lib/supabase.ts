import { createClient, SupabaseClient } from "@supabase/supabase-js";

export interface KnowledgeMetadata {
  source?: string;
  category: "bio" | "experience" | "projects" | "skills" | "contact" | "faq" | string;
  title?: string;
  section?: string;
  heading?: string;
  url?: string;
}

export interface PersonalKnowledgeRecord {
  id?: number;
  content: string;
  metadata: KnowledgeMetadata;
  embedding: number[];
  created_at?: string;
}

export interface MatchPersonalKnowledgeResult {
  id: number;
  content: string;
  metadata: KnowledgeMetadata;
  similarity: number;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

/**
 * Returns true if Supabase URL and at least one API key are configured.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && (supabaseAnonKey || supabaseServiceRoleKey));
}

/**
 * Public Supabase client (browser & safe read operations)
 */
export const supabase: SupabaseClient | null = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Admin Supabase client (service role key for backend ingestion & RPC execution)
 */
export const supabaseAdmin: SupabaseClient | null = supabaseUrl && (supabaseServiceRoleKey || supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseServiceRoleKey || supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;
