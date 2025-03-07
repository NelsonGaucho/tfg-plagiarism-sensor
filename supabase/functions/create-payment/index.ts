
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from 'https://esm.sh/stripe@12.11.0';

// Initialize Stripe with the secret key
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentRequest {
  planType: string;
  userId: string;
  couponCode?: string;
}

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

    const { planType, userId, couponCode } = await req.json() as PaymentRequest;

    // Define plan details
    let amount = 0;
    let planName = '';
    let creditsToAdd = 0;
    let unlimitedDays = null;
    let unlimitedForever = false;

    switch (planType) {
      case 'basic':
        amount = 500; // 5 EUR in cents
        planName = 'Plan Básico';
        creditsToAdd = 5;
        break;
      case 'monthly':
        amount = 1000; // 10 EUR in cents
        planName = 'Plan Mensual';
        unlimitedDays = 30;
        break;
      case 'lifetime':
        amount = 2000; // 20 EUR in cents
        planName = 'Plan Vitalicio';
        unlimitedForever = true;
        break;
      default:
        throw new Error('Invalid plan type');
    }

    // Apply coupon if provided (to be implemented)
    if (couponCode) {
      // Here you would validate the coupon and apply discount
      console.log(`Coupon ${couponCode} applied, but not implemented yet`);
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId,
        planType,
        planName,
        creditsToAdd: creditsToAdd.toString(),
        unlimitedDays: unlimitedDays?.toString() || '',
        unlimitedForever: unlimitedForever.toString(),
        couponCode: couponCode || '',
      },
    });

    // Record the payment information in the database
    const { data: paymentData, error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: userId,
        stripe_payment_id: paymentIntent.id,
        amount,
        plan_type: planType,
        credits_added: creditsToAdd > 0 ? creditsToAdd : null,
        unlimited_days: unlimitedDays,
        unlimited_forever: unlimitedForever,
        coupon_code: couponCode,
      });

    if (paymentError) {
      console.error('Error recording payment:', paymentError);
      throw new Error('Failed to record payment');
    }

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error processing payment:', error);
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
