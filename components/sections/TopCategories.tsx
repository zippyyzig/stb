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

// Default categories to show if none are provided
const defaultCategories: Category[] = [
  {
    id: "desktop",
    name: "Desktop",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=200&h=200&fit=crop",
    slug: "desktop",
    productCount: 0,
  },
  {
    id: "laptop",
    name: "Laptop",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop",
    slug: "laptop",
    productCount: 0,
  },
  {
    id: "storage",
    name: "Storage",
    image: "https://images.unsplash.com/photo-1653179767378-98bb414f9bfd?w=200&h=200&fit=crop",
    slug: "storage",
    productCount: 0,
  },
  {
    id: "display",
    name: "Display",
    image: "https://images.unsplash.com/photo-1572476359541-2a41ec8405e5?w=200&h=200&fit=crop",
    slug: "display",
    productCount: 0,
  },
  {
    id: "peripherals",
    name: "Peripherals",
    image: "https://images.unsplash.com/photo-1662758392656-0e5d4b0f53fb?w=200&h=200&fit=crop",
    slug: "peripherals",
    productCount: 0,
  },
  {
    id: "networking",
    name: "Networking",
    image: "https://images.unsplash.com/photo-1544985562-128e7b377a21?w=200&h=200&fit=crop",
    slug: "networking",
    productCount: 0,
  },
];

export default function TopCategories({ categories }: TopCategoriesProps) {
  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      {/* Section Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-8 w-1 rounded-full bg-primary" />
          <h2 className="heading-lg">Shop By Category</h2>
        </div>
        <Link
          href="/categories"
          className="body-sm font-medium text-primary hover:text-stb-red-dark transition-colors"
        >
          View All Categories
        </Link>
      </div>

      {/* Category Carousel */}
      <Carousel
        opts={{ align: "start", loop: false }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {displayCategories.map((category) => (
            <CarouselItem
              key={category.id}
              className="basis-1/3 pl-4 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
            >
              <Link
                href={`/category/${category.slug}`}
                className="group flex flex-col items-center gap-3 rounded-xl bg-card p-4 border border-border transition-all hover:border-primary hover:shadow-lg"
              >
                <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-muted p-2 transition-transform group-hover:scale-105">
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={80}
                    height={80}
                    className="h-full w-full rounded-full object-cover"
                    unoptimized
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 rounded-full bg-primary/0 transition-colors group-hover:bg-primary/10" />
                </div>
                <div className="text-center">
                  <span className="heading-sm block text-sm text-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </span>
                  {category.productCount > 0 && (
                    <span className="body-sm text-muted-foreground">
                      {category.productCount} Products
                    </span>
                  )}
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-4 hidden h-10 w-10 border border-border bg-card shadow-sm hover:bg-primary hover:text-white hover:border-primary md:flex" />
        <CarouselNext className="-right-4 hidden h-10 w-10 border border-border bg-card shadow-sm hover:bg-primary hover:text-white hover:border-primary md:flex" />
      </Carousel>
    </section>
  );
}
