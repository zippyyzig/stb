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

// Default brands shown when DB returns empty
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

  // Triple the array so the marquee seamlessly loops (we animate the first 2/3)
  const scrollBrands = [...displayBrands, ...displayBrands, ...displayBrands];

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
          className="body-sm font-medium text-primary transition-colors hover:text-stb-red-dark"
        >
          View All Brands
        </Link>
      </div>

      {/* Brands Marquee */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-card py-6">
        {/* Gradient fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-card to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-card to-transparent" />

        {/* Scrolling track — animation drives translateX from 0 to -33.33% (one full copy width) */}
        <div
          className="brand-track flex min-w-max items-center gap-10 px-4"
          style={{ animation: "brandScroll 40s linear infinite" }}
        >
          {scrollBrands.map((brand, index) => (
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
                  className="h-auto max-h-10 w-auto max-w-[90px] object-contain grayscale transition-all group-hover:grayscale-0"
                  unoptimized
                />
              </div>
              <span className="body-sm font-medium text-muted-foreground transition-colors group-hover:text-primary">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
