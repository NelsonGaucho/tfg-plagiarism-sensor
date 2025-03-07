
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    // Get the user's session
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Get user credits
    const { data: userCredits, error: creditsError } = await supabase
      .from('user_credits')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (creditsError && creditsError.code !== 'PGRST116') {
      // PGRST116 is the "not found" error code from PostgREST
      throw new Error('Error fetching user credits');
    }

    // Determine credit status
    let hasCredits = false;
    let creditsCount = 0;
    let hasUnlimited = false;
    let unlimitedUntil = null;

    if (userCredits) {
      creditsCount = userCredits.credits || 0;
      
      if (userCredits.unlimited_forever) {
        hasUnlimited = true;
        hasCredits = true;
      } else if (userCredits.unlimited_until && new Date(userCredits.unlimited_until) > new Date()) {
        hasUnlimited = true;
        hasCredits = true;
        unlimitedUntil = userCredits.unlimited_until;
      } else if (creditsCount > 0) {
        hasCredits = true;
      }
    }

    return new Response(
      JSON.stringify({
        hasCredits,
        creditsCount,
        hasUnlimited,
        unlimitedUntil,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error checking credits:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
