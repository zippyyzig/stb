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

interface AdBanner {
  id: string;
  image: string;
  imageMobile?: string;
  alt: string;
  href: string;
}

interface AdBannerSliderProps {
  banners?: AdBanner[];
  showAsGrid?: boolean; // Show as 3-image grid instead of slider
}

// Default ad banners — 1500×300
const DEFAULT_AD_BANNERS: AdBanner[] = [
  {
    id: "display-ad-1",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Display%20Banner%20%281%29.jpg-IfvbMzVGhdB5gaL5i6wRQ2RaW9OF26.jpeg",
    alt: "Crystal-clear monitors and immersive screens",
    href: "/category/display",
  },
  {
    id: "storage-ad-1",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Storage%20%20Banner.jpg-Lx6JHgVmRrTdHq03J3dR1Luf3KXyIL.jpeg",
    alt: "Secure your digital life with high-speed SSDs",
    href: "/category/storage",
  },
];

export default function AdBannerSlider({ banners, showAsGrid = false }: AdBannerSliderProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // Use provided banners or default
  const AD_BANNERS = banners && banners.length > 0 ? banners : DEFAULT_AD_BANNERS;

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

  // Grid layout for 3 banners
  if (showAsGrid && AD_BANNERS.length >= 3) {
    return (
      <section className="w-full bg-[#F7F8FA] py-3 md:py-5" aria-label="Promotional banners">
        <div className="mx-auto max-w-[1500px] px-3 md:px-4">
          <div className="grid gap-3 md:grid-cols-3 md:gap-4">
            {AD_BANNERS.slice(0, 3).map((banner) => (
              <Link
                key={banner.id}
                href={banner.href}
                className="group block overflow-hidden rounded-lg shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative" style={{ aspectRatio: "5 / 1" }}>
                  <Image
                    src={banner.image}
                    alt={banner.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    unoptimized
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Slider layout
  return (
    <section className="w-full bg-[#F7F8FA] py-3 md:py-5" aria-label="Advertisement banners">
      <div className="mx-auto max-w-[1500px] px-3 md:px-4">
        <div className="relative">
          <Carousel
            opts={{ loop: true }}
            plugins={[Autoplay({ delay: 6000, stopOnInteraction: false })]}
            setApi={setApi}
            className="w-full"
          >
            <CarouselContent className="-ml-0">
              {AD_BANNERS.map((banner, i) => (
                <CarouselItem key={banner.id} className="pl-0">
                  <Link
                    href={banner.href}
                    className="group block w-full overflow-hidden rounded-lg md:rounded-xl shadow-sm"
                  >
                    {/* Desktop — 1500:300 = 5:1 */}
                    <div className="relative hidden md:block" style={{ aspectRatio: "5 / 1" }}>
                      <Image
                        src={banner.image}
                        alt={banner.alt}
                        fill
                        sizes="100vw"
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.01]"
                        priority={i === 0}
                        unoptimized
                      />
                    </div>
                    {/* Mobile — 350:150 = 7:3, same image cropped center */}
                    <div className="relative md:hidden" style={{ aspectRatio: "7 / 3" }}>
                      <Image
                        src={banner.imageMobile || banner.image}
                        alt={banner.alt}
                        fill
                        sizes="100vw"
                        className="object-cover object-center"
                        priority={i === 0}
                        unoptimized
                      />
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Arrows — desktop only */}
            {AD_BANNERS.length > 1 && (
              <>
                <CarouselPrevious className="left-2 hidden md:flex h-7 w-7 border-0 bg-white/85 text-foreground shadow hover:bg-white" />
                <CarouselNext className="right-2 hidden md:flex h-7 w-7 border-0 bg-white/85 text-foreground shadow hover:bg-white" />
              </>
            )}
          </Carousel>

          {/* Dot indicators */}
          {AD_BANNERS.length > 1 && (
            <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
              {AD_BANNERS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => api?.scrollTo(i)}
                  aria-label={`Go to ad ${i + 1}`}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === current ? "w-4 bg-primary" : "w-1 bg-black/30 hover:bg-black/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
