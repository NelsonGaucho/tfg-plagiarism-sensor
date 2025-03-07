
import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Home, Upload, Diamond } from 'lucide-react';
import confetti from 'canvas-confetti';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [planType, setPlanType] = useState<string>('');
  
  useEffect(() => {
    // Trigger confetti effect
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    // Get plan type from query parameter
    const searchParams = new URLSearchParams(location.search);
    const plan = searchParams.get('plan');
    if (plan) {
      setPlanType(plan);
    }
  }, [location.search]);
  
  const getPlanDetails = () => {
    switch (planType) {
      case 'basic':
        return {
          name: 'Plan Básico',
          description: 'Has adquirido 5 créditos premium',
          credits: '5 créditos'
        };
      case 'monthly':
        return {
          name: 'Plan Mensual',
          description: 'Ahora tienes acceso ilimitado por 30 días',
          credits: 'Créditos ilimitados por 30 días'
        };
      case 'lifetime':
        return {
          name: 'Plan Vitalicio',
          description: 'Ahora tienes acceso ilimitado para siempre',
          credits: 'Créditos ilimitados para siempre'
        };
      default:
        return {
          name: 'Plan Premium',
          description: 'Tu compra ha sido procesada correctamente',
          credits: 'Créditos premium'
        };
    }
  };
  
  const plan = getPlanDetails();

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-[70vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="rounded-full bg-green-100 dark:bg-green-900 p-4"
                >
                  <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                </motion.div>
              </div>
              <CardTitle className="text-2xl">¡Pago completado!</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                <Diamond className="h-5 w-5" />
                <span className="font-semibold">{plan.credits}</span>
              </div>
              
              <p className="text-muted-foreground">
                Ya puedes utilizar el análisis premium para detectar y corregir el plagio en tus documentos académicos.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button 
                onClick={() => navigate('/')}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Analizar documento
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
              >
                <Home className="h-4 w-4 mr-2" />
                Volver al inicio
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default PaymentSuccessPage;
