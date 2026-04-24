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
import { ChevronRight } from "lucide-react";

// Main slider images - Desktop: 1500x450, Mobile: 450x300
const mainSliderImages = [
  {
    desktop: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=1500&h=450&fit=crop",
    mobile: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=450&h=300&fit=crop",
    alt: "High-Performance Laptops",
    title: "Power Your Business",
    subtitle: "Enterprise-grade laptops built for performance",
    cta: "Shop Laptops",
    link: "/category/laptop",
  },
  {
    desktop: "https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=1500&h=450&fit=crop",
    mobile: "https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=450&h=300&fit=crop",
    alt: "Desktop Workstations",
    title: "Desktop Solutions",
    subtitle: "Powerful workstations for every need",
    cta: "Explore Desktops",
    link: "/category/desktop",
  },
  {
    desktop: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=1500&h=450&fit=crop",
    mobile: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=450&h=300&fit=crop",
    alt: "Networking Equipment",
    title: "Connect Everything",
    subtitle: "Enterprise networking solutions",
    cta: "Shop Networking",
    link: "/category/networking",
  },
  {
    desktop: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1500&h=450&fit=crop",
    mobile: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=450&h=300&fit=crop",
    alt: "Professional Monitors",
    title: "Crystal Clear Displays",
    subtitle: "4K monitors for professionals",
    cta: "View Monitors",
    link: "/category/display",
  },
  {
    desktop: "https://images.unsplash.com/photo-1544985562-128e7b377a41?w=1500&h=450&fit=crop",
    mobile: "https://images.unsplash.com/photo-1544985562-128e7b377a41?w=450&h=300&fit=crop",
    alt: "Printers & Scanners",
    title: "Print Smarter",
    subtitle: "High-quality printing solutions",
    cta: "Shop Printers",
    link: "/category/printers",
  },
];

// Quick category links shown below slider on mobile
const quickCategories = [
  { name: "Laptops", href: "/category/laptop", icon: "💻" },
  { name: "Desktops", href: "/category/desktop", icon: "🖥️" },
  { name: "Printers", href: "/category/printers", icon: "🖨️" },
  { name: "Networking", href: "/category/networking", icon: "📡" },
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
    <section className="bg-white">
      {/* Main Slider */}
      <div className="mx-auto max-w-7xl px-3 pt-3 md:px-4 md:pt-4">
        <div className="relative overflow-hidden rounded-lg md:rounded-xl">
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
                    {/* Desktop Image - 1500x450 ratio = 3.33:1 */}
                    <div className="relative hidden md:block" style={{ aspectRatio: "1500/450" }}>
                      <Image
                        src={slide.desktop}
                        alt={slide.alt}
                        fill
                        className="object-cover"
                        priority={index === 0}
                        unoptimized
                      />
                      {/* Content overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 top-0 flex flex-col justify-center p-8 lg:p-12">
                        <span className="mb-2 inline-block w-fit rounded bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                          Featured
                        </span>
                        <h2 className="text-2xl font-bold text-white md:text-3xl lg:text-4xl">
                          {slide.title}
                        </h2>
                        <p className="mt-1.5 max-w-md text-sm text-white/80 md:text-base">
                          {slide.subtitle}
                        </p>
                        <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded bg-white px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-primary hover:text-white">
                          {slide.cta} <ChevronRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>

                    {/* Mobile Image - 450x300 ratio = 1.5:1 */}
                    <div className="relative md:hidden" style={{ aspectRatio: "450/300" }}>
                      <Image
                        src={slide.mobile}
                        alt={slide.alt}
                        fill
                        className="object-cover"
                        priority={index === 0}
                        unoptimized
                      />
                      {/* Content overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <span className="mb-1.5 inline-block rounded bg-primary px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white">
                          Featured
                        </span>
                        <h2 className="text-lg font-bold text-white leading-tight">
                          {slide.title}
                        </h2>
                        <p className="mt-0.5 text-xs text-white/70">
                          {slide.subtitle}
                        </p>
                        <span className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-white">
                          {slide.cta} <ChevronRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation arrows - desktop only */}
            <CarouselPrevious className="left-3 hidden h-9 w-9 border-0 bg-white/90 text-foreground shadow-md hover:bg-white md:flex" />
            <CarouselNext className="right-3 hidden h-9 w-9 border-0 bg-white/90 text-foreground shadow-md hover:bg-white md:flex" />
          </Carousel>

          {/* Pagination dots */}
          <div className="absolute bottom-2 left-0 right-0 z-10 flex justify-center gap-1 md:bottom-3">
            {mainSliderImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => mainApi?.scrollTo(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`h-1 rounded-full transition-all ${
                  idx === mainCurrent
                    ? "w-5 bg-white md:w-6"
                    : "w-1 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Quick Categories */}
      <div className="mx-auto max-w-7xl px-3 py-3 md:hidden">
        <div className="grid grid-cols-4 gap-2">
          {quickCategories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="flex flex-col items-center gap-1 rounded-lg bg-muted/50 py-2.5 transition-colors hover:bg-muted"
            >
              <span className="text-lg">{cat.icon}</span>
              <span className="text-[10px] font-medium text-foreground">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
