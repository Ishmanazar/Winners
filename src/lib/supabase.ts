import { createClient } from '@supabase/supabase-js';

// Public Supabase credentials (anon key is safe to expose — protected by RLS)
// Environment variables take priority; fallback to hardcoded defaults for deployed builds
const FALLBACK_SUPABASE_URL = 'https://kqeajucmdugfyifdjjkz.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxZWFqdWNtZHVnZnlpZmRqamt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxNjk1NjUsImV4cCI6MjEwNDc0NTU2NX0.k5krg367wB5Yyultu5J-GcDk4soM-2_8KvvuHOLZVuA';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || FALLBACK_SUPABASE_URL;
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || FALLBACK_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = (): boolean => {
  return !!(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project.supabase.co' &&
    supabaseAnonKey !== 'your-anon-key-here'
  );
};

