"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Eye, Check } from "lucide-react";

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
  isFeatured?: boolean;
  isNewArrival?: boolean;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { data: session } = useSession();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // Determine price based on user type
  const isB2B = session?.user?.role === "admin" || session?.user?.role === "super_admin";
  const displayPrice = isB2B ? product.priceB2B : product.priceB2C;
  const discount = Math.round(((product.mrp - displayPrice) / product.mrp) * 100);
  const inStock = product.stock > 0;

  const handleAddToCart = async () => {
    if (!session) {
      window.location.href = "/auth/login";
      return;
    }
    setIsAddingToCart(true);
    // TODO: Implement add to cart
    setTimeout(() => {
      setIsAddingToCart(false);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }, 500);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // TODO: Implement wishlist
  };

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-foreground/20 hover:shadow-lg">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {/* Badges */}
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
          {product.isNewArrival && (
            <Badge className="bg-foreground text-background">New</Badge>
          )}
          {product.isFeatured && (
            <Badge variant="outline" className="border-foreground/20 bg-card">
              Featured
            </Badge>
          )}
          {discount > 0 && (
            <Badge className="bg-accent text-accent-foreground">-{discount}%</Badge>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute right-3 top-3 z-10 flex flex-col gap-1.5 opacity-0 transition-all group-hover:opacity-100">
          <button
            onClick={handleWishlist}
            className={`flex h-9 w-9 items-center justify-center rounded-full shadow-sm transition-all ${
              isWishlisted
                ? "bg-accent text-accent-foreground"
                : "bg-card/90 text-muted-foreground hover:bg-card hover:text-accent"
            }`}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
          </button>
          <Link
            href={`/product/${product.slug}`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-card/90 text-muted-foreground shadow-sm transition-all hover:bg-card hover:text-foreground"
          >
            <Eye className="h-4 w-4" />
          </Link>
        </div>

        {/* Image */}
        <Link href={`/product/${product.slug}`} className="block h-full p-6">
          <Image
            src={product.images?.[0] || "https://via.placeholder.com/300"}
            alt={product.name}
            fill
            className="object-contain transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
        </Link>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Brand */}
        {product.brand && (
          <span className="label-uppercase text-muted-foreground">{product.brand}</span>
        )}

        {/* Product Name */}
        <Link href={`/product/${product.slug}`} className="mt-1.5">
          <h3 className="body-md line-clamp-2 font-medium text-foreground transition-colors hover:text-accent">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="mt-auto flex flex-wrap items-baseline gap-2 pt-3">
          <span className="heading-md text-foreground">
            ₹{displayPrice.toLocaleString("en-IN")}
          </span>
          {product.mrp > displayPrice && (
            <span className="body-sm text-muted-foreground line-through">
              ₹{product.mrp.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* B2B Badge */}
        {isB2B && (
          <span className="body-sm mt-1 text-stb-success">B2B Price</span>
        )}

        {/* Stock & Cart */}
        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span
              className={`body-sm font-medium ${
                inStock ? "text-stb-success" : "text-destructive"
              }`}
            >
              {inStock ? "In Stock" : "Out of Stock"}
            </span>
            {inStock && product.stock <= 10 && (
              <span className="body-sm text-stb-warning">Only {product.stock} left</span>
            )}
          </div>
          <Button
            size="sm"
            variant={addedToCart ? "outline" : "default"}
            className={`h-9 gap-2 rounded-full px-4 transition-all ${
              addedToCart ? "border-stb-success text-stb-success" : ""
            }`}
            disabled={!inStock || isAddingToCart}
            onClick={handleAddToCart}
          >
            {addedToCart ? (
              <>
                <Check className="h-4 w-4" />
                Added
              </>
            ) : (
              <>
                <ShoppingCart className={`h-4 w-4 ${isAddingToCart ? "animate-pulse" : ""}`} />
                Add
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
