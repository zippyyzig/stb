"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Eye } from "lucide-react";

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
    setTimeout(() => setIsAddingToCart(false), 500);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // TODO: Implement wishlist
  };

  return (
    <Card className="group h-full overflow-hidden border-border/50 transition-all hover:shadow-lg">
      {/* Product Image */}
      <div className="relative overflow-hidden bg-muted">
        {/* Badges */}
        <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
          {product.isNewArrival && (
            <Badge className="bg-stb-success text-white">New</Badge>
          )}
          {product.isFeatured && (
            <Badge className="bg-accent text-accent-foreground">Featured</Badge>
          )}
          {discount > 0 && (
            <Badge variant="destructive">-{discount}%</Badge>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute right-2 top-2 z-10 flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={handleWishlist}
            className={`rounded-full p-2 transition-colors ${
              isWishlisted
                ? "bg-destructive text-white"
                : "bg-white/90 text-muted-foreground hover:bg-white hover:text-destructive"
            }`}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
          </button>
          <Link
            href={`/product/${product.slug}`}
            className="rounded-full bg-white/90 p-2 text-muted-foreground transition-colors hover:bg-white hover:text-primary"
          >
            <Eye className="h-4 w-4" />
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

      <CardContent className="flex flex-col gap-2 p-3">
        {/* Brand */}
        {product.brand && (
          <span className="body-sm text-muted-foreground">{product.brand}</span>
        )}

        {/* Product Name */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="heading-sm line-clamp-2 text-sm leading-snug transition-colors hover:text-primary">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="heading-md text-primary">
            ₹{displayPrice.toLocaleString("en-IN")}
          </span>
          {product.mrp > displayPrice && (
            <span className="body-sm text-muted-foreground line-through">
              ₹{product.mrp.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* B2B/B2C Indicator */}
        {isB2B && (
          <span className="body-sm text-stb-success">B2B Price</span>
        )}

        {/* Stock & Cart */}
        <div className="mt-auto flex items-center justify-between pt-2">
          <Badge
            variant={inStock ? "default" : "destructive"}
            className={`text-xs ${
              inStock
                ? "border-stb-success/30 bg-stb-success/10 text-stb-success"
                : ""
            }`}
          >
            {inStock ? `${product.stock} in stock` : "Out of Stock"}
          </Badge>
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 rounded-full border-primary/30 text-primary hover:bg-primary hover:text-white"
            disabled={!inStock || isAddingToCart}
            onClick={handleAddToCart}
          >
            <ShoppingCart className={`h-3.5 w-3.5 ${isAddingToCart ? "animate-pulse" : ""}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
