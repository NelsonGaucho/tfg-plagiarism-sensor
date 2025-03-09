
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jsnclmwocfearleqtjkr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzbmNsbXdvY2ZlYXJsZXF0amtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMjA4MzIsImV4cCI6MjA1Njc5NjgzMn0.yrIHS7qPlvNsap8q4SnVxcjXOdcI-297DSNGCS2LDYQ";

// Initialize Supabase client
let supabaseClient;

try {
  // Create the client
  supabaseClient = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  console.log("Supabase client initialized successfully");
} catch (error) {
  console.error("Error initializing Supabase client:", error);
  // Create a fallback client to prevent application crashes
  supabaseClient = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      persistSession: false,
    }
  });
}

// Export the client so it can be imported elsewhere in the application
// import { supabase } from "@/integrations/supabase/client";
export const supabase = supabaseClient;
