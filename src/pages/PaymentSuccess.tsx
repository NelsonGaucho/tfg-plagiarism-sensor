
import React from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const plan = searchParams.get('plan') || 'premium';

  const getPlanName = () => {
    switch (plan) {
      case 'basic':
        return 'Plan Básico';
      case 'monthly':
        return 'Plan Mensual';
      case 'lifetime':
        return 'Plan Vitalicio';
      default:
        return 'Premium';
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-16 p-6 text-center">
        <div className="mb-6 flex justify-center">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">¡Pago completado!</h1>
        <p className="text-gray-600 mb-6">
          Tu compra de {getPlanName()} ha sido procesada correctamente.
          Los créditos han sido añadidos a tu cuenta.
        </p>
        <div className="space-y-3">
          <Button
            onClick={() => navigate('/')}
            className="w-full"
          >
            Ir al detector de plagio
          </Button>
          <Button
            onClick={() => navigate('/pricing')}
            variant="outline"
            className="w-full"
          >
            Ver más planes
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentSuccess;
