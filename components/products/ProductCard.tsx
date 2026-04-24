"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCart, useWishlist } from "@/components/providers/CartWishlistProvider";
import {
  Heart,
  ShoppingCart,
  Star,
  Loader2,
} from "lucide-react";

interface Product {
  _id: string;
  name: string;
  slug: string;
  images?: string[];
  priceB2C: number;
  priceB2B: number;
  mrp: number;
  stock: number;
  brand?: string;
  brandLogo?: string;
  productId?: string;
  itemCode?: string;
  rating?: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { addToCart } = useCart();
  const { isInWishlist, toggle: toggleWishlist, isLoading: isWishlistLoading } = useWishlist();

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [imageHover, setImageHover] = useState(false);

  const isB2B = session?.user?.isGstVerified === true;
  const displayPrice = isB2B ? product.priceB2B : product.priceB2C;
  const isWishlisted = isInWishlist(product._id);
  const discount = product.mrp > displayPrice
    ? Math.round(((product.mrp - displayPrice) / product.mrp) * 100)
    : 0;
  const inStock = product.stock > 0;
  const rating = product.rating || 0;

  const handleAddToCart = async () => {
    if (!session) {
      router.push(`/auth/login?callbackUrl=/product/${product.slug}`);
      return;
    }
    setIsAddingToCart(true);
    try {
      await addToCart(product._id, 1);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlist = async () => {
    if (!session) {
      router.push(`/auth/login?callbackUrl=/product/${product.slug}`);
      return;
    }
    await toggleWishlist(product._id);
  };

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-white transition-all hover:shadow-md">
      {/* Image container */}
      <div
        className="relative bg-muted/30"
        onMouseEnter={() => setImageHover(true)}
        onMouseLeave={() => setImageHover(false)}
      >
        {/* Badges */}
        <div className="absolute left-1.5 top-1.5 z-10 flex flex-col gap-0.5 md:left-2 md:top-2 md:gap-1">
          {product.isNewArrival && (
            <span className="rounded bg-stb-success px-1.5 py-0.5 text-[8px] font-semibold text-white md:text-[9px]">New</span>
          )}
          {product.isFeatured && (
            <span className="rounded bg-amber-500 px-1.5 py-0.5 text-[8px] font-semibold text-white md:text-[9px]">Featured</span>
          )}
          {discount > 0 && (
            <span className="rounded bg-primary px-1.5 py-0.5 text-[8px] font-semibold text-white md:text-[9px]">-{discount}%</span>
          )}
        </div>

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
              src={
                imageHover && product.images?.[1]
                  ? product.images[1]
                  : product.images?.[0] || "https://via.placeholder.com/300"
              }
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
        {product.brand && (
          <span className="text-[9px] font-medium text-primary md:text-[10px]">{product.brand}</span>
        )}

        {/* Name */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="mt-0.5 line-clamp-2 text-[11px] font-medium leading-tight text-foreground transition-colors hover:text-primary md:text-xs">
            {product.name}
          </h3>
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
          <span className={`text-[9px] font-medium md:text-[10px] ${inStock ? "text-stb-success" : "text-destructive"}`}>
            {inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          disabled={!inStock || isAddingToCart}
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
