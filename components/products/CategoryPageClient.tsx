"use client";

import { useState } from "react";
import ProductCard from "@/components/products/ProductCard";
import CategoryFilters from "@/components/products/CategoryFilters";
import { SlidersHorizontal, Grid3X3, LayoutList, X } from "lucide-react";

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

interface CategoryPageClientProps {
  products: Product[];
  subcategories: Array<{ _id: string; name: string; slug: string }>;
  brands: string[];
}

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
];

export default function CategoryPageClient({ products, subcategories, brands }: CategoryPageClientProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [gridCols, setGridCols] = useState<2 | 3>(2);
  const [sort, setSort] = useState("relevance");

  return (
    <div className="mx-auto max-w-7xl px-3 py-3 md:px-4 md:py-5">
      {/* ── Sticky sort/filter bar ──────────────────────────────────── */}
      <div className="sticky top-0 z-30 mb-3 flex items-center justify-between gap-2 overflow-hidden rounded-xl border border-border bg-white px-3 py-2 shadow-sm md:mb-4 md:rounded-lg">
        {/* Mobile: Filter trigger */}
        <button
          onClick={() => setFilterOpen(true)}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-2.5 py-1.5 text-[11px] font-semibold text-foreground transition-colors hover:border-primary hover:text-primary md:hidden"
        >
          <SlidersHorizontal className="h-3 w-3" />
          Filters
          {brands.length > 0 || subcategories.length > 0 ? (
            <span className="rounded-full bg-primary px-1 text-[9px] font-bold text-white">
              {brands.length + subcategories.length}
            </span>
          ) : null}
        </button>

        {/* Product count */}
        <span className="hidden text-[11px] text-muted-foreground md:block">
          {products.length} products
        </span>

        <div className="flex items-center gap-2">
          {/* Grid toggle — mobile only */}
          <div className="flex overflow-hidden rounded-lg border border-border md:hidden">
            <button
              onClick={() => setGridCols(2)}
              className={`flex h-7 w-7 items-center justify-center transition-colors ${gridCols === 2 ? "bg-primary text-white" : "bg-white text-muted-foreground"}`}
            >
              <Grid3X3 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setGridCols(3)}
              className={`flex h-7 w-7 items-center justify-center transition-colors ${gridCols === 3 ? "bg-primary text-white" : "bg-white text-muted-foreground"}`}
            >
              <LayoutList className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="max-w-[130px] truncate rounded-lg border border-border bg-white px-2 py-1.5 text-[11px] font-medium text-foreground focus:border-primary focus:outline-none md:max-w-none md:text-xs"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-4">
        {/* ── Desktop sidebar filter ──────────────────────────────── */}
        <aside className="hidden w-56 shrink-0 lg:block xl:w-60">
          <div className="sticky top-16 rounded-xl border border-border bg-white shadow-sm overflow-hidden">
            <CategoryFilters subcategories={subcategories} brands={brands} />
          </div>
        </aside>

        {/* ── Product grid ────────────────────────────────────────── */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-white py-16 text-center">
              <div className="mb-3 text-4xl">📦</div>
              <h3 className="text-sm font-bold text-foreground">No products found</h3>
              <p className="mt-1 text-xs text-muted-foreground">Try adjusting your filters or check back later</p>
            </div>
          ) : (
            <div className={`grid gap-2.5 md:gap-3 ${
              gridCols === 3
                ? "grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4"
                : "grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4"
            }`}>
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile filter bottom sheet ──────────────────────────── */}
      {filterOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setFilterOpen(false)}
          />
          {/* Sheet */}
          <div className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-hidden rounded-t-2xl bg-white shadow-2xl md:hidden animate-fade-in">
            <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-border" />
            <CategoryFilters
              subcategories={subcategories}
              brands={brands}
              onClose={() => setFilterOpen(false)}
            />
          </div>
        </>
      )}
    </div>
  );
}
