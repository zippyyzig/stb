"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCart, useWishlist } from "@/components/providers/CartWishlistProvider";
import { Heart, ShoppingCart, Star, Loader2 } from "lucide-react";

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
  const [hovered, setHovered] = useState(false);

  const isB2B = session?.user?.isGstVerified === true;
  const displayPrice = isB2B ? product.priceB2B : product.priceB2C;
  const isWishlisted = isInWishlist(product._id);
  const discount =
    product.mrp > displayPrice
      ? Math.round(((product.mrp - displayPrice) / product.mrp) * 100)
      : 0;
  const inStock = product.stock > 0;
  const rating = product.rating || 0;
  const savings = product.mrp > displayPrice ? product.mrp - displayPrice : 0;

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

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session) {
      router.push(`/auth/login?callbackUrl=/product/${product.slug}`);
      return;
    }
    await toggleWishlist(product._id);
  };

  return (
    <div
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-lg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Image area ────────────────────────────────────────────────── */}
      <div className="relative bg-[#FAFAFA]">
        {/* Top badges row */}
        <div className="absolute left-1.5 top-1.5 z-10 flex flex-col gap-0.5 md:left-2 md:top-2">
          {product.isNewArrival && (
            <span className="rounded bg-stb-success px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-white md:text-[9px]">
              New
            </span>
          )}
          {discount > 0 && (
            <span className="rounded bg-primary px-1.5 py-0.5 text-[8px] font-bold text-white md:text-[9px]">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          disabled={isWishlistLoading}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border transition-all press-active shadow-sm ${
            isWishlisted
              ? "border-primary bg-primary text-white"
              : "border-border bg-white text-muted-foreground hover:border-primary hover:text-primary"
          }`}
        >
          {isWishlistLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Heart className={`h-3.5 w-3.5 ${isWishlisted ? "fill-current" : ""}`} />
          )}
        </button>

        {/* Product image — 1:1 aspect, fills full card width */}
        <Link href={`/product/${product.slug}`} className="block p-3 md:p-4">
          <div className="relative aspect-square w-full">
            <Image
              src={
                hovered && product.images?.[1]
                  ? product.images[1]
                  : product.images?.[0] || "https://placehold.co/300x300?text=No+Image"
              }
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, 200px"
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              unoptimized
            />
          </div>
        </Link>
      </div>

      {/* ── Product info ──────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col px-2.5 pb-2.5 pt-2 md:px-3 md:pb-3 md:pt-2.5">
        {/* Brand */}
        {product.brand && (
          <span className="text-[9px] font-semibold uppercase tracking-wide text-primary md:text-[10px]">
            {product.brand}
          </span>
        )}

        {/* Name */}
        <Link href={`/product/${product.slug}`} className="mt-0.5 block">
          <h3 className="line-clamp-2 text-xs font-medium leading-snug text-foreground transition-colors hover:text-primary md:text-[13px]">
            {product.name}
          </h3>
        </Link>

        {/* Star rating */}
        {rating > 0 && (
          <div className="mt-1 flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`h-2 w-2 md:h-2.5 md:w-2.5 ${
                  s <= Math.round(rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-muted text-muted"
                }`}
              />
            ))}
            <span className="ml-0.5 text-[9px] text-muted-foreground">({rating})</span>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price block */}
        <div className="mt-2 space-y-0.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-extrabold text-foreground md:text-base">
              ₹{displayPrice.toLocaleString("en-IN")}
            </span>
            {product.mrp > displayPrice && (
              <span className="text-[9px] text-muted-foreground line-through md:text-[10px]">
                ₹{product.mrp.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            {savings > 0 ? (
              <span className="text-[9px] font-medium text-stb-success md:text-[10px]">
                Save ₹{savings.toLocaleString("en-IN")}
              </span>
            ) : (
              <span />
            )}
            <span
              className={`text-[9px] font-semibold md:text-[10px] ${
                inStock ? "text-stb-success" : "text-destructive"
              }`}
            >
              {inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>
        </div>

        {/* Add to Cart button */}
        <button
          onClick={handleAddToCart}
          disabled={!inStock || isAddingToCart}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary py-3 text-xs font-bold text-white transition-colors hover:bg-stb-red-dark disabled:cursor-not-allowed disabled:opacity-40 press-active"
        >
          {isAddingToCart ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <>
              <ShoppingCart className="h-3 w-3" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
