"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

export interface BannerItem {
  id: string;
  image: string;
  imageMobile?: string;
  alt: string;
  href: string;
}

interface BannerCarouselProps {
  banners: BannerItem[];
  label: string;
  autoplayDelay?: number;
  desktopRatio?: string;
  mobileRatio?: string;
  priorityFirst?: boolean;
  className?: string;
}

export default function BannerCarousel({
  banners,
  label,
  autoplayDelay = 5000,
  desktopRatio = "10 / 3",
  mobileRatio = "16 / 7",
  priorityFirst = false,
  className = "",
}: BannerCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (api) setSelected(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api, onSelect]);

  if (banners.length === 0) return null;

  const hasMultiple = banners.length > 1;

  return (
    <section aria-label={label} className={`mx-auto w-full max-w-[1440px] px-4 md:px-8 ${className}`}>
      <div className="group relative">
        <Carousel
          opts={{ loop: hasMultiple }}
          plugins={hasMultiple ? [Autoplay({ delay: autoplayDelay, stopOnInteraction: false })] : []}
          setApi={setApi}
          className="w-full overflow-hidden rounded-xl bg-white"
        >
          <CarouselContent className="ml-0">
            {banners.map((banner, i) => (
              <CarouselItem key={banner.id} className="pl-0">
                <Link href={banner.href} className="block w-full" aria-label={banner.alt}>
                  <div className="relative hidden w-full md:block" style={{ aspectRatio: desktopRatio }}>
                    <Image
                      src={banner.image}
                      alt={banner.alt}
                      fill
                      sizes="(min-width: 1440px) 1376px, 100vw"
                      className="object-cover object-center"
                      priority={priorityFirst && i === 0}
                      loading={priorityFirst && i === 0 ? undefined : "lazy"}
                      quality={80}
                    />
                  </div>
                  <div className="relative w-full md:hidden" style={{ aspectRatio: mobileRatio }}>
                    <Image
                      src={banner.imageMobile || banner.image}
                      alt={banner.alt}
                      fill
                      sizes="100vw"
                      className="object-cover object-center"
                      priority={priorityFirst && i === 0}
                      loading={priorityFirst && i === 0 ? undefined : "lazy"}
                      quality={80}
                    />
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={() => api?.scrollPrev()}
              aria-label="Previous banner"
              className="absolute left-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-rd-text shadow-md transition-transform hover:scale-105 md:flex"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => api?.scrollNext()}
              aria-label="Next banner"
              className="absolute right-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-rd-text shadow-md transition-transform hover:scale-105 md:flex"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="mt-3 flex items-center justify-center gap-1.5" role="tablist" aria-label={`${label} slides`}>
          {banners.map((banner, i) => (
            <button
              key={banner.id}
              type="button"
              role="tab"
              aria-selected={i === selected}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => api?.scrollTo(i)}
              className={`h-2 rounded-full transition-all ${
                i === selected ? "w-6 bg-white shadow-sm ring-1 ring-black/10" : "w-2 bg-[#C9C9E3]"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
