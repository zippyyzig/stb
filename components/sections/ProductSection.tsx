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
import {
  Heart,
  ShoppingCart,
  Eye,
  ArrowRight,
  ChevronUp,
  ChevronDown,
  Star,
  Scale,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  brand: string;
  brandLogo?: string;
  productId?: string;
  itemCode?: string;
  rating?: number;
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

function ProductCard({ product }: { product: Product }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
        )
      : 0;

  const rating = product.rating || 0;

  const incrementQty = () => setQuantity((q) => q + 1);
  const decrementQty = () => setQuantity((q) => Math.max(1, q - 1));

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    setTimeout(() => setIsAddingToCart(false), 500);
  };

  return (
    <Card className="group h-full overflow-hidden border-border/50 bg-card transition-all hover:border-primary hover:shadow-xl">
      {/* Product Image */}
      <div className="relative overflow-hidden bg-muted/30">
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute left-2 top-2 z-10">
            <Badge className="rounded bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
              -{discount}%
            </Badge>
          </div>
        )}

        {/* Quickview Button - Visible on Hover */}
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/10 group-hover:opacity-100">
          <Link
            href={`/product/${product.id}`}
            className="flex items-center gap-1.5 rounded-md bg-white px-3 py-2 text-xs font-medium text-foreground shadow-lg transition-colors hover:bg-primary hover:text-white"
          >
            <Eye className="h-3.5 w-3.5" />
            Quickview
          </Link>
        </div>

        <Link href={`/product/${product.id}`} className="block p-4">
          <Image
            src={product.image}
            alt={product.name}
            width={160}
            height={160}
            className="mx-auto h-36 w-36 object-contain transition-transform group-hover:scale-105"
            unoptimized
          />
        </Link>
      </div>

      <CardContent className="flex flex-col gap-2 p-4">
        {/* Brand */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-muted-foreground">Brand:</span>
          <Link
            href={`/brand/${product.brand.toLowerCase().replace(/\s+/g, "-")}`}
            className="text-xs font-medium text-primary hover:underline"
          >
            {product.brand}
          </Link>
        </div>

        {/* Product Name */}
        <Link href={`/product/${product.id}`}>
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground transition-colors hover:text-primary">
            {product.name}
          </h3>
        </Link>

        {/* Product ID & Item Code */}
        <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground">
          {product.productId && (
            <div className="rounded bg-muted px-1.5 py-0.5">
              <span className="font-medium">ID:</span> {product.productId}
            </div>
          )}
          {product.itemCode && (
            <div className="rounded bg-muted px-1.5 py-0.5">
              <span className="font-medium">CD:</span> {product.itemCode}
            </div>
          )}
        </div>

        {/* Price Row with Brand Logo */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-foreground">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && (
                <span className="text-[10px] text-muted-foreground line-through">
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>
            {/* Stock Status */}
            <span
              className={`text-xs font-medium ${
                product.inStock ? "text-stb-success" : "text-destructive"
              }`}
            >
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>
          {/* Brand Logo */}
          {product.brandLogo && (
            <Image
              src={product.brandLogo}
              alt={product.brand}
              width={36}
              height={36}
              className="h-8 w-8 rounded object-contain"
              unoptimized
            />
          )}
        </div>

        {/* Star Rating */}
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-3 w-3 ${
                star <= rating
                  ? "fill-amber-400 text-amber-400"
                  : "fill-none text-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        {/* Quantity Stepper + Add to Cart */}
        <div className="mt-1 flex items-center gap-2">
          {/* Quantity Stepper */}
          <div className="flex h-8 items-center rounded border border-border bg-muted/30">
            <input
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="h-full w-8 bg-transparent text-center text-xs font-medium focus:outline-none"
            />
            <div className="flex flex-col border-l border-border">
              <button
                onClick={incrementQty}
                className="flex h-3.5 w-5 items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <ChevronUp className="h-2.5 w-2.5" />
              </button>
              <button
                onClick={decrementQty}
                disabled={quantity <= 1}
                className="flex h-3.5 w-5 items-center justify-center border-t border-border text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
              >
                <ChevronDown className="h-2.5 w-2.5" />
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            size="sm"
            className="h-8 flex-1 gap-1 rounded bg-primary text-[11px] font-medium hover:bg-stb-red-dark"
            disabled={!product.inStock || isAddingToCart}
            onClick={handleAddToCart}
          >
            <ShoppingCart
              className={`h-3 w-3 ${isAddingToCart ? "animate-pulse" : ""}`}
            />
            Add to Cart
          </Button>
        </div>

        {/* Wishlist & Compare Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={`flex flex-1 items-center justify-center gap-1 rounded border py-1.5 text-[10px] font-medium transition-colors ${
              isWishlisted
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary hover:text-primary"
            }`}
          >
            <Heart
              className={`h-2.5 w-2.5 ${isWishlisted ? "fill-current" : ""}`}
            />
            Wishlist
          </button>
          <button className="flex flex-1 items-center justify-center gap-1 rounded border border-border py-1.5 text-[10px] font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary">
            <Scale className="h-2.5 w-2.5" />
            Compare
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProductSection({ section }: ProductSectionProps) {
  const [activeSubcat, setActiveSubcat] = useState(section.subcategories[0]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-6">
      {/* Section Header */}
      <div className="mb-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {/* Title Bar */}
        <div className="flex items-center justify-between bg-stb-dark px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1.5 rounded-full bg-primary" />
            <h2 className="text-lg font-bold tracking-wide text-white">
              {section.title}
            </h2>
          </div>
          <Link
            href={`/category/${section.slug}`}
            className="flex items-center gap-1.5 rounded-md bg-white/10 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/20"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Subcategory Tabs */}
        {section.subcategories.length > 0 && (
          <div className="flex flex-wrap gap-2 border-b border-border bg-muted/30 px-6 py-3">
            {section.subcategories.map((subcat) => (
              <button
                key={subcat}
                onClick={() => setActiveSubcat(subcat)}
                className={`rounded-md px-4 py-2 text-xs font-medium transition-all ${
                  activeSubcat === subcat
                    ? "bg-primary text-white shadow-sm"
                    : "border border-border bg-card text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {subcat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Carousel */}
      <Carousel opts={{ align: "start", loop: false }} className="w-full">
        <CarouselContent className="-ml-3">
          {section.products.map((product) => (
            <CarouselItem
              key={product.id}
              className="basis-1/2 pl-3 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
            >
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-4 hidden h-10 w-10 border border-border bg-card shadow-md hover:border-primary hover:bg-primary hover:text-white md:flex" />
        <CarouselNext className="-right-4 hidden h-10 w-10 border border-border bg-card shadow-md hover:border-primary hover:bg-primary hover:text-white md:flex" />
      </Carousel>
    </section>
  );
}
