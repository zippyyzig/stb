"use client";

import { Truck, Shield, Headphones, CreditCard, Package, BadgeCheck } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders above Rs.5000",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% secure payment",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated support",
  },
  {
    icon: CreditCard,
    title: "Easy Returns",
    description: "7 days return policy",
  },
  {
    icon: Package,
    title: "Fast Delivery",
    description: "Express delivery available",
  },
  {
    icon: BadgeCheck,
    title: "Quality Products",
    description: "Genuine products only",
  },
];

export default function FeaturesSection() {
  return (
    <section className="border-y border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <feature.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-foreground truncate">
                  {feature.title}
                </h3>
                <p className="text-xs text-muted-foreground truncate">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
