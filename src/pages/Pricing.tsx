
import React, { useState } from 'react';
import { Layout } from "../components/Layout";
import { PricingCard } from "@/components/ui/pricing-card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface Plan {
  name: string
  price: Record<string, number | string>
  description: string
  features: string[]
  cta: string
  highlighted?: boolean
  popular?: boolean
}

const PRICING_TIERS: Plan[] = [
  {
    name: "Detector Básico",
    price: {
      monthly: 9.99,
      yearly: 99.99,
    },
    description: "Para estudiantes individuales con TFG/TFM",
    features: [
      "Hasta 3 documentos por mes",
      "Detección básica de plagio",
      "Soporte por email",
      "Resultados en 24 horas",
      "Formato PDF y Word",
    ],
    cta: "Empezar Gratis",
    highlighted: false,
    popular: false,
  },
  {
    name: "Detector Premium",
    price: {
      monthly: 29.99,
      yearly: 299.99,
    },
    description: "Para estudiantes avanzados y profesores",
    features: [
      "Documentos ilimitados",
      "Detección avanzada de plagio",
      "Soporte prioritario 24/7",
      "Resultados en tiempo real",
      "Análisis de citas y referencias",
      "Sugerencias de mejora",
      "Detección multilingüe",
    ],
    cta: "Comprar Ahora",
    highlighted: true,
    popular: true,
  },
  {
    name: "Institucional",
    price: {
      monthly: 99.99,
      yearly: 999.99,
    },
    description: "Para universidades y centros de investigación",
    features: [
      "Todo lo de Premium",
      "API para integración",
      "Usuario y contraseñas múltiples",
      "Personalización de informes",
      "Estadísticas avanzadas",
      "Formación para profesores",
      "Gestor de cuenta dedicado",
      "SLA garantizado",
    ],
    cta: "Contactar",
    highlighted: false,
    popular: false,
  },
];

const PricingPage: React.FC = () => {
  const [frequency, setFrequency] = useState<string>("monthly");
  
  return (
    <Layout>
      <div className="container max-w-6xl mx-auto py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Planes de Precios</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Elige el plan que mejor se adapte a tus necesidades académicas. 
            Todos los planes incluyen nuestra tecnología de detección de plagio.
          </p>
          
          <div className="mt-8 flex justify-center">
            <ToggleGroup type="single" value={frequency} onValueChange={(value) => value && setFrequency(value)}>
              <ToggleGroupItem value="monthly" aria-label="Mensual">
                Mensual
              </ToggleGroupItem>
              <ToggleGroupItem value="yearly" aria-label="Anual">
                Anual <span className="text-primary ml-1 text-xs">-16%</span>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          {PRICING_TIERS.map((tier) => (
            <PricingCard 
              key={tier.name} 
              tier={tier} 
              paymentFrequency={frequency} 
            />
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            ¿Necesitas un plan personalizado? <a href="/contact" className="text-primary font-medium">Contacta con nosotros</a>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default PricingPage;
