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
import { Badge } from "@/components/ui/badge";
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

function MobileProductCard({ product }: { product: Product }) {
  const { data: session } = useSession();
  const router = useRouter();
  const { addToCart } = useCart();
  const { isInWishlist, toggle: toggleWishlist, isLoading: isWishlistLoading } = useWishlist();

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
    <div
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-white transition-all hover:border-primary/30 hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative bg-secondary/30">
        {discount > 0 && (
          <Badge className="absolute left-2 top-2 z-10 rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
            -{discount}%
          </Badge>
        )}
        <button
          onClick={handleWishlist}
          disabled={isWishlistLoading}
          className={`absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full border transition-all ${
            isWishlisted
              ? "border-primary bg-primary text-white"
              : "border-border bg-white text-muted-foreground hover:border-primary hover:text-primary"
          }`}
        >
          {isWishlistLoading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Heart className={`h-3 w-3 ${isWishlisted ? "fill-current" : ""}`} />
          )}
        </button>
        <Link href={`/product/${product.slug}`} className="block p-3">
          <div className="relative mx-auto h-32 w-full md:h-36">
            <Image
              src={isHovered && product.secondImage ? product.secondImage : product.image}
              alt={product.name}
              fill
              className="object-contain transition-opacity duration-300"
              unoptimized
            />
          </div>
        </Link>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-1 p-2.5">
        {/* Brand */}
        <span className="text-[10px] font-medium text-primary">{product.brand}</span>

        {/* Name */}
        <Link href={`/product/${product.slug}`}>
          <p className="line-clamp-2 text-xs font-medium leading-snug text-foreground hover:text-primary">
            {product.name}
          </p>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-2.5 w-2.5 ${star <= rating ? "fill-amber-400 text-amber-400" : "fill-none text-muted-foreground/30"}`}
            />
          ))}
        </div>

        {/* Price */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-bold text-foreground">
              ₹{displayPrice.toLocaleString("en-IN")}
            </span>
            {product.mrp > displayPrice && (
              <span className="text-[10px] text-muted-foreground line-through">
                ₹{product.mrp.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          <span className={`text-[10px] font-medium ${product.inStock ? "text-stb-success" : "text-destructive"}`}>
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock || isAddingToCart}
          className="mt-1.5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-2 text-[11px] font-semibold text-white transition-colors hover:bg-stb-red-dark disabled:opacity-50"
        >
          {isAddingToCart ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <ShoppingCart className="h-3 w-3" />
          )}
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default function ProductSection({ section }: ProductSectionProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="mx-auto max-w-7xl px-3 py-4 md:px-4 md:py-5">
      {/* Section Header with Tabs */}
      <div className="mb-3 flex items-center justify-between gap-2 md:mb-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="h-5 w-1 shrink-0 rounded-full bg-primary md:h-6" />
          <h2 className="truncate text-base font-bold text-foreground md:text-lg">{section.title}</h2>
        </div>
        <Link
          href={`/category/${section.slug}`}
          className="flex shrink-0 items-center gap-0.5 text-xs font-medium text-primary hover:text-stb-red-dark"
        >
          View All <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Subcategory tabs - scrollable on mobile */}
      {section.subcategories.length > 1 && (
        <div className="mb-3 flex items-center gap-1 overflow-x-auto pb-1 md:mb-4">
          {section.subcategories.map((subcat, index) => (
            subcat.href ? (
              <Link
                key={index}
                href={subcat.href}
                className="shrink-0 rounded-full border border-border bg-white px-3 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary md:text-xs"
              >
                {subcat.name}
              </Link>
            ) : (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-medium transition-colors md:text-xs ${
                  activeTab === index
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-white text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {subcat.name}
              </button>
            )
          ))}
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
              <MobileProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 hidden h-8 w-8 rounded-full border border-border bg-white shadow-md hover:border-primary hover:bg-primary hover:text-white md:flex" />
        <CarouselNext className="right-0 hidden h-8 w-8 rounded-full border border-border bg-white shadow-md hover:border-primary hover:bg-primary hover:text-white md:flex" />
      </Carousel>
    </section>
  );
}
