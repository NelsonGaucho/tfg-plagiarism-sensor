
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from 'https://esm.sh/stripe@12.11.0';

// Initialize Stripe with the secret key
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';

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
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const signature = req.headers.get('stripe-signature');
    
    if (!signature) {
      return new Response(
        JSON.stringify({ error: 'Missing Stripe signature' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const body = await req.text();
    let event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err) {
      console.error(`⚠️ Webhook signature verification failed:`, err);
      return new Response(
        JSON.stringify({ error: `Webhook Error: ${err.message}` }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        const { userId, planType, creditsToAdd, unlimitedDays, unlimitedForever } = paymentIntent.metadata;

        // Update user credits based on the plan
        if (unlimitedForever === 'true') {
          await supabase
            .from('user_credits')
            .upsert({
              user_id: userId,
              unlimited_forever: true,
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'user_id',
            });
        } else if (unlimitedDays) {
          // Get current unlimited_until date if exists
          const { data: currentCredits } = await supabase
            .from('user_credits')
            .select('unlimited_until')
            .eq('user_id', userId)
            .single();
          
          const baseDate = currentCredits?.unlimited_until ? new Date(currentCredits.unlimited_until) : new Date();
          const newDate = new Date(baseDate);
          newDate.setDate(newDate.getDate() + parseInt(unlimitedDays));

          await supabase
            .from('user_credits')
            .upsert({
              user_id: userId,
              unlimited_until: newDate.toISOString(),
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'user_id',
            });
        } else if (creditsToAdd) {
          // Get current credits if exists
          const { data: currentCredits } = await supabase
            .from('user_credits')
            .select('credits')
            .eq('user_id', userId)
            .single();
          
          const currentAmount = currentCredits?.credits || 0;
          const newAmount = currentAmount + parseInt(creditsToAdd);

          await supabase
            .from('user_credits')
            .upsert({
              user_id: userId,
              credits: newAmount,
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'user_id',
            });
        }

        console.log(`Payment succeeded for ${userId} with plan ${planType}`);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
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
