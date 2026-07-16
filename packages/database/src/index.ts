import { createClient } from '@supabase/supabase-js';

// We will initialize the Supabase client here once we have the URL and Key
export const supabase = createClient(
  process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_ANON_KEY || 'placeholder'
);
