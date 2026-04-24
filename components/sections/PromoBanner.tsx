"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

// Ads banner - Desktop: 1500x300, Mobile: 350x150
const promoBanners = [
  {
    desktop: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=1500&h=300&fit=crop",
    mobile: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=350&h=150&fit=crop",
    alt: "Deal of the Day",
    label: "Limited Time",
    title: "Up to 50% Off Networking",
    subtitle: "Enterprise routers & switches",
    cta: "Shop Deals",
    link: "/deals",
    theme: "dark", // dark or light
  },
  {
    desktop: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=1500&h=300&fit=crop",
    mobile: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=350&h=150&fit=crop",
    alt: "B2B Special",
    label: "B2B Special",
    title: "Bulk Order Discounts",
    subtitle: "Register as dealer for wholesale prices",
    cta: "Register Now",
    link: "/auth/register?type=dealer",
    theme: "primary",
  },
];

export default function PromoBanner() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-3 py-4 md:px-4 md:py-6">
        <div className="grid gap-3 md:grid-cols-2 md:gap-4">
          {promoBanners.map((banner, index) => (
            <Link
              key={index}
              href={banner.link}
              className="group relative block overflow-hidden rounded-lg md:rounded-xl"
            >
              {/* Desktop Image - 1500x300 ratio = 5:1 */}
              <div className="relative hidden md:block" style={{ aspectRatio: "1500/300" }}>
                <Image
                  src={banner.desktop}
                  alt={banner.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
                <div className={`absolute inset-0 ${
                  banner.theme === "dark"
                    ? "bg-gradient-to-r from-stb-dark/90 via-stb-dark/60 to-transparent"
                    : "bg-gradient-to-r from-primary/90 via-primary/60 to-transparent"
                }`} />
                <div className="absolute bottom-0 left-0 top-0 flex flex-col justify-center p-6 lg:p-8">
                  <span className={`mb-1.5 inline-block w-fit rounded px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${
                    banner.theme === "dark" ? "bg-primary text-white" : "bg-white/20 text-white"
                  }`}>
                    {banner.label}
                  </span>
                  <h3 className="text-lg font-bold text-white lg:text-xl">{banner.title}</h3>
                  <p className="mt-0.5 text-xs text-white/80">{banner.subtitle}</p>
                  <span className="mt-3 inline-flex w-fit items-center gap-1 rounded bg-white px-3 py-1.5 text-[11px] font-semibold text-foreground transition-colors group-hover:bg-primary group-hover:text-white">
                    {banner.cta} <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </div>

              {/* Mobile Image - 350x150 ratio = 2.33:1 */}
              <div className="relative md:hidden" style={{ aspectRatio: "350/150" }}>
                <Image
                  src={banner.mobile}
                  alt={banner.alt}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className={`absolute inset-0 ${
                  banner.theme === "dark"
                    ? "bg-gradient-to-r from-stb-dark/90 via-stb-dark/50 to-transparent"
                    : "bg-gradient-to-r from-primary/90 via-primary/50 to-transparent"
                }`} />
                <div className="absolute bottom-0 left-0 top-0 flex flex-col justify-center p-3">
                  <span className={`mb-1 inline-block w-fit rounded px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wider ${
                    banner.theme === "dark" ? "bg-primary text-white" : "bg-white/20 text-white"
                  }`}>
                    {banner.label}
                  </span>
                  <h3 className="text-sm font-bold text-white leading-tight">{banner.title}</h3>
                  <p className="mt-0.5 text-[10px] text-white/70">{banner.subtitle}</p>
                  <span className="mt-2 inline-flex items-center gap-0.5 text-[10px] font-semibold text-white">
                    {banner.cta} <ChevronRight className="h-2.5 w-2.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
