"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useCart, useWishlist } from "@/components/providers/CartWishlistProvider";
import {
  Heart,
  ShoppingCart,
  Star,
  Loader2,
  ChevronRight,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  image: string;
  secondImage?: string;
  priceB2C: number;
  priceB2B: number;
  mrp: number;
  inStock: boolean;
  brand: string;
  brandLogo?: string;
  productId?: string;
  itemCode?: string;
  rating?: number;
  description?: string;
}

interface SubcategoryTab {
  name: string;
  href?: string;
  isActive?: boolean;
}

interface ProductSectionData {
  title: string;
  slug: string;
  subcategories: SubcategoryTab[];
  products: Product[];
}

interface ProductSectionProps {
  section: ProductSectionData;
}

function ProductCard({ product }: { product: Product }) {
  const { data: session } = useSession();
  const router = useRouter();
  const { addToCart } = useCart();
  const { isInWishlist, toggle: toggleWishlist, isLoading: isWishlistLoading } = useWishlist();

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [imageHover, setImageHover] = useState(false);

  const isWishlisted = isInWishlist(product.id);
  const isB2B = session?.user?.isGstVerified === true;
  const displayPrice = isB2B ? product.priceB2B : product.priceB2C;
  const discount =
    product.mrp > displayPrice
      ? Math.round(((product.mrp - displayPrice) / product.mrp) * 100)
      : 0;
  const rating = product.rating || 0;

  const handleAddToCart = async () => {
    if (!session) {
      router.push(`/auth/login?callbackUrl=/product/${product.slug}`);
      return;
    }
    setIsAddingToCart(true);
    try {
      await addToCart(product.id, 1);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlist = async () => {
    if (!session) {
      router.push(`/auth/login?callbackUrl=/product/${product.slug}`);
      return;
    }
    await toggleWishlist(product.id);
  };

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-white transition-all hover:shadow-md">
      {/* Image container */}
      <div
        className="relative bg-muted/30"
        onMouseEnter={() => setImageHover(true)}
        onMouseLeave={() => setImageHover(false)}
      >
        {/* Discount badge */}
        {discount > 0 && (
          <span className="absolute left-1.5 top-1.5 z-10 rounded bg-primary px-1.5 py-0.5 text-[9px] font-semibold text-white md:left-2 md:top-2 md:text-[10px]">
            -{discount}%
          </span>
        )}

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          disabled={isWishlistLoading}
          className={`absolute right-1.5 top-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full transition-all md:right-2 md:top-2 md:h-7 md:w-7 ${
            isWishlisted
              ? "bg-primary text-white"
              : "bg-white text-muted-foreground shadow-sm hover:text-primary"
          }`}
        >
          {isWishlistLoading ? (
            <Loader2 className="h-2.5 w-2.5 animate-spin md:h-3 md:w-3" />
          ) : (
            <Heart className={`h-2.5 w-2.5 md:h-3 md:w-3 ${isWishlisted ? "fill-current" : ""}`} />
          )}
        </button>

        {/* Product image */}
        <Link href={`/product/${product.slug}`} className="block p-3 md:p-4">
          <div className="relative mx-auto h-24 w-full md:h-32">
            <Image
              src={imageHover && product.secondImage ? product.secondImage : product.image}
              alt={product.name}
              fill
              className="object-contain transition-opacity"
              unoptimized
            />
          </div>
        </Link>
      </div>

      {/* Product info */}
      <div className="flex flex-1 flex-col p-2 md:p-3">
        {/* Brand */}
        <span className="text-[9px] font-medium text-primary md:text-[10px]">{product.brand}</span>

        {/* Name */}
        <Link href={`/product/${product.slug}`}>
          <p className="mt-0.5 line-clamp-2 text-[11px] font-medium leading-tight text-foreground transition-colors hover:text-primary md:text-xs">
            {product.name}
          </p>
        </Link>

        {/* Rating */}
        <div className="mt-1 flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-2 w-2 md:h-2.5 md:w-2.5 ${
                star <= rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"
              }`}
            />
          ))}
        </div>

        {/* Price */}
        <div className="mt-auto pt-1.5">
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-foreground md:text-sm">
              ₹{displayPrice.toLocaleString("en-IN")}
            </span>
            {product.mrp > displayPrice && (
              <span className="text-[9px] text-muted-foreground line-through md:text-[10px]">
                ₹{product.mrp.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          <span className={`text-[9px] font-medium md:text-[10px] ${product.inStock ? "text-stb-success" : "text-destructive"}`}>
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        {/* Add to cart - Mobile: icon only, Desktop: full button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock || isAddingToCart}
          className="mt-2 flex w-full items-center justify-center gap-1 rounded bg-primary py-1.5 text-[10px] font-semibold text-white transition-colors hover:bg-stb-red-dark disabled:opacity-50 md:py-2 md:text-[11px]"
        >
          {isAddingToCart ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <>
              <ShoppingCart className="h-3 w-3" />
              <span className="hidden sm:inline">Add to Cart</span>
              <span className="sm:hidden">Add</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function ProductSection({ section }: ProductSectionProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-3 py-4 md:px-4 md:py-6">
        {/* Section Header */}
        <div className="mb-2.5 flex items-center justify-between gap-2 md:mb-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-0.5 rounded-full bg-primary md:h-5" />
            <h2 className="text-sm font-semibold text-foreground md:text-base">{section.title}</h2>
          </div>
          <Link
            href={`/category/${section.slug}`}
            className="flex shrink-0 items-center gap-0.5 text-[11px] font-medium text-primary transition-colors hover:text-stb-red-dark md:text-xs"
          >
            View All <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Subcategory tabs - horizontal scroll */}
        {section.subcategories.length > 1 && (
          <div className="mb-3 flex gap-1.5 overflow-x-auto scrollbar-hide md:mb-4 md:gap-2">
            {section.subcategories.map((subcat, index) =>
              subcat.href ? (
                <Link
                  key={index}
                  href={subcat.href}
                  className="shrink-0 rounded-full border border-border bg-white px-2.5 py-1 text-[10px] font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary md:px-3 md:text-[11px]"
                >
                  {subcat.name}
                </Link>
              ) : (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-medium transition-colors md:px-3 md:text-[11px] ${
                    activeTab === index
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-white text-muted-foreground hover:border-primary hover:text-primary"
                  }`}
                >
                  {subcat.name}
                </button>
              )
            )}
          </div>
        )}

        {/* Products Carousel */}
        <Carousel opts={{ align: "start", loop: false, skipSnaps: true }} className="w-full">
          <CarouselContent className="-ml-2 md:-ml-3">
            {section.products.map((product) => (
              <CarouselItem
                key={product.id}
                className="basis-1/2 pl-2 sm:basis-1/3 md:basis-1/4 md:pl-3 lg:basis-1/5"
              >
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0 hidden h-8 w-8 border border-border bg-white shadow-sm hover:border-primary hover:bg-primary hover:text-white md:flex" />
          <CarouselNext className="right-0 hidden h-8 w-8 border border-border bg-white shadow-sm hover:border-primary hover:bg-primary hover:text-white md:flex" />
        </Carousel>
      </div>
    </section>
  );
}
