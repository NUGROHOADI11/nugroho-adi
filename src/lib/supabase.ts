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

function getSupabaseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
}

function getSupabaseAnonKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_KEY ||
    ""
  );
}

function getSupabaseServiceRoleKey(): string {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || "";
}

/**
 * Returns true if Supabase URL and at least one API key are configured.
 */
export function isSupabaseConfigured(): boolean {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey() || getSupabaseServiceRoleKey();
  return Boolean(url && key);
}

let _supabaseClient: SupabaseClient | null = null;
export function getSupabase(): SupabaseClient | null {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  if (!url || !key) return null;
  if (!_supabaseClient) {
    _supabaseClient = createClient(url, key);
  }
  return _supabaseClient;
}

let _supabaseAdminClient: SupabaseClient | null = null;
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = getSupabaseUrl();
  const key = getSupabaseServiceRoleKey() || getSupabaseAnonKey();
  if (!url || !key) return null;
  if (!_supabaseAdminClient) {
    _supabaseAdminClient = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return _supabaseAdminClient;
}

/**
 * Dynamic Supabase clients with Proxy to guarantee late binding of environment variables
 */
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabase();
    if (!client) return undefined;
    const val = (client as unknown as Record<string, unknown>)[prop as string];
    if (typeof val === "function") {
      return val.bind(client);
    }
    return val;
  },
});

export const supabaseAdmin: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseAdmin();
    if (!client) return undefined;
    const val = (client as unknown as Record<string, unknown>)[prop as string];
    if (typeof val === "function") {
      return val.bind(client);
    }
    return val;
  },
});
