import 'server-only';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

const hasValidEnv = Boolean(supabaseUrl && supabaseAnonKey);

let supabase: any | null = null
if (hasValidEnv) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
  console.warn('⚠️ Supabase environment variables are missing! Application will stay in loading state.');
}

export default supabase;
