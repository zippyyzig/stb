"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Brand {
  id: string;
  name: string;
  logo: string;
  slug: string;
  productCount?: number;
}

interface HotBrandsSectionProps {
  brands: Brand[];
  title?: string;
}

const defaultHotBrands: Brand[] = [
  { id: "hp", name: "HP", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/HP_logo_2012.svg/120px-HP_logo_2012.svg.png", slug: "hp", productCount: 150 },
  { id: "dell", name: "Dell", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Dell_Logo.svg/120px-Dell_Logo.svg.png", slug: "dell", productCount: 120 },
  { id: "lenovo", name: "Lenovo", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Lenovo_logo_2015.svg/120px-Lenovo_logo_2015.svg.png", slug: "lenovo", productCount: 100 },
  { id: "asus", name: "Asus", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/ASUS_Logo.svg/120px-ASUS_Logo.svg.png", slug: "asus", productCount: 80 },
  { id: "acer", name: "Acer", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Acer_2011.svg/120px-Acer_2011.svg.png", slug: "acer", productCount: 60 },
  { id: "samsung", name: "Samsung", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/120px-Samsung_Logo.svg.png", slug: "samsung", productCount: 90 },
  { id: "logitech", name: "Logitech", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Logitech_logo_2015.svg/120px-Logitech_logo_2015.svg.png", slug: "logitech", productCount: 70 },
  { id: "canon", name: "Canon", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Canon_wordmark.svg/120px-Canon_wordmark.svg.png", slug: "canon", productCount: 45 },
];

export default function HotBrandsSection({ brands, title = "Hot Brands" }: HotBrandsSectionProps) {
  const displayBrands = brands && brands.length > 0 ? brands : defaultHotBrands;

  if (displayBrands.length === 0) return null;

  return (
    <section className="bg-gradient-to-r from-violet-50 to-purple-50 py-4 md:py-6">
      <div className="mx-auto max-w-7xl px-3 md:px-4">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between gap-2 md:mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 md:h-7 md:w-7">
              <Sparkles className="h-3 w-3 text-white md:h-3.5 md:w-3.5" />
            </div>
            <h2 className="text-sm font-bold text-foreground md:text-base">{title}</h2>
          </div>
          <Link
            href="/brands"
            className="flex shrink-0 items-center gap-0.5 text-[11px] font-semibold text-primary hover:text-stb-red-dark md:text-xs"
          >
            View All <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Brands carousel */}
        <Carousel
          opts={{ align: "start", loop: false, skipSnaps: true }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-3">
            {displayBrands.map((brand) => (
              <CarouselItem
                key={brand.id}
                className="basis-1/3 pl-2 sm:basis-1/4 md:basis-1/5 md:pl-3 lg:basis-1/6"
              >
                <Link
                  href={`/brand/${brand.slug}`}
                  className="group flex flex-col items-center rounded-xl border border-border bg-white p-3 shadow-sm transition-all hover:border-primary/30 hover:shadow-md md:p-4"
                >
                  <div className="flex h-12 w-full items-center justify-center md:h-16">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      width={80}
                      height={40}
                      className="h-auto max-h-8 w-auto max-w-[60px] object-contain opacity-70 grayscale transition-all group-hover:opacity-100 group-hover:grayscale-0 md:max-h-10 md:max-w-[80px]"
                      unoptimized
                    />
                  </div>
                  <span className="mt-2 text-[10px] font-medium text-muted-foreground transition-colors group-hover:text-primary md:text-xs">
                    {brand.name}
                  </span>
                  {brand.productCount && brand.productCount > 0 && (
                    <span className="mt-0.5 text-[8px] text-muted-foreground md:text-[9px]">
                      {brand.productCount} products
                    </span>
                  )}
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0 hidden h-8 w-8 border border-border bg-white shadow-sm hover:border-primary hover:bg-primary hover:text-white md:flex" />
          <CarouselNext className="right-0 hidden h-8 w-8 border border-border bg-white shadow-sm hover:border-primary hover:bg-primary hover:text-white md:flex" />
        </Carousel>
      </div>
    </section>
  );
}
