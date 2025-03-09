
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

    // Create a Supabase client with user's JWT
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    // Get another Supabase client with service role for database updates
    const supabaseAdmin = createClient(
      supabaseUrl,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    // Get the user's session
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Check if user has credits
    const { data: userCredits, error: creditsError } = await supabase
      .from('user_credits')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (creditsError && creditsError.code !== 'PGRST116') {
      // PGRST116 is the "not found" error code from PostgREST
      throw new Error('Error fetching user credits');
    }

    if (!userCredits) {
      return new Response(
        JSON.stringify({ success: false, message: 'No credits available' }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Check if user has unlimited access
    if (userCredits.unlimited_forever) {
      return new Response(
        JSON.stringify({ success: true, message: 'Unlimited access' }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    if (userCredits.unlimited_until && new Date(userCredits.unlimited_until) > new Date()) {
      return new Response(
        JSON.stringify({ success: true, message: 'Unlimited access until ' + userCredits.unlimited_until }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Check and use regular credits
    if (userCredits.credits > 0) {
      // Deduct one credit using service role client
      const { error: updateError } = await supabaseAdmin
        .from('user_credits')
        .update({ 
          credits: userCredits.credits - 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', userCredits.id);

      if (updateError) {
        throw new Error('Failed to use credit: ' + updateError.message);
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Credit used successfully',
          remainingCredits: userCredits.credits - 1
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: false, message: 'No credits available' }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error using credit:', error);
    return new Response(
      JSON.stringify({ error: error.message, success: false }),
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
