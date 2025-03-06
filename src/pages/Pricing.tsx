
import { Layout } from "@/components/Layout";
import { Pricing } from "@/components/blocks/pricing";

const plans = [
  {
    name: "BASIC",
    price: "29",
    yearlyPrice: "23",
    period: "per month",
    features: [
      "Up to 10 document scans",
      "Basic plagiarism detection",
      "24-hour support response time",
      "Single user license",
      "Standard report generation",
    ],
    description: "Perfect for students and individual projects",
    buttonText: "Start Free Trial",
    href: "/sign-up",
    isPopular: false,
  },
  {
    name: "PRO",
    price: "79",
    yearlyPrice: "63",
    period: "per month",
    features: [
      "Unlimited document scans",
      "Advanced plagiarism detection",
      "12-hour support response time",
      "Up to 3 user licenses",
      "Detailed reports with sources",
      "Document comparison tools",
      "Integration with academic databases",
    ],
    description: "Ideal for researchers and small departments",
    buttonText: "Get Started",
    href: "/sign-up",
    isPopular: true,
  },
  {
    name: "ENTERPRISE",
    price: "199",
    yearlyPrice: "159",
    period: "per month",
    features: [
      "Everything in Pro",
      "Custom detection algorithms",
      "Dedicated account manager",
      "1-hour support response time",
      "Unlimited user licenses",
      "API access for integration",
      "Custom reporting tools",
      "Educational institution discounts",
    ],
    description: "For universities and research institutions",
    buttonText: "Contact Sales",
    href: "/contact",
    isPopular: false,
  },
];

export default function PricingPage() {
  return (
    <Layout>
      <Pricing 
        plans={plans}
        title="Plagiarism Detection Pricing"
        description="Choose the plan that works for your needs
All plans include our core plagiarism detection technology with different levels of access and features."
      />
    </Layout>
  );
}
