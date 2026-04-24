"use client";

import Image from "next/image";
import Link from "next/link";

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
    <section className="mx-auto max-w-7xl px-3 py-4 md:px-4 md:py-6">
      {/* Section Header */}
      <div className="mb-3 flex items-center justify-between md:mb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-5 w-1 rounded-full bg-primary md:h-6" />
          <h2 className="text-base font-bold text-foreground md:text-lg">Our Trusted Brands</h2>
        </div>
        <Link href="/brands" className="text-xs font-medium text-primary hover:text-stb-red-dark">
          View All
        </Link>
      </div>

      {/* Brands Marquee */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-white py-5">
        {/* Gradient edges */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-white to-transparent" />

        <div
          className="brand-track flex min-w-max items-center gap-6 px-4 md:gap-10"
          style={{ animation: "brandScroll 40s linear infinite" }}
        >
          {scrollBrands.map((brand, index) => (
            <Link
              key={`${brand.slug}-${index}`}
              href={`/brand/${brand.slug}`}
              className="group flex shrink-0 flex-col items-center gap-1.5 transition-transform hover:scale-105"
            >
              <div className="flex h-12 w-20 items-center justify-center rounded-lg bg-secondary p-2 transition-colors group-hover:bg-stb-red-light md:h-14 md:w-24">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={80}
                  height={40}
                  className="h-auto max-h-8 w-auto max-w-[68px] object-contain grayscale transition-all group-hover:grayscale-0"
                  unoptimized
                />
              </div>
              <span className="text-[10px] font-medium text-muted-foreground transition-colors group-hover:text-primary md:text-xs">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
