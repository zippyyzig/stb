"use client";

import Link from "next/link";
import { ArrowRight, Clock, Percent } from "lucide-react";

export default function PromoBanner() {
  return (
    <section className="mx-auto max-w-7xl px-3 py-4 md:px-4 md:py-5">
      <div className="grid gap-3 sm:grid-cols-2">
        {/* Deal of the Day */}
        <Link
          href="/deals"
          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-stb-dark p-5 md:p-7"
        >
          <div className="relative z-10">
            <div className="mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">Deal of the Day</span>
            </div>
            <h3 className="text-lg font-bold text-white leading-snug md:text-xl">
              Up to 50% Off on<br />Networking Equipment
            </h3>
            <p className="mt-1.5 text-xs text-white/60 md:text-sm">
              Enterprise-grade routers and switches at unbeatable prices.
            </p>
          </div>
          <div className="relative z-10 mt-4 flex items-center gap-1.5 text-sm font-semibold text-white transition-all group-hover:gap-2.5">
            Shop Deals <ArrowRight className="h-4 w-4" />
          </div>
          {/* Decorative */}
          <div className="absolute -bottom-8 -right-8 h-36 w-36 rounded-full bg-white/5" />
          <div className="absolute -top-6 right-16 h-20 w-20 rounded-full bg-primary/10" />
        </Link>

        {/* B2B Special */}
        <Link
          href="/auth/register?type=dealer"
          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-stb-red-dark p-5 md:p-7"
        >
          <div className="relative z-10">
            <div className="mb-2 flex items-center gap-2">
              <Percent className="h-4 w-4 text-white" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-white/90">B2B Special</span>
            </div>
            <h3 className="text-lg font-bold text-white leading-snug md:text-xl">
              Bulk Order Discounts<br />Available
            </h3>
            <p className="mt-1.5 text-xs text-white/70 md:text-sm">
              Register as a dealer and get exclusive wholesale prices.
            </p>
          </div>
          <div className="relative z-10 mt-4 flex items-center gap-1.5 text-sm font-semibold text-white transition-all group-hover:gap-2.5">
            Register as Dealer <ArrowRight className="h-4 w-4" />
          </div>
          {/* Decorative */}
          <div className="absolute -bottom-8 -right-8 h-36 w-36 rounded-full bg-white/10" />
          <div className="absolute -top-6 right-16 h-20 w-20 rounded-full bg-white/5" />
        </Link>
      </div>
    </section>
  );
}
