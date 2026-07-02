import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 
  (typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_SUPABASE_URL : undefined) ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  'https://nydbrqvrvgzhfzwqpxrs.supabase.co';

const supabaseAnonKey = 
  (typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : undefined) ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_lBXEIj2mofORNA-rdcPhGQ_g8FIuXn3';

if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== 'undefined') {
    console.warn('Supabase URL or Anon Key is missing in window. Check env.');
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
