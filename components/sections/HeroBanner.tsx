"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight } from "lucide-react";

// Main slider images
const mainSliderImages = [
  {
    src: "https://images.unsplash.com/photo-1576088137266-a6cba01057ed?w=900&h=420&fit=crop",
    alt: "Dashcam & Mobility",
    label: "Mobility",
    link: "/category/mobility",
    tag: "New Arrivals",
  },
  {
    src: "https://images.unsplash.com/photo-1544985562-128e7b377a21?w=900&h=420&fit=crop",
    alt: "HP Printer",
    label: "Printers & Scanners",
    link: "/category/printers",
    tag: "Top Seller",
  },
  {
    src: "https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=900&h=420&fit=crop",
    alt: "Desktop Cabinet",
    label: "Desktop Systems",
    link: "/category/desktop",
    tag: "Best Deals",
  },
  {
    src: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=900&h=420&fit=crop",
    alt: "LED Monitor BenQ",
    label: "Displays",
    link: "/category/display",
    tag: "Hot",
  },
  {
    src: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=900&h=420&fit=crop",
    alt: "TP-Link Router",
    label: "Networking",
    link: "/category/networking",
    tag: "Featured",
  },
  {
    src: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&h=420&fit=crop",
    alt: "Branded Laptop",
    label: "Laptops",
    link: "/category/laptop",
    tag: "Trending",
  },
];

// Side banners - shown on desktop
const sideBanners = [
  {
    label: "Hot Deals",
    title: "Software Licenses",
    subtitle: "Up to 40% Off",
    link: "/category/software",
    bg: "from-primary to-stb-red-dark",
    textAccent: "text-white/80",
  },
  {
    label: "New Arrivals",
    title: "Gaming Peripherals",
    subtitle: "Premium Quality",
    link: "/category/peripherals",
    bg: "from-stb-dark to-stb-darker",
    textAccent: "text-primary",
  },
];

export default function HeroBanner() {
  const [mainApi, setMainApi] = useState<CarouselApi>();
  const [mainCurrent, setMainCurrent] = useState(0);

  const onMainSelect = useCallback(() => {
    if (!mainApi) return;
    setMainCurrent(mainApi.selectedScrollSnap());
  }, [mainApi]);

  useEffect(() => {
    if (!mainApi) return;
    onMainSelect();
    mainApi.on("select", onMainSelect);
    mainApi.on("reInit", onMainSelect);
    return () => {
      mainApi.off("select", onMainSelect);
      mainApi.off("reInit", onMainSelect);
    };
  }, [mainApi, onMainSelect]);

  return (
    <section className="mx-auto max-w-7xl px-3 pt-3 md:px-4 md:pt-4">
      <div className="flex gap-3">
        {/* Main Slider */}
        <div className="relative min-w-0 flex-1">
          <Carousel
            opts={{ loop: true }}
            plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]}
            setApi={setMainApi}
            className="w-full"
          >
            <CarouselContent>
              {mainSliderImages.map((slide, index) => (
                <CarouselItem key={index}>
                  <Link href={slide.link} className="block">
                    <div className="relative w-full overflow-hidden rounded-xl bg-muted" style={{ aspectRatio: "16/7" }}>
                      <Image
                        src={slide.src}
                        alt={slide.alt}
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-105"
                        priority={index === 0}
                        unoptimized
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
                      {/* Content */}
                      <div className="absolute bottom-0 left-0 p-4 md:p-6">
                        <span className="inline-block rounded-md bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white md:text-xs">
                          {slide.tag}
                        </span>
                        <h2 className="mt-1.5 text-base font-bold text-white text-balance md:mt-2 md:text-2xl">
                          {slide.label}
                        </h2>
                        <span className="mt-1.5 hidden items-center gap-1 text-xs font-semibold text-white/90 md:mt-2 md:inline-flex md:text-sm">
                          Shop Now <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 hidden h-8 w-8 border-0 bg-white/90 text-foreground shadow-md hover:bg-white sm:flex md:left-3 md:h-9 md:w-9" />
            <CarouselNext className="right-2 hidden h-8 w-8 border-0 bg-white/90 text-foreground shadow-md hover:bg-white sm:flex md:right-3 md:h-9 md:w-9" />
          </Carousel>

          {/* Pagination dots */}
          <div className="pointer-events-none absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-1.5">
            {mainSliderImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => mainApi?.scrollTo(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`pointer-events-auto h-1.5 rounded-full transition-all duration-300 ${
                  idx === mainCurrent ? "w-6 bg-primary" : "w-1.5 bg-white/70 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Side Banners - desktop only */}
        <div className="hidden w-44 shrink-0 flex-col gap-3 lg:flex xl:w-52">
          {sideBanners.map((banner, i) => (
            <Link
              key={i}
              href={banner.link}
              className={`group relative flex flex-1 flex-col justify-center overflow-hidden rounded-xl bg-gradient-to-br p-5 ${banner.bg}`}
            >
              <span className={`text-[10px] font-semibold uppercase tracking-wider ${banner.textAccent}`}>
                {banner.label}
              </span>
              <h3 className="mt-1 text-sm font-bold text-white leading-snug">
                {banner.title}
              </h3>
              <p className="mt-0.5 text-xs text-white/70">{banner.subtitle}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-white transition-all group-hover:gap-2">
                Shop Now <ArrowRight className="h-3.5 w-3.5" />
              </span>
              {/* Decorative circles */}
              <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-white/10" />
              <div className="absolute -top-4 -right-4 h-14 w-14 rounded-full bg-white/5" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
