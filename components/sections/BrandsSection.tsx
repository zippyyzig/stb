"use client";

import Image from "next/image";
import Link from "next/link";

const brands = [
  { name: "HP", logo: "https://picsum.photos/seed/hp/120/60", slug: "hp" },
  { name: "Dell", logo: "https://picsum.photos/seed/dell/120/60", slug: "dell" },
  { name: "Lenovo", logo: "https://picsum.photos/seed/lenovo/120/60", slug: "lenovo" },
  { name: "Asus", logo: "https://picsum.photos/seed/asus/120/60", slug: "asus" },
  { name: "Acer", logo: "https://picsum.photos/seed/acer/120/60", slug: "acer" },
  { name: "Samsung", logo: "https://picsum.photos/seed/samsung/120/60", slug: "samsung" },
  { name: "LG", logo: "https://picsum.photos/seed/lg/120/60", slug: "lg" },
  { name: "TP-Link", logo: "https://picsum.photos/seed/tplink/120/60", slug: "tp-link" },
  { name: "D-Link", logo: "https://picsum.photos/seed/dlink/120/60", slug: "d-link" },
  { name: "Hikvision", logo: "https://picsum.photos/seed/hikvision/120/60", slug: "hikvision" },
  { name: "Logitech", logo: "https://picsum.photos/seed/logitech/120/60", slug: "logitech" },
  { name: "Western Digital", logo: "https://picsum.photos/seed/wd/120/60", slug: "western-digital" },
];

export default function BrandsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      {/* Section Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-8 w-1 rounded-full bg-primary" />
          <h2 className="heading-lg">Our Trusted Brands</h2>
        </div>
        <Link
          href="/brands"
          className="body-sm font-medium text-primary hover:text-stb-red-dark transition-colors"
        >
          View All Brands
        </Link>
      </div>

      {/* Brands Marquee */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-card py-6">
        {/* Gradient overlays */}
        <div className="absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-card to-transparent" />
        <div className="absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-card to-transparent" />
        
        {/* Scrolling track */}
        <div className="brand-track flex items-center gap-12 px-4">
          {[...brands, ...brands].map((brand, index) => (
            <Link
              key={`${brand.slug}-${index}`}
              href={`/brand/${brand.slug}`}
              className="group flex shrink-0 flex-col items-center gap-2 transition-transform hover:scale-105"
            >
              <div className="flex h-16 w-28 items-center justify-center rounded-lg bg-muted p-3 transition-colors group-hover:bg-stb-red-light">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={100}
                  height={50}
                  className="h-auto max-h-10 w-auto object-contain grayscale transition-all group-hover:grayscale-0"
                  unoptimized
                />
              </div>
              <span className="body-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
