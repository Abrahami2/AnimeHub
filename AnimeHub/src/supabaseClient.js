import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://okfqyaerkoehukoffrph.supabase.co'; // Replace with your actual Supabase URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rZnF5YWVya29laHVrb2ZmcnBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQyMzAxNDQsImV4cCI6MjAyOTgwNjE0NH0._mSOU5CeGWBRwVWpvEHrSl-hjBpWObAIdh5eVREq38o'; // Replace with your actual Supabase anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
