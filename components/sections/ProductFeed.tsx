"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Heart, Sparkles } from "lucide-react";
import { useWishlist } from "@/components/providers/CartWishlistProvider";
import { formatInr } from "./fk-theme";
import type { RailProduct } from "./ProductRail";

function FeedCard({ product }: { product: RailProduct }) {
  const { data: session } = useSession();
  const router = useRouter();
  const { isInWishlist, toggle } = useWishlist();

  const isB2B = session?.user?.isGstVerified === true;
  const price = Number(isB2B ? product.priceB2B : product.priceB2C) || 0;
  const mrp = Number(product.mrp) || 0;
  const discount = mrp > price && price > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const wishlisted = isInWishlist(product.id);

  const handleWishlist = async () => {
    if (!session) {
      router.push(`/auth/login?callbackUrl=/product/${product.slug}`);
      return;
    }
    await toggle(product.id);
  };

  return (
    <article className="relative overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5">
      <button
        type="button"
        onClick={handleWishlist}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={wishlisted}
        className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow"
      >
        <Heart className={`h-4 w-4 ${wishlisted ? "fill-[#FF3F6C] text-[#FF3F6C]" : "text-fk-grey"}`} />
      </button>

      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square bg-[#F5F5F5]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 768px) 220px, 48vw"
            className="object-contain p-3"
            unoptimized
          />
          {discount > 0 && (
            <span className="absolute bottom-2 left-2 rounded-md bg-gradient-to-r from-[#D6007B] to-[#FF5A1F] px-2 py-0.5 text-[11px] font-bold text-white">
              {discount}% OFF
            </span>
          )}
        </div>
        <div className="px-2.5 pb-3 pt-2">
          <p className="truncate text-sm leading-5 text-fk-ink">
            <span className="font-bold">{product.brand}</span>{" "}
            <span className="text-fk-grey">{product.name}</span>
          </p>
          <div className="mt-1 flex items-center gap-2">
            {mrp > price && <span className="text-xs text-fk-grey line-through">{formatInr(mrp)}</span>}
            <span className="text-sm font-bold text-fk-ink">{formatInr(price)}</span>
          </div>
          {!product.inStock && <p className="mt-0.5 text-xs font-semibold text-destructive">Out of stock</p>}
        </div>
      </Link>
    </article>
  );
}

export default function ProductFeed({ products }: { products: RailProduct[] }) {
  if (products.length === 0) return null;

  return (
    <section aria-labelledby="feed-title" className="mx-auto mt-6 max-w-[1200px] px-3 md:mt-8 md:px-4">
      <h2 id="feed-title" className="mb-3 flex items-center gap-2 text-lg font-bold text-fk-ink md:text-2xl">
        <Sparkles className="h-5 w-5 text-fk-gold" aria-hidden="true" />
        Festive picks for you
      </h2>
      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-5 md:gap-4">
        {products.map((product) => (
          <FeedCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
