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
import { ArrowRight } from "lucide-react";

interface BannerSlide {
  title: string;
  subtitle: string;
  cta: string;
  link: string;
  image: string;
  label: string;
}

const bannerSlides: BannerSlide[] = [
  {
    title: "Next-gen computing meets exquisite design",
    subtitle: "Explore our curated collection of high-performance desktops and laptops built for professionals.",
    cta: "Shop Desktops",
    link: "/category/desktop",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&h=600&fit=crop",
    label: "New Arrivals",
  },
  {
    title: "Smart security solutions for modern spaces",
    subtitle: "CCTV cameras, NVRs, and complete surveillance systems designed for reliability.",
    cta: "Explore Security",
    link: "/category/security",
    image: "https://images.unsplash.com/photo-1576088137266-a6cba01057ed?w=800&h=600&fit=crop",
    label: "Featured",
  },
  {
    title: "Enterprise networking made simple",
    subtitle: "Professional-grade routers, switches, and access points from industry-leading brands.",
    cta: "View Networking",
    link: "/category/networking",
    image: "https://images.unsplash.com/photo-1544985562-128e7b377a21?w=800&h=600&fit=crop",
    label: "Best Sellers",
  },
];

export default function HeroBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <Carousel opts={{ loop: true }} className="w-full">
        <CarouselContent>
          {bannerSlides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                {/* Content */}
                <div className="flex flex-col justify-center py-8 lg:py-16">
                  <span className="label-uppercase mb-4 inline-flex w-fit items-center rounded-full border border-border bg-muted px-3 py-1 text-muted-foreground">
                    {slide.label}
                  </span>
                  <h2 className="heading-display mb-6 max-w-xl text-balance">
                    {slide.title}
                  </h2>
                  <p className="body-lg mb-8 max-w-md text-pretty text-muted-foreground">
                    {slide.subtitle}
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                    <Link href={slide.link}>
                      <Button size="lg" className="gap-2 rounded-full px-8">
                        {slide.cta}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/category/all">
                      <Button variant="outline" size="lg" className="gap-2 rounded-full px-8">
                        Browse All
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted lg:aspect-auto">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    unoptimized
                    priority={index === 0}
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="mt-6 flex items-center gap-2">
          <CarouselPrevious className="static h-10 w-10 translate-x-0 translate-y-0 rounded-full border-border" />
          <CarouselNext className="static h-10 w-10 translate-x-0 translate-y-0 rounded-full border-border" />
        </div>
      </Carousel>
    </section>
  );
}
