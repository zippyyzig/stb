"use client";

import { Truck, Shield, Headphones, RefreshCcw, Package, BadgeCheck } from "lucide-react";

const features = [
  { icon: Truck, title: "Free Shipping", desc: "On orders ₹5000+" },
  { icon: Shield, title: "Secure Payment", desc: "100% protected" },
  { icon: Headphones, title: "24/7 Support", desc: "Always available" },
  { icon: RefreshCcw, title: "Easy Returns", desc: "7-day policy" },
  { icon: Package, title: "Fast Delivery", desc: "Express shipping" },
  { icon: BadgeCheck, title: "Authentic", desc: "100% genuine" },
];

export default function FeaturesSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-3 py-3 md:px-4 md:py-4">
        {/* Mobile: Horizontal scroll strip */}
        <div className="flex gap-3 overflow-x-auto scrollbar-hide md:hidden">
          {features.slice(0, 4).map((feature) => (
            <div
              key={feature.title}
              className="flex shrink-0 items-center gap-2 rounded-lg bg-muted/50 px-3 py-2"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
                <feature.icon className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-foreground leading-tight">{feature.title}</p>
                <p className="text-[9px] text-muted-foreground">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Full width grid */}
        <div className="hidden rounded-lg border border-border bg-white md:block">
          <div className="grid grid-cols-6 divide-x divide-border">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex items-center gap-3 px-4 py-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-primary/8 text-primary">
                  <feature.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{feature.title}</p>
                  <p className="text-[10px] text-muted-foreground">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
