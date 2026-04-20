"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart, useWishlist } from "@/components/providers/CartWishlistProvider";
import {
  Heart,
  ShoppingCart,
  Eye,
  ChevronUp,
  ChevronDown,
  Star,
  Scale,
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
  const [quantity, setQuantity] = useState(1);

  // Determine price based on user GST verification status
  const isB2B = session?.user?.isGstVerified === true;
  const displayPrice = isB2B ? product.priceB2B : product.priceB2C;
  const isWishlisted = isInWishlist(product._id);
  const discount = Math.round(
    ((product.mrp - displayPrice) / product.mrp) * 100
  );
  const inStock = product.stock > 0;

  const handleAddToCart = async () => {
    if (!session) {
      router.push(`/auth/login?callbackUrl=/product/${product.slug}`);
      return;
    }
    setIsAddingToCart(true);
    try {
      await addToCart(product._id, quantity);
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

  const incrementQty = () => {
    if (quantity < product.stock) setQuantity(quantity + 1);
  };

  const decrementQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const rating = product.rating || 0;

  return (
    <Card className="group h-full overflow-hidden border-border/50 bg-card transition-all hover:border-primary hover:shadow-xl">
      {/* Product Image */}
      <div className="relative overflow-hidden bg-muted/30">
        {/* Badges */}
        <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
          {product.isNewArrival && (
            <Badge className="rounded bg-stb-success px-2 py-0.5 text-[10px] font-bold text-white">
              New
            </Badge>
          )}
          {product.isFeatured && (
            <Badge className="rounded bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white">
              Featured
            </Badge>
          )}
          {discount > 0 && (
            <Badge className="rounded bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
              -{discount}%
            </Badge>
          )}
        </div>

        {/* Quickview Button - Always Visible on Hover */}
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/10 group-hover:opacity-100">
          <Link
            href={`/product/${product.slug}`}
            className="flex items-center gap-1.5 rounded-md bg-white px-3 py-2 text-xs font-medium text-foreground shadow-lg transition-colors hover:bg-primary hover:text-white"
          >
            <Eye className="h-3.5 w-3.5" />
            Quickview
          </Link>
        </div>

        {/* Image */}
        <Link href={`/product/${product.slug}`} className="block p-4">
          <Image
            src={product.images?.[0] || "https://via.placeholder.com/300"}
            alt={product.name}
            width={200}
            height={200}
            className="mx-auto h-40 w-40 object-contain transition-transform group-hover:scale-105"
            unoptimized
          />
        </Link>
      </div>

      <CardContent className="flex flex-col gap-2 p-4">
        {/* Brand */}
        {product.brand && (
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-muted-foreground">Brand:</span>
            <Link
              href={`/brand/${product.brand.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-xs font-medium text-primary hover:underline"
            >
              {product.brand}
            </Link>
          </div>
        )}

        {/* Product Name */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground transition-colors hover:text-primary">
            {product.name}
          </h3>
        </Link>

        {/* Product ID & Item Code */}
        <div className="flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
          {product.productId && (
            <div className="rounded bg-muted px-1.5 py-0.5">
              <span className="font-medium">Product ID:</span> {product.productId}
            </div>
          )}
          {product.itemCode && (
            <div className="rounded bg-muted px-1.5 py-0.5">
              <span className="font-medium">Item CD:</span> {product.itemCode}
            </div>
          )}
        </div>

        {/* Price Row with Brand Logo */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-foreground">
                ₹{displayPrice.toLocaleString("en-IN")}
              </span>
              {product.mrp > displayPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  ₹{product.mrp.toLocaleString("en-IN")}
                </span>
              )}
            </div>
            {/* Stock Status */}
            <span
              className={`text-xs font-medium ${
                inStock ? "text-stb-success" : "text-destructive"
              }`}
            >
              {inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>
          {/* Brand Logo */}
          {product.brandLogo && (
            <Image
              src={product.brandLogo}
              alt={product.brand || "Brand"}
              width={40}
              height={40}
              className="h-8 w-8 rounded object-contain"
              unoptimized
            />
          )}
        </div>

        {/* B2B Indicator - shown for GST verified users */}
        {isB2B && (
          <span className="text-xs font-medium text-stb-success">
            GST Verified - B2B Price
          </span>
        )}

        {/* Star Rating */}
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-3.5 w-3.5 ${
                star <= rating
                  ? "fill-amber-400 text-amber-400"
                  : "fill-none text-muted-foreground/40"
              }`}
            />
          ))}
        </div>

        {/* Quantity Stepper + Add to Cart */}
        <div className="mt-2 flex items-center gap-2">
          {/* Quantity Stepper */}
          <div className="flex h-9 items-center rounded border border-border bg-muted/30">
            <input
              type="text"
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1;
                setQuantity(Math.min(Math.max(1, val), product.stock));
              }}
              className="h-full w-10 bg-transparent text-center text-sm font-medium focus:outline-none"
            />
            <div className="flex flex-col border-l border-border">
              <button
                onClick={incrementQty}
                disabled={quantity >= product.stock}
                className="flex h-4 w-6 items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
              >
                <ChevronUp className="h-3 w-3" />
              </button>
              <button
                onClick={decrementQty}
                disabled={quantity <= 1}
                className="flex h-4 w-6 items-center justify-center border-t border-border text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
              >
                <ChevronDown className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            size="sm"
            className="h-9 flex-1 gap-1.5 rounded bg-primary text-xs font-medium hover:bg-stb-red-dark"
            disabled={!inStock || isAddingToCart}
            onClick={handleAddToCart}
          >
            <ShoppingCart
              className={`h-3.5 w-3.5 ${isAddingToCart ? "animate-pulse" : ""}`}
            />
            Add to Cart
          </Button>
        </div>

        {/* Wishlist & Compare Buttons */}
        <div className="mt-1 flex items-center gap-2">
          <button
            onClick={handleWishlist}
            disabled={isWishlistLoading}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded border py-1.5 text-[10px] font-medium transition-colors disabled:opacity-50 ${
              isWishlisted
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary hover:text-primary"
            }`}
          >
            {isWishlistLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Heart
                className={`h-3 w-3 ${isWishlisted ? "fill-current" : ""}`}
              />
            )}
            {isWishlisted ? "Saved" : "Wishlist"}
          </button>
          <button className="flex flex-1 items-center justify-center gap-1.5 rounded border border-border py-1.5 text-[10px] font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary">
            <Scale className="h-3 w-3" />
            Compare
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
