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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Eye, ArrowRight } from "lucide-react";

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

  const discount = (product: Product) => {
    if (product.originalPrice && product.originalPrice > product.price) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return 0;
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-6">
      {/* Section Header with Red accent */}
      <div className="mb-6 overflow-hidden rounded-xl border border-border bg-card">
        {/* Title Bar */}
        <div className="flex items-center justify-between bg-stb-dark px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1 rounded-full bg-primary" />
            <h2 className="heading-md text-white">{section.title}</h2>
          </div>
          <Link
            href={`/category/${section.slug}`}
            className="flex items-center gap-1 text-sm font-medium text-white/80 transition-colors hover:text-white"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Subcategory Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-border bg-muted/50 px-6 py-3">
          {section.subcategories.map((subcat) => (
            <button
              key={subcat}
              onClick={() => setActiveSubcat(subcat)}
              className={`body-sm rounded-md px-4 py-2 font-medium transition-all ${
                activeSubcat === subcat
                  ? "bg-primary text-white shadow-sm"
                  : "bg-card text-muted-foreground hover:bg-card hover:text-foreground border border-border"
              }`}
            >
              {subcat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Carousel */}
      <Carousel opts={{ align: "start", loop: false }} className="w-full">
        <CarouselContent className="-ml-3">
          {section.products.map((product) => (
            <CarouselItem
              key={product.id}
              className="basis-1/2 pl-3 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
            >
              <Card className="group h-full overflow-hidden border-border transition-all hover:border-primary hover:shadow-lg">
                {/* Product Image */}
                <div className="relative overflow-hidden bg-muted p-4">
                  {/* Discount Badge */}
                  {discount(product) > 0 && (
                    <div className="absolute left-2 top-2 z-10">
                      <Badge className="rounded bg-primary px-2 py-0.5 text-xs font-bold text-white">
                        -{discount(product)}%
                      </Badge>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="absolute right-2 top-2 z-10 flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md hover:bg-primary hover:text-white transition-colors">
                      <Heart className="h-4 w-4" />
                    </button>
                    <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md hover:bg-primary hover:text-white transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>

                  <Link href={`/product/${product.id}`}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={160}
                      height={160}
                      className="mx-auto h-36 w-36 object-cover transition-transform group-hover:scale-105"
                      unoptimized
                    />
                  </Link>
                </div>

                <CardContent className="flex flex-col gap-2 p-4">
                  {/* Brand */}
                  <span className="body-sm font-medium text-primary">
                    {product.brand}
                  </span>

                  {/* Product Name */}
                  <Link href={`/product/${product.id}`}>
                    <h3 className="heading-sm line-clamp-2 text-sm leading-snug text-foreground hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-foreground">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                    {product.originalPrice && (
                      <span className="body-sm text-muted-foreground line-through">
                        ₹{product.originalPrice.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>

                  {/* Stock Status & Add to Cart */}
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <Badge
                      variant={product.inStock ? "default" : "destructive"}
                      className={`text-xs ${
                        product.inStock
                          ? "border-stb-success/30 bg-stb-success/10 text-stb-success"
                          : "bg-destructive/10 text-destructive border-destructive/30"
                      }`}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                    <Button
                      size="sm"
                      className="h-8 gap-1.5 rounded bg-primary px-3 text-xs hover:bg-stb-red-dark"
                      disabled={!product.inStock}
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-4 hidden h-10 w-10 border border-border bg-card shadow-sm hover:bg-primary hover:text-white hover:border-primary md:flex" />
        <CarouselNext className="-right-4 hidden h-10 w-10 border border-border bg-card shadow-sm hover:bg-primary hover:text-white hover:border-primary md:flex" />
      </Carousel>
    </section>
  );
}
