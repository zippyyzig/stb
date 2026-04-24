"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

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
  { id: "printers", name: "Printers", image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=200&h=200&fit=crop", slug: "printers", productCount: 0 },
  { id: "security", name: "Security", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop", slug: "security", productCount: 0 },
];

export default function TopCategories({ categories }: TopCategoriesProps) {
  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-3 py-4 md:px-4 md:py-6">
        {/* Section Header */}
        <div className="mb-3 flex items-center justify-between md:mb-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-0.5 rounded-full bg-primary md:h-5" />
            <h2 className="text-sm font-semibold text-foreground md:text-base">Shop by Category</h2>
          </div>
          <Link
            href="/categories"
            className="flex items-center gap-0.5 text-[11px] font-medium text-primary transition-colors hover:text-stb-red-dark md:text-xs"
          >
            View All <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Mobile: Horizontal scroll */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide md:hidden">
          {displayCategories.slice(0, 8).map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group flex shrink-0 flex-col items-center gap-1.5"
            >
              <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-muted transition-transform group-active:scale-95">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <span className="w-14 truncate text-center text-[10px] font-medium text-foreground">
                {category.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Desktop: Grid */}
        <div className="hidden grid-cols-4 gap-3 md:grid lg:grid-cols-8">
          {displayCategories.slice(0, 8).map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group flex flex-col items-center gap-2 rounded-lg border border-border bg-white p-3 transition-all hover:border-primary/30 hover:shadow-sm"
            >
              <div className="relative h-12 w-12 overflow-hidden rounded bg-muted transition-transform group-hover:scale-105 lg:h-14 lg:w-14">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <span className="text-center text-[11px] font-medium text-foreground transition-colors group-hover:text-primary">
                {category.name}
              </span>
              {category.productCount > 0 && (
                <span className="text-[9px] text-muted-foreground">
                  {category.productCount} items
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
