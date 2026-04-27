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

// Real slider images — Desktop 1500×450 · Mobile 450×300
const SLIDES = [
  {
    desktop: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Banner%201500x450%20-%201-qzGXrBQjpz7ZwVcspENU7uNYFMmLwZ.png",
    alt: "Premium Finishes — Canon Printers",
    href: "/category/printers",
  },
  {
    desktop: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Banner%20size%201500x450%20HP%20Laptop-JS5i33Ik5vWHv2o6GXC8sloLi8sH4f.png",
    alt: "Performance Without Limits — HP Laptops",
    href: "/category/laptop",
  },
];

export default function HeroBanner() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
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

  return (
    <section className="w-full bg-white" aria-label="Featured promotions">
      <div className="relative w-full">
        <Carousel
          opts={{ loop: true }}
          plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]}
          setApi={setApi}
          className="w-full"
        >
          <CarouselContent className="-ml-0">
            {SLIDES.map((slide, i) => (
              <CarouselItem key={i} className="pl-0">
                <Link href={slide.href} className="block w-full">
                  {/* Desktop ratio 1500:450 = 10:3 */}
                  <div
                    className="relative w-full hidden md:block"
                    style={{ aspectRatio: "10 / 3" }}
                  >
                    <Image
                      src={slide.desktop}
                      alt={slide.alt}
                      fill
                      sizes="100vw"
                      className="object-cover object-center"
                      priority={i === 0}
                      unoptimized
                    />
                  </div>
                  {/* Mobile ratio 450:300 = 3:2 — use same image, crop to top */}
                  <div
                    className="relative w-full md:hidden"
                    style={{ aspectRatio: "3 / 2" }}
                  >
                    <Image
                      src={slide.desktop}
                      alt={slide.alt}
                      fill
                      sizes="100vw"
                      className="object-cover object-top"
                      priority={i === 0}
                      unoptimized
                    />
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Arrows — desktop only */}
          <CarouselPrevious className="left-2 hidden md:flex h-8 w-8 border-0 bg-white/85 text-foreground shadow hover:bg-white" />
          <CarouselNext className="right-2 hidden md:flex h-8 w-8 border-0 bg-white/85 text-foreground shadow hover:bg-white" />
        </Carousel>

        {/* Dot indicators */}
        <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-5 bg-primary" : "w-1.5 bg-white/60 hover:bg-white"
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
