"use client";

import { Truck, CreditCard, Headphones, ShieldCheck, RefreshCw, Award } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over Rs 2,000",
  },
  {
    icon: CreditCard,
    title: "Secure Payment",
    description: "100% secure transactions",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated support team",
  },
  {
    icon: ShieldCheck,
    title: "Genuine Products",
    description: "100% authentic items",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "7-day return policy",
  },
  {
    icon: Award,
    title: "Best Prices",
    description: "Competitive B2B rates",
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-stb-dark py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group flex flex-col items-center gap-3 rounded-lg p-4 text-center transition-colors hover:bg-white/5"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <feature.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="heading-sm text-sm text-white">{feature.title}</h3>
                <p className="body-sm mt-0.5 text-white/60">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
