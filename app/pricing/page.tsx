"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

// Plan details
const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for trying out our service",
    features: [
      "5 image generations per month",
      "Basic image quality",
      "4 images per row display",
      "Download generated images",
    ],
  },
  {
    name: "Pro",
    price: "$10",
    description: "For professionals and serious creators",
    features: [
      "Unlimited image generations",
      "Premium image quality",
      "8 images per row display",
      "Priority support",
      "Commercial usage rights",
      "Advanced customization options",
    ],
  },
];

export default function PricingPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/stripe", { method: "POST" });
      if (!response.ok) throw new Error("Failed to create checkout session");

      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      toast.error("Failed to initiate upgrade");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Simple, transparent pricing</h1>
          <p className="text-muted-foreground">
            Choose the perfect plan for your needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <Card key={plan.name} className="flex flex-col">
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="text-3xl font-bold mb-6">{plan.price}</div>
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {plan.name === "Pro" ? (
                  <Button
                    className="w-full"
                    onClick={handleUpgrade}
                    disabled={isLoading || session?.user?.role === "PRO"}
                  >
                    {session?.user?.role === "PRO"
                      ? "Current Plan"
                      : "Upgrade to Pro"}
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full" disabled>
                    Free Plan
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
