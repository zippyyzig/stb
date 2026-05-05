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

interface BannerSlide {
  id: string;
  image: string;
  imageMobile?: string;
  alt: string;
  href: string;
}

interface HeroBannerProps {
  banners?: BannerSlide[];
}

// Default slider images — Desktop 1500×450 · Mobile 450×300
const DEFAULT_SLIDES: BannerSlide[] = [
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
    id: "cables-banner",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Cables%20Banner%20%281%29.jpg-GQ5Dy2K6xYJZcz6JSbSIsIQONBO6wm.jpeg",
    alt: "High-Quality Data and Power Cables Engineered for Durability",
    href: "/category/cables",
  },
  {
    id: "desktop-banner",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Desktop%20Banners.jpg-7DYFVA5RanX4nM5G6khejJwHVcSRei.jpeg",
    alt: "Powerful Workstations and sleek all-in-ones",
    href: "/category/desktop",
  },
  {
    id: "laptop-banner-2",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/laptop%20Banner.jpg-TwqjbAQGZk8VYLalCk5RtKU74dYn1y.jpeg",
    alt: "High-performance portability tailored for creators, students, and professionals",
    href: "/category/laptop",
  },
  {
    id: "mobility-banner",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mobility%20Banner.jpg-qsSE3kzvfqPmnSol5FYeIxXpl3lYsr.jpeg",
    alt: "Never Run Out of Power - Smart, Fast & Portable Charging Solutions",
    href: "/category/mobility",
  },
  {
    id: "networking-banner",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Networking%20Banner.jpg-NKZqYH6QkdmgU8sxIvT7A5bd7JTTs8.jpeg",
    alt: "Blazing Fast Internet Starts Here - Stay Connected. Stay Ahead",
    href: "/category/networking",
  },
  {
    id: "storage-banner",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/storage%20Banner%201500x450.jpg-EtvfDlF2RiTTXenqrp4LgEW9Gc5P9K.jpeg",
    alt: "Protect your Digital world with ultra-fast SSDs and high-capacity storage",
    href: "/category/storage",
  },
];

export default function HeroBanner({ banners }: HeroBannerProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // Use provided banners or default slides
  const SLIDES = banners && banners.length > 0 ? banners : DEFAULT_SLIDES;

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
              <CarouselItem key={slide.id} className="pl-0">
                <Link href={slide.href} className="block w-full">
                  {/* Desktop ratio 1500:450 = 10:3 */}
                  <div
                    className="relative w-full hidden md:block"
                    style={{ aspectRatio: "10 / 3" }}
                  >
                    <Image
                      src={slide.image}
                      alt={slide.alt}
                      fill
                      sizes="100vw"
                      className="object-cover object-center"
                      priority={i === 0}
                      unoptimized
                    />
                  </div>
                  {/* Mobile ratio 450:300 = 3:2 — use same image or mobile image, crop to top */}
                  <div
                    className="relative w-full md:hidden"
                    style={{ aspectRatio: "3 / 2" }}
                  >
                    <Image
                      src={slide.imageMobile || slide.image}
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
