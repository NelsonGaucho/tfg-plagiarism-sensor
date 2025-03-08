
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CreditCard, ShieldCheck, Lock, Tag, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Initialize Stripe with public key - use a try/catch to prevent errors from breaking the app
let stripePromise;
try {
  stripePromise = loadStripe('pk_live_51NG1WAApPssJbISHbPMcYV8oL8mnAK6lWO3tT0K20RQ1dR2tHqi5YboYlq6uJBT6YYY86F6CRgtmpYvPok9CGORA00qIxCoDjI');
} catch (error) {
  console.error("Error loading Stripe:", error);
  // We'll handle this in the component
}

const CheckoutPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [planType, setPlanType] = useState<string>('basic');
  const [loading, setLoading] = useState<boolean>(false);
  const [stripeError, setStripeError] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Get the plan type from the URL query parameter
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const plan = searchParams.get('plan');
    if (plan && ['basic', 'monthly', 'lifetime'].includes(plan)) {
      setPlanType(plan);
    }
  }, [location.search]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: 'Sesión requerida',
        description: 'Debes iniciar sesión para realizar un pago',
        variant: 'destructive',
      });
      navigate('/login?redirect=checkout');
    }
  }, [isAuthenticated, navigate, toast]);

  // Create payment intent
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const createPaymentIntent = async () => {
      setLoading(true);
      try {
        console.log("Creating payment intent for plan:", planType);
        const { data, error } = await supabase.functions.invoke('create-payment', {
          body: {
            planType,
            userId: user.id,
          },
        });

        if (error) {
          console.error("Payment intent error:", error);
          throw error;
        }
        
        console.log("Payment intent created successfully:", data);
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error creating payment intent:', error);
        toast({
          title: 'Error',
          description: 'No se pudo crear la intención de pago. Por favor, inténtalo de nuevo.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [isAuthenticated, user, planType, toast]);

  const getPlanDetails = () => {
    switch (planType) {
      case 'basic':
        return {
          name: 'Plan Básico',
          price: '5€',
          description: '5 créditos para análisis de plagio'
        };
      case 'monthly':
        return {
          name: 'Plan Mensual',
          price: '10€',
          description: 'Créditos ilimitados por 30 días'
        };
      case 'lifetime':
        return {
          name: 'Plan Vitalicio',
          price: '20€',
          description: 'Créditos ilimitados para siempre'
        };
      default:
        return {
          name: 'Plan Básico',
          price: '5€',
          description: '5 créditos para análisis de plagio'
        };
    }
  };

  const plan = getPlanDetails();

  // If Stripe failed to load, show a friendly message
  if (stripeError || !stripePromise) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Lo sentimos</h2>
          <p className="mb-6">
            Ha ocurrido un error cargando el sistema de pagos. Por favor, inténtelo más tarde.
          </p>
          <Button onClick={() => navigate('/pricing')}>Volver a Planes</Button>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return null; // We'll redirect from the useEffect
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-12">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate('/pricing')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Planes
        </Button>

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Resumen del pedido</CardTitle>
                <CardDescription>Detalles de tu compra</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                  <Badge variant="outline" className="text-primary">
                    {plan.price}
                  </Badge>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{plan.price}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 space-y-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 mr-2 text-emerald-600" />
                <span>Pago seguro con cifrado SSL</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Lock className="h-4 w-4 mr-2 text-emerald-600" />
                <span>Tus datos nunca son almacenados</span>
              </div>
            </div>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Información de pago
                </CardTitle>
                <CardDescription>
                  Por favor, introduce los datos de tu tarjeta
                </CardDescription>
              </CardHeader>
              <CardContent>
                {clientSecret && stripePromise ? (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm planType={planType} />
                  </Elements>
                ) : (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const CheckoutForm = ({ planType }: { planType: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState<string>('');
  const [processing, setProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setErrorMessage(null);

    try {
      console.log("Processing payment for plan:", planType);
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success?plan=${planType}`,
        },
        redirect: 'if_required',
      });

      if (error) {
        console.error("Payment error:", error);
        setErrorMessage(error.message || 'Error al procesar el pago');
        toast({
          title: 'Error en el pago',
          description: error.message || 'Ha ocurrido un error al procesar el pago',
          variant: 'destructive',
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log("Payment succeeded:", paymentIntent);
        toast({
          title: 'Pago completado',
          description: 'Tu pago ha sido procesado correctamente',
        });
        navigate('/payment-success?plan=' + planType);
      }
    } catch (error) {
      console.error('Payment confirmation error:', error);
      setErrorMessage('Error al procesar el pago. Por favor, inténtalo de nuevo.');
      toast({
        title: 'Error en el pago',
        description: 'Ha ocurrido un error al procesar el pago',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      <div className="space-y-2">
        <div className="flex items-center">
          <Tag className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Código de descuento (opcional)</span>
        </div>
        <Input
          type="text"
          placeholder="Introduce tu código"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
      </div>
      
      {errorMessage && (
        <div className="text-sm text-red-500">{errorMessage}</div>
      )}

      <Button 
        type="submit" 
        className="w-full" 
        disabled={!stripe || processing}
      >
        {processing ? 'Procesando...' : 'Completar pago'}
      </Button>
    </form>
  );
};

export default CheckoutPage;
