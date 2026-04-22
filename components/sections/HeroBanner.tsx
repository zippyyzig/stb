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
import {
  Monitor,
  Laptop,
  HardDrive,
  MonitorSpeaker,
  Keyboard,
  Printer,
  Shield,
  Wifi,
  Code,
  Smartphone,
  Cable,
  Plug,
  Camera,
  Phone,
} from "lucide-react";

// Category links
const categoryLinks = [
  { name: "Desktop", href: "/category/desktop", icon: Monitor },
  { name: "Laptop", href: "/category/laptop", icon: Laptop },
  { name: "Storage", href: "/category/storage", icon: HardDrive },
  { name: "Display", href: "/category/display", icon: MonitorSpeaker },
  { name: "Peripherals", href: "/category/peripherals", icon: Keyboard },
  { name: "Printers & Scanners", href: "/category/printers", icon: Printer },
  { name: "Security", href: "/category/security", icon: Shield },
  { name: "Networking", href: "/category/networking", icon: Wifi },
  { name: "Software", href: "/category/software", icon: Code },
  { name: "Mobility", href: "/category/mobility", icon: Smartphone },
  { name: "Cables", href: "/category/cables", icon: Cable },
  { name: "Connector & Converter", href: "/category/connectors", icon: Plug },
  { name: "CCTV Accessories", href: "/category/cctv-accessories", icon: Camera },
  { name: "Telecom", href: "/category/telecom", icon: Phone },
];

// Left side promotional slider images
const leftSliderImages = [
  {
    src: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=512&h=500&fit=crop",
    alt: "Hard Drive Storage",
    link: "/category/storage",
  },
  {
    src: "https://images.unsplash.com/photo-1591799265444-d66432b91588?w=512&h=500&fit=crop",
    alt: "Power Supply Units",
    link: "/category/desktop",
  },
  {
    src: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=512&h=500&fit=crop",
    alt: "USB Hubs",
    link: "/category/connectors",
  },
  {
    src: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=512&h=500&fit=crop",
    alt: "LED Television",
    link: "/category/display",
  },
];

// Main right slider images
const mainSliderImages = [
  {
    src: "https://images.unsplash.com/photo-1576088137266-a6cba01057ed?w=768&h=500&fit=crop",
    alt: "Dashcam EVM",
    link: "/category/mobility",
  },
  {
    src: "https://images.unsplash.com/photo-1544985562-128e7b377a21?w=768&h=500&fit=crop",
    alt: "HP Printer",
    link: "/category/printers",
  },
  {
    src: "https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=768&h=500&fit=crop",
    alt: "Desktop Cabinet",
    link: "/category/desktop",
  },
  {
    src: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=768&h=500&fit=crop",
    alt: "LED Monitor BenQ",
    link: "/category/display",
  },
  {
    src: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=768&h=500&fit=crop",
    alt: "Gamepad Controller",
    link: "/category/peripherals",
  },
  {
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=768&h=500&fit=crop",
    alt: "Antivirus Software",
    link: "/category/software",
  },
  {
    src: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=768&h=500&fit=crop",
    alt: "TP-Link Router",
    link: "/category/networking",
  },
  {
    src: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=768&h=500&fit=crop",
    alt: "Branded Laptop",
    link: "/category/laptop",
  },
];

export default function HeroBanner() {
  // Main slider API + state
  const [mainApi, setMainApi] = useState<CarouselApi>();
  const [mainCurrent, setMainCurrent] = useState(0);

  // Left slider API + state
  const [leftApi, setLeftApi] = useState<CarouselApi>();
  const [leftCurrent, setLeftCurrent] = useState(0);

  // Sync main slider selected index
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

  // Sync left slider selected index
  const onLeftSelect = useCallback(() => {
    if (!leftApi) return;
    setLeftCurrent(leftApi.selectedScrollSnap());
  }, [leftApi]);

  useEffect(() => {
    if (!leftApi) return;
    onLeftSelect();
    leftApi.on("select", onLeftSelect);
    leftApi.on("reInit", onLeftSelect);
    return () => {
      leftApi.off("select", onLeftSelect);
      leftApi.off("reInit", onLeftSelect);
    };
  }, [leftApi, onLeftSelect]);

  return (
    <section className="mx-auto max-w-7xl px-4 pt-4">
      {/* Top Category Links Bar */}
      <div className="mb-4 hidden overflow-x-auto rounded-lg border border-border bg-card p-2 lg:block">
        <div className="flex items-center gap-1">
          {categoryLinks.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="flex shrink-0 items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary hover:text-white"
            >
              <cat.icon className="h-3.5 w-3.5" />
              <span className="whitespace-nowrap">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Three Column Hero Layout */}
      <div className="grid gap-3 lg:grid-cols-12">
        {/* Left Promotional Slider */}
        <div className="relative hidden overflow-hidden rounded-xl lg:col-span-3 lg:block">
          <Carousel
            opts={{ loop: true }}
            plugins={[Autoplay({ delay: 4000, stopOnInteraction: false })]}
            setApi={setLeftApi}
            className="w-full"
          >
            <CarouselContent>
              {leftSliderImages.map((slide, index) => (
                <CarouselItem key={index}>
                  <Link href={slide.link} className="block">
                    <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
                      <Image
                        src={slide.src}
                        alt={slide.alt}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                        unoptimized
                      />
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          {/* Pagination Dots — outside Carousel, positioned over the slide area */}
          <div className="pointer-events-none absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-1.5">
            {leftSliderImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => leftApi?.scrollTo(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`pointer-events-auto h-2 rounded-full transition-all duration-300 ${
                  idx === leftCurrent
                    ? "w-5 bg-primary"
                    : "w-2 bg-white/70 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Main Slider */}
        <div className="relative lg:col-span-6">
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
                    <div className="relative aspect-[768/500] overflow-hidden rounded-xl bg-muted">
                      <Image
                        src={slide.src}
                        alt={slide.alt}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                        priority={index === 0}
                        unoptimized
                      />
                      {/* Dark overlay for text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      {/* Slide Label */}
                      <div className="absolute bottom-10 left-4 z-10">
                        <span className="rounded bg-primary px-3 py-1.5 text-sm font-medium text-white shadow">
                          {slide.alt}
                        </span>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-3 h-10 w-10 border-0 bg-white/90 shadow-lg hover:bg-white md:-left-5" />
            <CarouselNext className="-right-3 h-10 w-10 border-0 bg-white/90 shadow-lg hover:bg-white md:-right-5" />
          </Carousel>
          {/* Pagination Dots */}
          <div className="pointer-events-none absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-1.5">
            {mainSliderImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => mainApi?.scrollTo(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`pointer-events-auto h-2 rounded-full transition-all duration-300 ${
                  idx === mainCurrent
                    ? "w-6 bg-primary"
                    : "w-2 bg-white/70 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Side Banner Stack */}
        <div className="hidden flex-col gap-3 lg:col-span-3 lg:flex">
          {/* Top Banner */}
          <Link
            href="/category/software"
            className="group relative flex-1 overflow-hidden rounded-xl bg-primary"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-stb-red-dark" />
            <div className="relative z-10 flex h-full flex-col justify-center p-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
                Hot Deals
              </span>
              <h3 className="mt-1 text-lg font-bold text-white">
                Software Licenses
              </h3>
              <p className="mt-1 text-sm text-white/70">Up to 40% Off</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-white transition-all group-hover:gap-2">
                Shop Now
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
            <div className="absolute -bottom-6 -right-6 h-28 w-28 rounded-full bg-white/10" />
            <div className="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-white/5" />
          </Link>

          {/* Bottom Banner */}
          <Link
            href="/category/peripherals"
            className="group relative flex-1 overflow-hidden rounded-xl bg-stb-dark"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-stb-dark to-black" />
            <div className="relative z-10 flex h-full flex-col justify-center p-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                New Arrivals
              </span>
              <h3 className="mt-1 text-lg font-bold text-white">
                Gaming Peripherals
              </h3>
              <p className="mt-1 text-sm text-white/70">Premium Quality</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-white transition-all group-hover:gap-2">
                Explore
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
            <div className="absolute -bottom-6 -right-6 h-28 w-28 rounded-full bg-primary/20" />
            <div className="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-primary/10" />
          </Link>
        </div>
      </div>
    </section>
  );
}
