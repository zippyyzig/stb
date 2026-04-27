"use client";

import { useState, useMemo, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/products/ProductCard";
import ProductFilterSidebar, { FilterState } from "@/components/products/ProductFilterSidebar";
import { SlidersHorizontal, Grid3X3, LayoutList, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  isBestSeller?: boolean;
  tags?: string[];
}

interface Brand {
  _id?: string;
  name: string;
  slug?: string;
  productCount?: number;
}

interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  productCount?: number;
}

interface CategoryPageClientProps {
  products: Product[];
  subcategories: Subcategory[];
  brands: (string | Brand)[];
  availableTags?: string[];
  maxPrice?: number;
  categorySlug?: string;
}

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
  { value: "bestselling", label: "Best Selling" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
];

function CategoryPageContent({
  products,
  subcategories,
  brands,
  availableTags = [],
  maxPrice = 100000,
  categorySlug,
}: CategoryPageClientProps) {
  const searchParams = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);
  const [gridCols, setGridCols] = useState<2 | 3>(2);
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "relevance");

  // Initialize filters from URL
  const [filters, setFilters] = useState<FilterState>(() => ({
    search: searchParams.get("search") || "",
    brands: searchParams.get("brands")?.split(",").filter(Boolean) || [],
    subcategories: searchParams.get("subcategories")?.split(",").filter(Boolean) || [],
    priceMin: Number(searchParams.get("priceMin")) || 0,
    priceMax: Number(searchParams.get("priceMax")) || maxPrice,
    inStock: searchParams.get("inStock") === "true",
    onSale: searchParams.get("onSale") === "true",
    featured: searchParams.get("featured") === "true",
    newArrivals: searchParams.get("newArrivals") === "true",
    bestSeller: searchParams.get("bestSeller") === "true",
    tags: searchParams.get("tags")?.split(",").filter(Boolean) || [],
    sortBy: searchParams.get("sortBy") || "relevance",
  }));

  // Handle filter change from sidebar
  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    setSortBy(newFilters.sortBy);
  }, []);

  // Handle sort change from dropdown
  const handleSortChange = useCallback((value: string) => {
    setSortBy(value);
    setFilters((prev) => ({ ...prev, sortBy: value }));
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.brand?.toLowerCase().includes(searchLower) ||
          p.tags?.some((t) => t.toLowerCase().includes(searchLower))
      );
    }

    // Brand filter
    if (filters.brands.length > 0) {
      result = result.filter((p) => p.brand && filters.brands.includes(p.brand));
    }

    // Price filter
    if (filters.priceMin > 0 || filters.priceMax < maxPrice) {
      result = result.filter(
        (p) => p.priceB2C >= filters.priceMin && p.priceB2C <= filters.priceMax
      );
    }

    // Stock filter
    if (filters.inStock) {
      result = result.filter((p) => p.stock > 0);
    }

    // On sale filter (MRP > priceB2C)
    if (filters.onSale) {
      result = result.filter((p) => p.mrp > p.priceB2C);
    }

    // Featured filter
    if (filters.featured) {
      result = result.filter((p) => p.isFeatured);
    }

    // New arrivals filter
    if (filters.newArrivals) {
      result = result.filter((p) => p.isNewArrival);
    }

    // Best seller filter
    if (filters.bestSeller) {
      result = result.filter((p) => p.isBestSeller);
    }

    // Tags filter
    if (filters.tags.length > 0) {
      result = result.filter((p) =>
        p.tags?.some((t) => filters.tags.includes(t))
      );
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.priceB2C - b.priceB2C);
        break;
      case "price-desc":
        result.sort((a, b) => b.priceB2C - a.priceB2C);
        break;
      case "newest":
        // Already sorted by newest from server
        break;
      case "bestselling":
        result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Relevance: featured first, then by date
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [products, filters, sortBy, maxPrice]);

  // Count active filters
  const activeFiltersCount =
    filters.brands.length +
    filters.subcategories.length +
    filters.tags.length +
    (filters.inStock ? 1 : 0) +
    (filters.onSale ? 1 : 0) +
    (filters.featured ? 1 : 0) +
    (filters.newArrivals ? 1 : 0) +
    (filters.bestSeller ? 1 : 0) +
    (filters.priceMin > 0 || filters.priceMax < maxPrice ? 1 : 0) +
    (filters.search ? 1 : 0);

  return (
    <div className="mx-auto max-w-7xl px-3 py-3 md:px-4 md:py-5">
      {/* Sticky sort/filter bar */}
      <div className="sticky top-0 z-30 mb-3 flex items-center justify-between gap-2 overflow-hidden rounded-xl border border-border bg-white px-3 py-2 shadow-sm md:mb-4 md:rounded-lg">
        {/* Mobile: Filter trigger */}
        <button
          onClick={() => setFilterOpen(true)}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-2.5 py-1.5 text-[11px] font-semibold text-foreground transition-colors hover:border-primary hover:text-primary md:hidden"
        >
          <SlidersHorizontal className="h-3 w-3" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge className="h-4 min-w-4 justify-center rounded-full px-1 text-[9px]">
              {activeFiltersCount}
            </Badge>
          )}
        </button>

        {/* Product count */}
        <span className="text-[11px] text-muted-foreground">
          {filteredProducts.length} of {products.length} products
        </span>

        <div className="flex items-center gap-2">
          {/* Grid toggle - mobile only */}
          <div className="flex overflow-hidden rounded-lg border border-border md:hidden">
            <button
              onClick={() => setGridCols(2)}
              className={`flex h-7 w-7 items-center justify-center transition-colors ${
                gridCols === 2
                  ? "bg-primary text-white"
                  : "bg-white text-muted-foreground"
              }`}
            >
              <Grid3X3 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setGridCols(3)}
              className={`flex h-7 w-7 items-center justify-center transition-colors ${
                gridCols === 3
                  ? "bg-primary text-white"
                  : "bg-white text-muted-foreground"
              }`}
            >
              <LayoutList className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Sort */}
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="h-8 w-[140px] text-[11px] md:w-[160px] md:text-xs">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value} className="text-xs">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Desktop sidebar filter */}
        <aside className="hidden w-56 shrink-0 lg:block xl:w-60">
          <div className="sticky top-16 overflow-hidden rounded-xl border border-border bg-white shadow-sm">
            <ProductFilterSidebar
              brands={brands}
              subcategories={subcategories}
              availableTags={availableTags}
              maxPrice={maxPrice}
              onFilterChange={handleFilterChange}
              categorySlug={categorySlug}
              showSearch={true}
            />
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-white py-16 text-center">
              <div className="mb-3 text-4xl">📦</div>
              <h3 className="text-sm font-bold text-foreground">No products found</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Try adjusting your filters or check back later
              </p>
            </div>
          ) : (
            <div
              className={`grid gap-2.5 md:gap-3 ${
                gridCols === 3
                  ? "grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4"
                  : "grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4"
              }`}
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter bottom sheet */}
      {filterOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setFilterOpen(false)}
          />
          {/* Sheet */}
          <div className="animate-slide-up fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-hidden rounded-t-2xl bg-white shadow-2xl md:hidden">
            <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-border" />
            <ProductFilterSidebar
              brands={brands}
              subcategories={subcategories}
              availableTags={availableTags}
              maxPrice={maxPrice}
              onFilterChange={handleFilterChange}
              onClose={() => setFilterOpen(false)}
              categorySlug={categorySlug}
              showSearch={true}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default function CategoryPageClient(props: CategoryPageClientProps) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <CategoryPageContent {...props} />
    </Suspense>
  );
}
