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
import { Heart, ShoppingCart } from "lucide-react";

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
    <section className="mx-auto max-w-7xl px-4 py-6">
      {/* Section Header with Subcategories */}
      <div className="mb-6 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-stb-primary-dark">
        {/* Title */}
        <div className="flex items-center justify-between px-6 pb-3 pt-4">
          <h2 className="heading-md text-white">{section.title}</h2>
          <Link
            href={`/category/${section.slug}`}
            className="body-sm text-white/80 transition-colors hover:text-white"
          >
            View All →
          </Link>
        </div>

        {/* Subcategory Tabs */}
        <div className="flex flex-wrap gap-1 px-4 pb-3">
          {section.subcategories.map((subcat) => (
            <button
              key={subcat}
              onClick={() => setActiveSubcat(subcat)}
              className={`body-sm rounded-md px-3 py-1.5 transition-colors ${
                activeSubcat === subcat
                  ? "bg-white font-medium text-primary"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
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
              <Card className="group h-full overflow-hidden border-border/50 transition-all hover:shadow-md">
                {/* Product Image */}
                <div className="relative overflow-hidden bg-muted p-4">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={128}
                    height={128}
                    className="mx-auto h-32 w-32 object-cover transition-transform group-hover:scale-105"
                    unoptimized
                  />
                  <button className="absolute right-2 top-2 rounded-full bg-white/80 p-1.5 opacity-0 transition-all hover:bg-white group-hover:opacity-100">
                    <Heart className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>

                <CardContent className="flex flex-col gap-2 p-3">
                  {/* Product Name */}
                  <Link href={`/product/${product.id}`}>
                    <h3 className="heading-sm line-clamp-2 text-sm leading-snug hover:text-primary">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Brand */}
                  <span className="body-sm text-muted-foreground">
                    {product.brand}
                  </span>

                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span className="heading-md text-primary">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                    {product.originalPrice && (
                      <span className="body-sm text-muted-foreground line-through">
                        ₹{product.originalPrice.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>

                  {/* Stock & Cart */}
                  <div className="mt-1 flex items-center justify-between">
                    <Badge
                      variant={product.inStock ? "default" : "destructive"}
                      className={`text-xs ${
                        product.inStock
                          ? "border-stb-success/30 bg-stb-success/10 text-stb-success"
                          : ""
                      }`}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 rounded-full border-primary/30 text-primary hover:bg-primary hover:text-white"
                      disabled={!product.inStock}
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-4 hidden h-10 w-10 border-border bg-card shadow-sm hover:bg-muted md:flex" />
        <CarouselNext className="-right-4 hidden h-10 w-10 border-border bg-card shadow-sm hover:bg-muted md:flex" />
      </Carousel>
    </section>
  );
}
