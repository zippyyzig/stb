"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
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
    <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-white transition-all hover:border-primary/30 hover:shadow-md">
      {/* Image Area */}
      <div className="relative bg-secondary/30">
        {/* Badges */}
        <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
          {product.isNewArrival && (
            <Badge className="rounded-md bg-stb-success px-1.5 py-0.5 text-[10px] font-bold text-white">New</Badge>
          )}
          {product.isFeatured && (
            <Badge className="rounded-md bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-white">Featured</Badge>
          )}
          {discount > 0 && (
            <Badge className="rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">-{discount}%</Badge>
          )}
        </div>

        {/* Wishlist Button */}
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
          <Image
            src={product.images?.[0] || "https://via.placeholder.com/300"}
            alt={product.name}
            width={200}
            height={200}
            className="mx-auto h-36 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
        </Link>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1.5 p-2.5">
        {product.brand && (
          <span className="text-[10px] font-medium text-primary">{product.brand}</span>
        )}

        <Link href={`/product/${product.slug}`}>
          <h3 className="line-clamp-2 text-xs font-medium leading-snug text-foreground hover:text-primary">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-2.5 w-2.5 ${
                star <= rating ? "fill-amber-400 text-amber-400" : "fill-none text-muted-foreground/30"
              }`}
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
          <span className={`text-[10px] font-medium ${inStock ? "text-stb-success" : "text-destructive"}`}>
            {inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={!inStock || isAddingToCart}
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
