import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dybehmchmvoproegwhbc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5YmVobWNobXZvcHJvZWd3aGJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5NTc4ODgsImV4cCI6MjA1NjUzMzg4OH0.t2bYnX18mSwuX6jHUajWkj-U3C9HYNJ47vts0eAena4';

export const supabase = createClient(supabaseUrl, supabaseKey); 