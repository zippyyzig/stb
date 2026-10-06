"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, Heart, Loader2, Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useCart, useWishlist } from "@/components/providers/CartWishlistProvider";

export interface RailProduct {
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
  rating?: number;
}

interface ProductRailProps {
  title: string;
  subtitle?: string;
  href: string;
  products: RailProduct[];
  tag?: string;
}

const formatInr = (value: number) =>
  `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function RailProductCard({ product, tag }: { product: RailProduct; tag?: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const { addToCart } = useCart();
  const { isInWishlist, toggle: toggleWishlist, isLoading: wishlistLoading } = useWishlist();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const isB2B = session?.user?.isGstVerified === true;
  const priceB2C = Number(product.priceB2C) || 0;
  const priceB2B = Number(product.priceB2B) || 0;
  const price = isB2B ? priceB2B : priceB2C;
  const mrp = Number(product.mrp) || 0;
  const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const rating = product.rating || 0;
  const wishlisted = isInWishlist(product.id);
  const loginHref = `/auth/login?callbackUrl=/product/${product.slug}`;

  const handleWishlist = async () => {
    if (!session) {
      router.push(loginHref);
      return;
    }
    await toggleWishlist(product.id);
  };

  const handleCart = async () => {
    if (!session) {
      router.push(loginHref);
      return;
    }
    setAdding(true);
    try {
      const result = await addToCart(product.id, 1);
      if (result.success) {
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      }
    } finally {
      setAdding(false);
    }
  };

  return (
    <article
      className="group relative flex h-full flex-col rounded-xl border border-[#E4E4E4] bg-white p-2 transition-shadow hover:shadow-lg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {tag && (
        <span className="absolute -left-px -top-px z-10 rounded-br-lg rounded-tl-xl bg-rd-teal px-2 py-1 text-[11px] font-semibold leading-none text-white">
          {tag}
        </span>
      )}

      <button
        type="button"
        onClick={handleWishlist}
        disabled={wishlistLoading}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={wishlisted}
        className="absolute right-3 top-3 z-10 text-[#B5B5B5] transition-colors hover:text-rd-red"
      >
        <Heart className={`h-4 w-4 fill-current ${wishlisted ? "text-rd-red" : ""}`} />
      </button>

      <Link href={`/product/${product.slug}`} className="block rounded-lg bg-rd-tile p-3">
        <div className="relative aspect-[4/5] w-full">
          <Image
            src={hovered && product.secondImage ? product.secondImage : product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 45vw, 220px"
            className="object-contain transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col px-1 pb-1 pt-3">
        <Link href={`/product/${product.slug}`}>
          <h3 className="line-clamp-2 min-h-[2.5rem] text-[13px] leading-5 text-[#444] transition-colors hover:text-rd-red">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
          <span className="text-base font-bold text-rd-text md:text-lg">{formatInr(price)}</span>
          {discount > 0 && <span className="text-xs font-semibold text-rd-green">{discount}% OFF</span>}
        </div>

        {mrp > price ? (
          <p className="mt-0.5 text-xs text-[#9A9A9A]">
            MRP <span className="line-through">{formatInr(mrp)}</span>
          </p>
        ) : (
          <div className="h-4" />
        )}

        <div className="mt-1.5 flex h-5 items-center gap-1" aria-label={rating > 0 ? `Rated ${rating} out of 5` : undefined}>
          {rating > 0 && (
            <>
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  className={`h-3.5 w-3.5 ${n <= Math.round(rating) ? "fill-[#F5A623] text-[#F5A623]" : "fill-[#DDD] text-[#DDD]"}`}
                />
              ))}
            </>
          )}
          {!product.inStock && <span className="text-xs font-semibold text-destructive">Out of stock</span>}
        </div>

        <button
          type="button"
          onClick={handleCart}
          disabled={!product.inStock || adding}
          className="mt-2 hidden h-9 w-full items-center justify-center gap-1.5 rounded-full border border-rd-red text-[13px] font-semibold text-rd-red transition-colors hover:bg-rd-red hover:text-white disabled:cursor-not-allowed disabled:opacity-40 md:group-hover:flex"
        >
          {adding ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : added ? (
            <>
              <Check className="h-4 w-4" /> Added
            </>
          ) : (
            "Add to Cart"
          )}
        </button>
      </div>
    </article>
  );
}

export default function ProductRail({ title, subtitle, href, products, tag }: ProductRailProps) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto mt-8 max-w-[1440px] px-4 md:mt-10 md:px-8" aria-label={title}>
      <div className="md:px-10">
        <div className="mb-3 flex items-end justify-between gap-4 md:mb-4">
          <div className="min-w-0">
            <h2 className="text-lg font-bold leading-tight text-rd-text md:text-2xl">{title}</h2>
            {subtitle && <p className="mt-0.5 truncate text-sm text-rd-muted md:text-base">{subtitle}</p>}
          </div>
          <Link
            href={href}
            className="flex shrink-0 items-center gap-1 text-sm font-semibold text-rd-navy hover:underline"
          >
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
          <CarouselContent className="-ml-2 md:-ml-2.5">
            {products.map((product) => (
              <CarouselItem key={product.id} className="basis-[46%] pl-2 sm:basis-1/3 md:basis-1/4 md:pl-2.5 lg:basis-[19.5%]">
                <RailProductCard product={product} tag={tag} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-3 hidden h-9 w-9 border-0 bg-white shadow-md hover:bg-white md:-left-12 md:flex" />
          <CarouselNext className="-right-3 hidden h-9 w-9 border-0 bg-white shadow-md hover:bg-white md:-right-12 md:flex" />
        </Carousel>
      </div>
    </section>
  );
}
