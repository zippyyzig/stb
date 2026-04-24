"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Brand {
  id: string;
  name: string;
  logo: string;
  slug: string;
}

interface BrandsSectionProps {
  brands: Brand[];
}

const defaultBrands: Brand[] = [
  { id: "hp", name: "HP", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/HP_logo_2012.svg/120px-HP_logo_2012.svg.png", slug: "hp" },
  { id: "dell", name: "Dell", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Dell_Logo.svg/120px-Dell_Logo.svg.png", slug: "dell" },
  { id: "lenovo", name: "Lenovo", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Lenovo_logo_2015.svg/120px-Lenovo_logo_2015.svg.png", slug: "lenovo" },
  { id: "asus", name: "Asus", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/ASUS_Logo.svg/120px-ASUS_Logo.svg.png", slug: "asus" },
  { id: "acer", name: "Acer", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Acer_2011.svg/120px-Acer_2011.svg.png", slug: "acer" },
  { id: "samsung", name: "Samsung", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/120px-Samsung_Logo.svg.png", slug: "samsung" },
  { id: "tplink", name: "TP-Link", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/TP-Link_logo.svg/120px-TP-Link_logo.svg.png", slug: "tplink" },
  { id: "logitech", name: "Logitech", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Logitech_logo_2015.svg/120px-Logitech_logo_2015.svg.png", slug: "logitech" },
];

export default function BrandsSection({ brands }: BrandsSectionProps) {
  const displayBrands = brands.length > 0 ? brands : defaultBrands;
  const scrollBrands = [...displayBrands, ...displayBrands, ...displayBrands];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-3 py-4 md:px-4 md:py-6">
        {/* Section Header */}
        <div className="mb-3 flex items-center justify-between md:mb-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-0.5 rounded-full bg-primary md:h-5" />
            <h2 className="text-sm font-semibold text-foreground md:text-base">Shop by Brand</h2>
          </div>
          <Link
            href="/brands"
            className="flex items-center gap-0.5 text-[11px] font-medium text-primary transition-colors hover:text-stb-red-dark md:text-xs"
          >
            View All <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Brands Marquee */}
        <div className="relative overflow-hidden rounded-lg border border-border bg-muted/30 py-4 md:py-5">
          {/* Gradient edges */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-muted/80 to-transparent md:w-12" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-muted/80 to-transparent md:w-12" />

          <div
            className="brand-track flex min-w-max items-center gap-6 px-4 md:gap-8"
            style={{ animation: "brandScroll 40s linear infinite" }}
          >
            {scrollBrands.map((brand, index) => (
              <Link
                key={`${brand.slug}-${index}`}
                href={`/brand/${brand.slug}`}
                className="group flex shrink-0 flex-col items-center gap-1"
              >
                <div className="flex h-10 w-16 items-center justify-center rounded bg-white p-1.5 transition-all group-hover:shadow-sm md:h-12 md:w-20 md:p-2">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={64}
                    height={32}
                    className="h-auto max-h-6 w-auto max-w-[48px] object-contain opacity-60 grayscale transition-all group-hover:opacity-100 group-hover:grayscale-0 md:max-h-7 md:max-w-[56px]"
                    unoptimized
                  />
                </div>
                <span className="text-[9px] font-medium text-muted-foreground transition-colors group-hover:text-primary md:text-[10px]">
                  {brand.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
