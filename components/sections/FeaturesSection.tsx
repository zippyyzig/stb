"use client";

import { Truck, Shield, Headphones, CreditCard, Package, BadgeCheck } from "lucide-react";

const features = [
  { icon: Truck, title: "Free Shipping", description: "Orders above ₹5,000" },
  { icon: Shield, title: "Secure Payment", description: "100% safe checkout" },
  { icon: Headphones, title: "24/7 Support", description: "Always here for you" },
  { icon: CreditCard, title: "Easy Returns", description: "7-day return policy" },
  { icon: Package, title: "Fast Delivery", description: "Express available" },
  { icon: BadgeCheck, title: "Genuine Products", description: "100% authentic" },
];

export default function FeaturesSection() {
  return (
    <section className="mx-auto max-w-7xl px-3 py-3 md:px-4 md:py-4">
      <div className="rounded-xl border border-border bg-white px-2 py-3 md:px-4 md:py-3.5">
        <div className="grid grid-cols-3 divide-x divide-border md:grid-cols-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`flex flex-col items-center gap-1.5 px-2 py-1 text-center md:flex-row md:items-center md:gap-3 md:px-4 md:py-2 md:text-left ${
                index >= 3 ? "hidden md:flex" : "flex"
              }`}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary md:h-9 md:w-9">
                <feature.icon className="h-4 w-4 md:h-4.5 md:w-4.5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-foreground md:text-xs">{feature.title}</p>
                <p className="hidden text-[10px] text-muted-foreground md:block">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
