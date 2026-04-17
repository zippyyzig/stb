"use client";

import Link from "next/link";
import { ArrowRight, Percent, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PromoBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Deal of the Day */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-stb-dark to-stb-darker p-6 md:p-8">
          <div className="relative z-10">
            <div className="mb-3 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span className="label-uppercase text-primary">Deal of the Day</span>
            </div>
            <h3 className="heading-lg text-white">
              Up to 50% Off on Networking Equipment
            </h3>
            <p className="body-md mt-2 max-w-sm text-white/70">
              Get enterprise-grade routers and switches at unbeatable prices. Limited time offer!
            </p>
            <Link href="/deals">
              <Button className="mt-6 gap-2 bg-primary hover:bg-stb-red-dark">
                Shop Deals
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          {/* Decorative elements */}
          <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/20" />
          <div className="absolute -top-10 right-20 h-24 w-24 rounded-full bg-primary/10" />
        </div>

        {/* Bulk Order Discount */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary to-stb-red-dark p-6 md:p-8">
          <div className="relative z-10">
            <div className="mb-3 flex items-center gap-2">
              <Percent className="h-5 w-5 text-white" />
              <span className="label-uppercase text-white/90">B2B Special</span>
            </div>
            <h3 className="heading-lg text-white">
              Bulk Order Discounts Available
            </h3>
            <p className="body-md mt-2 max-w-sm text-white/80">
              Register as a dealer and get exclusive wholesale prices on all products.
            </p>
            <Link href="/auth/register?type=dealer">
              <Button className="mt-6 gap-2 bg-white text-primary hover:bg-white/90">
                Register as Dealer
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          {/* Decorative elements */}
          <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="absolute -top-10 right-20 h-24 w-24 rounded-full bg-white/5" />
        </div>
      </div>
    </section>
  );
}
