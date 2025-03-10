
import React from 'react';
import { Layout } from "../components/Layout";
import { PricingCard } from "@/components/ui/pricing-card";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Plan {
  name: string
  price: number
  description: string
  features: string[]
  cta: string
  highlighted?: boolean
  popular?: boolean
  credits: string
  planType: string
}

const PRICING_TIERS: Plan[] = [
  {
    name: "Plan Básico",
    price: 5,
    description: "Para uso individual ocasional",
    features: [
      "5 créditos premium",
      "Análisis de coincidencias básico",
      "Soporte por email",
      "Resultados en 24 horas",
      "Formato PDF y Word",
    ],
    cta: "Comprar ahora",
    highlighted: false,
    popular: false,
    credits: "5 créditos",
    planType: "basic"
  },
  {
    name: "Plan Mensual",
    price: 10,
    description: "Para estudiantes con necesidades continuas",
    features: [
      "Créditos premium ilimitados por 30 días",
      "Análisis avanzado de coincidencias",
      "Soporte prioritario",
      "Resultados en tiempo real",
      "Análisis de citas y referencias",
      "Sugerencias de mejora detalladas",
    ],
    cta: "Suscribirse",
    highlighted: true,
    popular: true,
    credits: "Ilimitados por 30 días",
    planType: "monthly"
  },
  {
    name: "Plan Vitalicio",
    price: 20,
    description: "Acceso ilimitado para siempre",
    features: [
      "Créditos premium ilimitados para siempre",
      "Todas las características premium",
      "Acceso de por vida",
      "Actualizaciones gratuitas",
      "Soporte prioritario permanente",
      "Resultados instantáneos",
      "Acceso a herramientas avanzadas",
    ],
    cta: "Comprar acceso vitalicio",
    highlighted: false,
    popular: false,
    credits: "Ilimitados para siempre",
    planType: "lifetime"
  },
];

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const handlePurchase = (planType: string) => {
    if (isAuthenticated) {
      navigate(`/checkout?plan=${planType}`);
    } else {
      toast({
        title: 'Requiere inicio de sesión',
        description: 'Debes iniciar sesión para adquirir créditos',
        variant: 'destructive',
      });
      navigate('/login?redirect=pricing');
    }
  };
  
  return (
    <Layout>
      <div className="container max-w-6xl mx-auto py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Planes Premium</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Si quieres un informe más completo, incluyendo la información a cambiar para evitar 
            el plagio, mejora a la versión premium para obtener créditos.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          {PRICING_TIERS.map((tier) => (
            <PricingCard 
              key={tier.name} 
              tier={tier} 
              onClick={() => handlePurchase(tier.planType)}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default PricingPage;
