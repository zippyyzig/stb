"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";

interface BannerSlide {
  title: string;
  subtitle: string;
  cta: string;
  link: string;
  image: string;
  badge?: string;
}

const bannerSlides: BannerSlide[] = [
  {
    title: "Next-Gen Computing Solutions",
    subtitle: "Explore our range of high-performance desktops and laptops for every business need.",
    cta: "Shop Now",
    link: "/category/desktop",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&h=500&fit=crop",
    badge: "New Arrivals",
  },
  {
    title: "Smart Security Systems",
    subtitle: "CCTV cameras, NVRs, and complete surveillance systems for home and office protection.",
    cta: "Explore Security",
    link: "/category/security",
    image: "https://images.unsplash.com/photo-1576088137266-a6cba01057ed?w=800&h=500&fit=crop",
    badge: "Best Seller",
  },
  {
    title: "Enterprise Networking",
    subtitle: "Enterprise-grade routers, switches, and access points from top global brands.",
    cta: "View Networking",
    link: "/category/networking",
    image: "https://images.unsplash.com/photo-1544985562-128e7b377a21?w=800&h=500&fit=crop",
    badge: "Top Deals",
  },
];

export default function HeroBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-6">
      <div className="grid gap-4 lg:grid-cols-4">
        {/* Main Carousel - Takes 3 columns */}
        <div className="lg:col-span-3">
          <Carousel opts={{ loop: true }} className="w-full">
            <CarouselContent>
              {bannerSlides.map((slide, index) => (
                <CarouselItem key={index}>
                  <div className="relative flex min-h-[300px] overflow-hidden rounded-xl bg-stb-dark md:min-h-[380px]">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        className="object-cover opacity-30"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-stb-dark via-stb-dark/90 to-transparent" />
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10 flex flex-1 flex-col justify-center p-8 md:p-12 lg:max-w-[65%]">
                      {slide.badge && (
                        <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                          <Zap className="h-3 w-3" />
                          {slide.badge}
                        </span>
                      )}
                      <h2 className="mb-3 font-heading text-3xl font-bold uppercase tracking-wide text-white md:text-4xl lg:text-5xl">
                        {slide.title}
                      </h2>
                      <p className="body-lg mb-6 max-w-lg text-white/70">
                        {slide.subtitle}
                      </p>
                      <Link href={slide.link}>
                        <Button
                          size="lg"
                          className="w-fit gap-2 rounded bg-primary px-8 text-white hover:bg-stb-red-dark"
                        >
                          {slide.cta}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>

                    {/* Product Image */}
                    <div className="absolute bottom-0 right-0 hidden h-full w-1/3 items-end lg:flex">
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        width={350}
                        height={280}
                        className="h-auto w-full object-contain drop-shadow-2xl"
                        unoptimized
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-4 hidden h-12 w-12 border-0 bg-white shadow-lg hover:bg-white hover:text-primary md:flex" />
            <CarouselNext className="-right-4 hidden h-12 w-12 border-0 bg-white shadow-lg hover:bg-white hover:text-primary md:flex" />
          </Carousel>
        </div>

        {/* Side Promo Banners - 1 column */}
        <div className="hidden flex-col gap-4 lg:flex">
          <Link
            href="/category/software"
            className="group relative flex-1 overflow-hidden rounded-xl bg-primary p-5"
          >
            <div className="relative z-10">
              <span className="body-sm font-medium text-white/80">Hot Deals</span>
              <h3 className="heading-md mt-1 text-white">Software Licenses</h3>
              <p className="body-sm mt-2 text-white/70">Up to 40% Off</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-white group-hover:gap-2 transition-all">
                Shop Now <ArrowRight className="h-4 w-4" />
              </span>
            </div>
            <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-white/10" />
            <div className="absolute -top-4 -right-8 h-20 w-20 rounded-full bg-white/10" />
          </Link>
          
          <Link
            href="/category/peripherals"
            className="group relative flex-1 overflow-hidden rounded-xl bg-stb-dark p-5"
          >
            <div className="relative z-10">
              <span className="body-sm font-medium text-primary">New Arrivals</span>
              <h3 className="heading-md mt-1 text-white">Gaming Peripherals</h3>
              <p className="body-sm mt-2 text-white/70">Premium Quality</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-white group-hover:gap-2 transition-all">
                Explore <ArrowRight className="h-4 w-4" />
              </span>
            </div>
            <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-primary/20" />
            <div className="absolute -top-4 -right-8 h-20 w-20 rounded-full bg-primary/10" />
          </Link>
        </div>
      </div>
    </section>
  );
}
