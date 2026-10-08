"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { BannerItem } from "./BannerCarousel";

interface HeroBannerProps {
  banners?: BannerItem[];
}

// Default slider images — Desktop 1500×450 · Mobile 450×300
const DEFAULT_SLIDES: BannerItem[] = [
  {
    id: "display-banner",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Display%20Banner%201500x450.jpg-qH4BlgbMdr3xa4HXaH5iA5zYvxZqPW.jpeg",
    alt: "Experience Crystal-Clear Displays and Immersive Visuals",
    href: "/category/display",
  },
  {
    id: "laptops-banner",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Laptops%20Banner%201500x450-Recovered.jpg-QMLDAo6rpXnIS4BkiMXvkpOD2QUV0m.jpeg",
    alt: "Power Meets Performance - Next-Gen laptops for Work, Gaming & Creativity",
    href: "/category/laptop",
  },
  {
    id: "storage-banner",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/storage%20Banner%201500x450.jpg-EtvfDlF2RiTTXenqrp4LgEW9Gc5P9K.jpeg",
    alt: "Protect your Digital world with ultra-fast SSDs and high-capacity storage",
    href: "/category/storage",
  },
];

// Flipkart-style slider: the next slide peeks in from the right on desktop,
// one full slide with pill dots underneath on mobile.
export default function HeroBanner({ banners }: HeroBannerProps) {
  const slides = banners && banners.length > 0 ? banners : DEFAULT_SLIDES;
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelected(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  const hasMultiple = slides.length > 1;

  return (
    <section aria-label="Featured promotions" className="mx-auto mt-3 max-w-[1200px] px-3 md:mt-5 md:px-4">
      <Carousel
        opts={{ loop: hasMultiple, align: "start" }}
        plugins={hasMultiple ? [Autoplay({ delay: 4500, stopOnInteraction: false })] : []}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent className="-ml-3 md:-ml-4">
          {slides.map((banner, i) => (
            <CarouselItem key={banner.id} className="basis-full pl-3 md:basis-[62%] md:pl-4">
              <Link
                href={banner.href}
                aria-label={banner.alt}
                className="block overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5"
              >
                <div className="relative hidden aspect-[10/3] w-full md:block">
                  <Image
                    src={banner.image}
                    alt={banner.alt}
                    fill
                    sizes="(min-width: 1200px) 720px, 62vw"
                    className="object-cover object-center"
                    priority={i === 0}
                    quality={80}
                  />
                </div>
                <div className="relative aspect-[3/2] w-full md:hidden">
                  <Image
                    src={banner.imageMobile || banner.image}
                    alt={banner.alt}
                    fill
                    sizes="100vw"
                    className="object-cover object-center"
                    priority={i === 0}
                    quality={80}
                  />
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {hasMultiple && (
        <div className="mt-2.5 flex items-center justify-center gap-1.5" role="tablist" aria-label="Slides">
          {slides.map((banner, i) => (
            <button
              key={banner.id}
              type="button"
              role="tab"
              aria-selected={i === selected}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => api?.scrollTo(i)}
              className={`h-1.5 rounded-full transition-all ${i === selected ? "w-5 bg-fk-ink" : "w-1.5 bg-[#C9C9C9]"}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
