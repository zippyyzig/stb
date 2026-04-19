"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  ShoppingCart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Minus,
  Plus,
  Check,
  Loader2,
} from "lucide-react";

interface ProductInfoProps {
  product: {
    _id: string;
    name: string;
    slug: string;
    shortDescription?: string;
    sku: string;
    brand?: string;
    priceB2C: number;
    priceB2B: number;
    mrp: number;
    stock: number;
    minOrderQty: number;
    maxOrderQty?: number;
    unit: string;
    tags?: string[];
    isFeatured?: boolean;
    isNewArrival?: boolean;
    isBestSeller?: boolean;
    views?: number;
    soldCount?: number;
  };
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [quantity, setQuantity] = useState(product.minOrderQty || 1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);

  // Check wishlist status on mount (only when logged in)
  useEffect(() => {
    if (!session) return;
    fetch("/api/wishlist")
      .then((r) => r.json())
      .then((data) => {
        const wishlisted = data.items?.some(
          (item: { product: { _id: string } }) =>
            item.product._id === product._id
        );
        setIsWishlisted(!!wishlisted);
      })
      .catch(() => {});
  }, [session, product._id]);

  // Determine price based on user type
  const isB2B =
    session?.user?.role === "admin" || session?.user?.role === "super_admin";
  const displayPrice = isB2B ? product.priceB2B : product.priceB2C;
  const discount = Math.round(((product.mrp - displayPrice) / product.mrp) * 100);
  const inStock = product.stock > 0;
  const totalPrice = displayPrice * quantity;

  const handleQuantityChange = (delta: number) => {
    const newQty = quantity + delta;
    if (newQty >= (product.minOrderQty || 1)) {
      if (product.maxOrderQty && newQty > product.maxOrderQty) return;
      if (newQty > product.stock) return;
      setQuantity(newQty);
    }
  };

  const handleAddToCart = async () => {
    if (!session) {
      router.push(`/auth/login?callbackUrl=/product/${product.slug}`);
      return;
    }
    setIsAddingToCart(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id, quantity }),
      });
      if (res.ok) {
        setCartAdded(true);
        setTimeout(() => setCartAdded(false), 2000);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!session) {
      router.push(`/auth/login?callbackUrl=/product/${product.slug}`);
      return;
    }
    await handleAddToCart();
    router.push("/checkout");
  };

  const handleWishlistToggle = async () => {
    if (!session) {
      // Redirect to login; after login the user returns to this product page
      router.push(
        `/auth/login?callbackUrl=/product/${product.slug}&wishlistProduct=${product._id}`
      );
      return;
    }

    setIsWishlistLoading(true);
    try {
      if (isWishlisted) {
        const res = await fetch(`/api/wishlist?productId=${product._id}`, {
          method: "DELETE",
        });
        if (res.ok) setIsWishlisted(false);
      } else {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product._id }),
        });
        if (res.ok) setIsWishlisted(true);
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: product.name,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {product.isNewArrival && (
          <Badge className="bg-stb-success text-white">New Arrival</Badge>
        )}
        {product.isFeatured && (
          <Badge className="bg-accent text-accent-foreground">Featured</Badge>
        )}
        {product.isBestSeller && (
          <Badge className="bg-primary text-white">Best Seller</Badge>
        )}
        {discount > 0 && <Badge variant="destructive">{discount}% OFF</Badge>}
      </div>

      {/* Brand */}
      {product.brand && (
        <span className="body-sm text-muted-foreground">{product.brand}</span>
      )}

      {/* Name */}
      <h1 className="heading-xl">{product.name}</h1>

      {/* SKU & Stats */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <span>SKU: {product.sku}</span>
        {product.views && <span>{product.views} views</span>}
        {product.soldCount && <span>{product.soldCount} sold</span>}
      </div>

      {/* Short Description */}
      {product.shortDescription && (
        <p className="body-md text-muted-foreground">
          {product.shortDescription}
        </p>
      )}

      <Separator />

      {/* Pricing */}
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-primary">
            ₹{displayPrice.toLocaleString("en-IN")}
          </span>
          {product.mrp > displayPrice && (
            <span className="text-lg text-muted-foreground line-through">
              ₹{product.mrp.toLocaleString("en-IN")}
            </span>
          )}
          {discount > 0 && (
            <span className="text-lg font-medium text-stb-success">
              Save ₹{(product.mrp - displayPrice).toLocaleString("en-IN")}
            </span>
          )}
        </div>
        {isB2B && (
          <span className="body-sm text-stb-success">
            You are viewing B2B wholesale prices
          </span>
        )}
        <span className="body-sm text-muted-foreground">
          (Inclusive of all taxes)
        </span>
      </div>

      <Separator />

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        {inStock ? (
          <>
            <Check className="h-5 w-5 text-stb-success" />
            <span className="font-medium text-stb-success">In Stock</span>
            <span className="text-muted-foreground">
              ({product.stock} {product.unit}s available)
            </span>
          </>
        ) : (
          <span className="font-medium text-destructive">Out of Stock</span>
        )}
      </div>

      {/* Quantity Selector */}
      {inStock && (
        <div className="flex items-center gap-4">
          <span className="body-sm font-medium">Quantity:</span>
          <div className="flex items-center rounded-lg border border-border">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= (product.minOrderQty || 1)}
              className="p-3 text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              disabled={
                quantity >= product.stock ||
                (product.maxOrderQty !== undefined &&
                  quantity >= product.maxOrderQty)
              }
              className="p-3 text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <span className="body-sm text-muted-foreground">
            Total: ₹{totalPrice.toLocaleString("en-IN")}
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          size="lg"
          className="flex-1 gap-2"
          disabled={!inStock || isAddingToCart}
          onClick={handleAddToCart}
        >
          {isAddingToCart ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : cartAdded ? (
            <Check className="h-5 w-5" />
          ) : (
            <ShoppingCart className="h-5 w-5" />
          )}
          {isAddingToCart ? "Adding..." : cartAdded ? "Added!" : "Add to Cart"}
        </Button>
        <Button
          size="lg"
          variant="secondary"
          className="flex-1 gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
          disabled={!inStock}
          onClick={handleBuyNow}
        >
          Buy Now
        </Button>
      </div>

      {/* Secondary Actions */}
      <div className="flex gap-4">
        <button
          onClick={handleWishlistToggle}
          disabled={isWishlistLoading}
          className={`flex items-center gap-2 text-sm transition-colors disabled:opacity-50 ${
            isWishlisted
              ? "text-primary"
              : "text-muted-foreground hover:text-primary"
          }`}
        >
          {isWishlistLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Heart
              className={`h-5 w-5 transition-all ${isWishlisted ? "fill-current text-primary" : ""}`}
            />
          )}
          {isWishlistLoading
            ? "..."
            : isWishlisted
            ? "Wishlisted"
            : "Add to Wishlist"}
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Share2 className="h-5 w-5" />
          Share
        </button>
      </div>

      <Separator />

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center gap-2 rounded-lg bg-muted/50 p-3 text-center">
          <Truck className="h-6 w-6 text-primary" />
          <span className="body-sm font-medium">Fast Delivery</span>
          <span className="body-sm text-muted-foreground">2-5 days</span>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-lg bg-muted/50 p-3 text-center">
          <Shield className="h-6 w-6 text-primary" />
          <span className="body-sm font-medium">Warranty</span>
          <span className="body-sm text-muted-foreground">1 Year</span>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-lg bg-muted/50 p-3 text-center">
          <RotateCcw className="h-6 w-6 text-primary" />
          <span className="body-sm font-medium">Easy Returns</span>
          <span className="body-sm text-muted-foreground">7 Days</span>
        </div>
      </div>

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="body-sm text-muted-foreground">Tags:</span>
          {product.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
