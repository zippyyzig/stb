"use client";

import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, ArrowRight } from "lucide-react";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  brand: string;
}

interface ProductSectionData {
  title: string;
  slug: string;
  subcategories: string[];
  products: Product[];
}

interface ProductSectionProps {
  section: ProductSectionData;
}

export default function ProductSection({ section }: ProductSectionProps) {
  const [activeSubcat, setActiveSubcat] = useState(section.subcategories[0]);

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="heading-lg">{section.title}</h2>
            <p className="body-md mt-1 text-muted-foreground">
              Explore our {section.title.toLowerCase()} collection
            </p>
          </div>
          <Link
            href={`/category/${section.slug}`}
            className="body-sm group flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            View all
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Subcategory Pills */}
        <div className="mb-6 flex flex-wrap gap-2">
          {section.subcategories.map((subcat) => (
            <button
              key={subcat}
              onClick={() => setActiveSubcat(subcat)}
              className={`rounded-full px-4 py-2 text-sm transition-all ${
                activeSubcat === subcat
                  ? "bg-foreground font-medium text-background"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {subcat}
            </button>
          ))}
        </div>

        {/* Product Carousel */}
        <Carousel opts={{ align: "start", loop: false }} className="w-full">
          <CarouselContent className="-ml-4">
            {section.products.map((product) => {
              const discount = product.originalPrice
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;

              return (
                <CarouselItem
                  key={product.id}
                  className="basis-1/2 pl-4 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
                >
                  <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-foreground/20 hover:shadow-lg">
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      {/* Discount Badge */}
                      {discount > 0 && (
                        <Badge className="absolute left-3 top-3 z-10 bg-accent text-accent-foreground">
                          -{discount}%
                        </Badge>
                      )}

                      {/* Wishlist Button */}
                      <button className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-card/90 opacity-0 shadow-sm transition-all hover:bg-card group-hover:opacity-100">
                        <Heart className="h-4 w-4 text-muted-foreground hover:text-accent" />
                      </button>

                      <Link href={`/product/${product.id}`} className="block h-full">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover p-4 transition-transform duration-300 group-hover:scale-105"
                          unoptimized
                        />
                      </Link>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-1 flex-col p-4">
                      {/* Brand */}
                      <span className="label-uppercase text-muted-foreground">
                        {product.brand}
                      </span>

                      {/* Name */}
                      <Link href={`/product/${product.id}`} className="mt-1.5">
                        <h3 className="body-md line-clamp-2 font-medium text-foreground transition-colors hover:text-accent">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Price */}
                      <div className="mt-auto flex items-baseline gap-2 pt-3">
                        <span className="heading-md text-foreground">
                          ₹{product.price.toLocaleString("en-IN")}
                        </span>
                        {product.originalPrice && (
                          <span className="body-sm text-muted-foreground line-through">
                            ₹{product.originalPrice.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>

                      {/* Stock & Cart */}
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <span
                          className={`body-sm ${
                            product.inStock ? "text-stb-success" : "text-destructive"
                          }`}
                        >
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                        <Button
                          size="sm"
                          variant={product.inStock ? "default" : "outline"}
                          className="h-8 gap-1.5 rounded-full px-3"
                          disabled={!product.inStock}
                        >
                          <ShoppingCart className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Add</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <div className="mt-6 flex items-center justify-end gap-2">
            <CarouselPrevious className="static h-10 w-10 translate-x-0 translate-y-0 rounded-full border-border" />
            <CarouselNext className="static h-10 w-10 translate-x-0 translate-y-0 rounded-full border-border" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
