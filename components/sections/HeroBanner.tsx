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
  gradient: string;
  image: string;
}

const bannerSlides: BannerSlide[] = [
  {
    title: "Next-Gen Computing",
    subtitle: "Explore our range of high-performance desktops and laptops for every need.",
    cta: "Shop Now",
    link: "/category/desktop",
    gradient: "from-[#1560BD] to-[#0E4D96]",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&h=400&fit=crop",
  },
  {
    title: "Smart Security Solutions",
    subtitle:
      "CCTV cameras, NVRs, and complete surveillance systems for home and office.",
    cta: "Explore Security",
    link: "/category/security",
    gradient: "from-[#0F172A] to-[#1E293B]",
    image: "https://images.unsplash.com/photo-1576088137266-a6cba01057ed?w=600&h=400&fit=crop",
  },
  {
    title: "Network Like a Pro",
    subtitle: "Enterprise-grade routers, switches, and access points from top brands.",
    cta: "View Networking",
    link: "/category/networking",
    gradient: "from-[#10B981] to-[#059669]",
    image: "https://images.unsplash.com/photo-1544985562-128e7b377a21?w=600&h=400&fit=crop",
  },
];

export default function HeroBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-6">
      <Carousel opts={{ loop: true }} className="w-full">
        <CarouselContent>
          {bannerSlides.map((slide, index) => (
            <CarouselItem key={index}>
              <div
                className={`relative flex min-h-[320px] overflow-hidden rounded-2xl bg-gradient-to-r ${slide.gradient} md:min-h-[400px]`}
              >
                <div className="flex flex-1 flex-col justify-center p-8 md:p-12 lg:max-w-[55%]">
                  <h2 className="mb-3 font-heading text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                    {slide.title}
                  </h2>
                  <p className="body-lg mb-6 max-w-md text-white/80">
                    {slide.subtitle}
                  </p>
                  <Link href={slide.link}>
                    <Button
                      size="lg"
                      className="w-fit gap-2 rounded-full bg-white text-primary hover:bg-white/90"
                    >
                      {slide.cta}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="hidden items-center justify-center p-8 lg:flex lg:flex-1">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    width={400}
                    height={300}
                    className="h-full max-h-[300px] w-auto rounded-xl object-cover shadow-lg"
                    unoptimized
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-4 hidden h-12 w-12 border-0 bg-white/90 shadow-md hover:bg-white md:flex" />
        <CarouselNext className="-right-4 hidden h-12 w-12 border-0 bg-white/90 shadow-md hover:bg-white md:flex" />
      </Carousel>
    </section>
  );
}
