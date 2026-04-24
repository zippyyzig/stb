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

interface Category {
  id: string;
  name: string;
  image: string;
  slug: string;
  productCount: number;
}

interface TopCategoriesProps {
  categories: Category[];
}

const defaultCategories: Category[] = [
  { id: "desktop", name: "Desktop", image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=200&h=200&fit=crop", slug: "desktop", productCount: 0 },
  { id: "laptop", name: "Laptop", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop", slug: "laptop", productCount: 0 },
  { id: "storage", name: "Storage", image: "https://images.unsplash.com/photo-1653179767378-98bb414f9bfd?w=200&h=200&fit=crop", slug: "storage", productCount: 0 },
  { id: "display", name: "Display", image: "https://images.unsplash.com/photo-1572476359541-2a41ec8405e5?w=200&h=200&fit=crop", slug: "display", productCount: 0 },
  { id: "peripherals", name: "Peripherals", image: "https://images.unsplash.com/photo-1662758392656-0e5d4b0f53fb?w=200&h=200&fit=crop", slug: "peripherals", productCount: 0 },
  { id: "networking", name: "Networking", image: "https://images.unsplash.com/photo-1544985562-128e7b377a21?w=200&h=200&fit=crop", slug: "networking", productCount: 0 },
];

export default function TopCategories({ categories }: TopCategoriesProps) {
  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <section className="mx-auto max-w-7xl px-3 py-4 md:px-4 md:py-6">
      {/* Section Header */}
      <div className="mb-3 flex items-center justify-between md:mb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-5 w-1 rounded-full bg-primary md:h-6" />
          <h2 className="text-base font-bold text-foreground md:text-lg">Shop By Category</h2>
        </div>
        <Link
          href="/categories"
          className="text-xs font-medium text-primary transition-colors hover:text-stb-red-dark"
        >
          View All
        </Link>
      </div>

      {/* Category Carousel */}
      <Carousel opts={{ align: "start", loop: false }} className="w-full">
        <CarouselContent className="-ml-2 md:-ml-3">
          {displayCategories.map((category) => (
            <CarouselItem
              key={category.id}
              className="basis-1/4 pl-2 sm:basis-1/5 md:basis-1/6 md:pl-3 lg:basis-[12.5%]"
            >
              <Link
                href={`/category/${category.slug}`}
                className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-white p-2.5 transition-all hover:border-primary hover:shadow-md md:p-3"
              >
                <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-secondary transition-transform group-hover:scale-105 md:h-16 md:w-16">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <span className="line-clamp-1 text-center text-[11px] font-medium text-foreground transition-colors group-hover:text-primary md:text-xs">
                  {category.name}
                </span>
                {category.productCount > 0 && (
                  <span className="hidden text-[10px] text-muted-foreground md:block">
                    {category.productCount}
                  </span>
                )}
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-3 hidden h-8 w-8 border border-border bg-white shadow-sm hover:border-primary hover:bg-primary hover:text-white md:flex" />
        <CarouselNext className="-right-3 hidden h-8 w-8 border border-border bg-white shadow-sm hover:border-primary hover:bg-primary hover:text-white md:flex" />
      </Carousel>
    </section>
  );
}
