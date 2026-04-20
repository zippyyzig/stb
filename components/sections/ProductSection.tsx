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
  id: string;
  name: string;
  image: string;
  secondImage?: string;
  price: number;
  originalPrice?: number;
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

function ProductCardInSection({ product }: { product: Product }) {
  const { data: session } = useSession();
  const router = useRouter();
  const { addToCart } = useCart();
  const { isInWishlist, toggle: toggleWishlist, isLoading: isWishlistLoading } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isWishlisted = isInWishlist(product.id);

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
        )
      : 0;

  const rating = product.rating || 0;

  const incrementQty = () => setQuantity((q) => (product.inStock ? q + 1 : q));
  const decrementQty = () => setQuantity((q) => Math.max(1, q - 1));

  const handleAddToCart = async () => {
    if (!session) {
      router.push(`/auth/login?callbackUrl=/product/${product.slug || product.id}`);
      return;
    }
    setIsAddingToCart(true);
    try {
      await addToCart(product.id, quantity);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlist = async () => {
    if (!session) {
      router.push(`/auth/login?callbackUrl=/product/${product.slug || product.id}`);
      return;
    }
    await toggleWishlist(product.id);
  };

  return (
    <div 
      className="product-thumb group relative flex h-full flex-col overflow-hidden rounded-lg border border-border/60 bg-card transition-all duration-200 hover:border-primary hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div className="image relative overflow-hidden bg-white">
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute left-2 top-2 z-10">
            <Badge className="rounded bg-primary px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
              -{discount}%
            </Badge>
          </div>
        )}

        {/* Quickview Button */}
        <div className={`quickview-button absolute inset-0 z-10 flex items-center justify-center bg-black/5 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <Link
            href={`/product/${product.id}`}
            className="btn-quickview flex items-center gap-1.5 rounded bg-white px-3 py-2 text-xs font-medium text-stb-dark shadow-md transition-all hover:bg-primary hover:text-white"
          >
            <Eye className="h-3.5 w-3.5" />
            <span className="btn-text">Quickview</span>
          </Link>
        </div>

        {/* Product Images with Swap on Hover */}
        <Link href={`/product/${product.id}`} className="product-img block p-3">
          <div className="relative mx-auto h-40 w-40">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className={`img-first object-contain transition-opacity duration-300 ${isHovered && product.secondImage ? 'opacity-0' : 'opacity-100'}`}
              unoptimized
            />
            {product.secondImage && (
              <Image
                src={product.secondImage}
                alt={product.name}
                fill
                className={`img-second absolute inset-0 object-contain transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                unoptimized
              />
            )}
          </div>
        </Link>
      </div>

      {/* Caption / Product Details */}
      <div className="caption flex flex-1 flex-col gap-1.5 p-3">
        {/* Brand Stats */}
        <div className="stats flex items-center gap-1 text-[11px]">
          <span className="stats-label text-muted-foreground">Brand:</span>
          <Link
            href={`/brand/${product.brand.toLowerCase().replace(/\s+/g, "-")}`}
            className="font-medium text-primary hover:underline"
          >
            {product.brand}
          </Link>
        </div>

        {/* Product Name */}
        <div className="name">
          <Link 
            href={`/product/${product.id}`}
            className="line-clamp-2 text-[13px] font-medium leading-tight text-foreground transition-colors hover:text-primary"
          >
            {product.name}
          </Link>
        </div>

        {/* Product ID & Item Code */}
        <div className="ProcudtId flex flex-wrap gap-1.5 text-[10px]">
          {product.productId && (
            <div className="ProcudtIdBx rounded bg-muted/80 px-1.5 py-0.5 text-muted-foreground">
              Product ID:{product.productId}
            </div>
          )}
          {product.itemCode && (
            <div className="ProcudtCdBx rounded bg-muted/80 px-1.5 py-0.5 text-muted-foreground">
              Item CD:{product.itemCode}
            </div>
          )}
        </div>

        {/* Description Snippet */}
        {product.description && (
          <div className="description line-clamp-2 text-[10px] leading-relaxed text-muted-foreground">
            {product.description}
          </div>
        )}

        {/* Price Section */}
        <div className="price ProductPrices mt-auto">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col">
              <span className="price-new text-base font-bold text-foreground">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="price-old text-[10px] text-muted-foreground line-through">
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={`in-stock-cls-right text-[10px] font-semibold ${product.inStock ? 'text-stb-success' : 'text-destructive'}`}>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
              {/* Brand Logo */}
              {product.brandLogo && (
                <div className="BrandIconProduct">
                  <Image
                    src={product.brandLogo}
                    alt={product.brand}
                    width={32}
                    height={32}
                    className="h-7 w-7 rounded object-contain"
                    unoptimized
                  />
                </div>
              )}
            </div>
          </div>
          <span className="price-tax text-[9px] text-muted-foreground">
            Ex Tax:₹{product.price.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Star Rating */}
        <div className="rating rating-stars flex items-center gap-0.5">
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

        {/* Button Group */}
        <div className="buttons-wrapper mt-2">
          <div className="button-group flex flex-col gap-2">
            {/* Cart Group */}
            <div className="cart-group flex items-center gap-2">
              {/* Stepper */}
              <div className="stepper flex h-8 items-center overflow-hidden rounded border border-border bg-white">
                <input
                  type="text"
                  name="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="h-full w-9 bg-transparent text-center text-xs font-medium text-foreground focus:outline-none"
                />
                <span className="flex flex-col border-l border-border">
                  <button
                    onClick={incrementQty}
                    className="flex h-3.5 w-5 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <ChevronUp className="h-2.5 w-2.5" />
                  </button>
                  <button
                    onClick={decrementQty}
                    disabled={quantity <= 1}
                    className="flex h-3.5 w-5 items-center justify-center border-t border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
                  >
                    <ChevronDown className="h-2.5 w-2.5" />
                  </button>
                </span>
              </div>

              {/* Add to Cart Button */}
              <Button
                size="sm"
                className="btn-cart h-8 flex-1 gap-1 rounded bg-primary text-[11px] font-semibold text-white shadow-sm hover:bg-stb-red-dark"
                disabled={!product.inStock || isAddingToCart}
                onClick={handleAddToCart}
              >
                <ShoppingCart className={`h-3 w-3 ${isAddingToCart ? 'animate-bounce' : ''}`} />
                <span className="btn-text">Add to Cart</span>
              </Button>
            </div>

            {/* Wish Group */}
            <div className="wish-group flex items-center gap-1.5">
              <button
                onClick={handleWishlist}
                disabled={isWishlistLoading}
                className={`btn-wishlist flex flex-1 items-center justify-center gap-1 rounded border py-1.5 text-[10px] font-medium transition-all disabled:opacity-50 ${
                  isWishlisted
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-white text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {isWishlistLoading ? (
                  <Loader2 className="h-2.5 w-2.5 animate-spin" />
                ) : (
                  <Heart className={`h-2.5 w-2.5 ${isWishlisted ? "fill-current" : ""}`} />
                )}
                <span className="btn-text">{isWishlisted ? "Saved" : "Wishlist"}</span>
              </button>
              <button className="btn-compare flex flex-1 items-center justify-center gap-1 rounded border border-border bg-white py-1.5 text-[10px] font-medium text-muted-foreground transition-all hover:border-primary hover:text-primary">
                <Scale className="h-2.5 w-2.5" />
                <span className="btn-text">Compare</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductSection({ section }: ProductSectionProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="module module-products mx-auto max-w-7xl px-4 py-6">
      <div className="module-body">
        {/* Tab Container */}
        <div className="tab-container mb-4 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          {/* Nav Tabs */}
          <ul className="nav nav-tabs flex flex-wrap items-center gap-0 border-b border-border bg-stb-dark">
            {section.subcategories.map((subcat, index) => (
              <li key={index} className={`tab-${index + 1}`}>
                {subcat.href ? (
                  <Link
                    href={subcat.href}
                    className="block border-r border-white/10 px-4 py-3 text-xs font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    {subcat.name}
                  </Link>
                ) : (
                  <button
                    onClick={() => setActiveTab(index)}
                    className={`block border-r border-white/10 px-4 py-3 text-xs font-medium transition-colors ${
                      activeTab === index
                        ? "bg-primary text-white"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {subcat.name}
                  </button>
                )}
              </li>
            ))}
            {/* View All Link */}
            <li className="ml-auto">
              <Link
                href={`/category/${section.slug}`}
                className="flex items-center gap-1 px-4 py-3 text-xs font-medium text-white/80 transition-colors hover:text-white"
              >
                View All →
              </Link>
            </li>
          </ul>
        </div>

        {/* Tab Content - Product Grid Carousel */}
        <div className="tab-content">
          <div className="module-item tab-pane active">
            <Carousel 
              opts={{ align: "start", loop: false, skipSnaps: true }} 
              className="swiper w-full"
            >
              <CarouselContent className="swiper-wrapper product-grid -ml-2.5">
                {section.products.map((product) => (
                  <CarouselItem
                    key={product.id}
                    className="product-layout swiper-slide basis-1/2 pl-2.5 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
                  >
                    <ProductCardInSection product={product} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="swiper-button-prev -left-3 hidden h-10 w-10 rounded-full border border-border bg-card text-foreground shadow-md transition-all hover:border-primary hover:bg-primary hover:text-white md:flex" />
              <CarouselNext className="swiper-button-next -right-3 hidden h-10 w-10 rounded-full border border-border bg-card text-foreground shadow-md transition-all hover:border-primary hover:bg-primary hover:text-white md:flex" />
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
}
