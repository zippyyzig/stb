"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ChevronRight,
  Grid3X3,
  LayoutList,
  SlidersHorizontal,
  Search,
  X,
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
  category?: { _id: string; name: string; slug: string };
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  tags?: string[];
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  productCount?: number;
}

interface Brand {
  _id: string;
  name: string;
  slug: string;
  productCount?: number;
}

interface FiltersState {
  search: string;
  categories: string[];
  brands: string[];
  priceMin: number;
  priceMax: number;
  inStock: boolean;
  onSale: boolean;
  featured: boolean;
  newArrivals: boolean;
  sortBy: string;
}

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [filters, setFilters] = useState<FiltersState>({
    search: searchParams.get("search") || "",
    categories: searchParams.get("categories")?.split(",").filter(Boolean) || [],
    brands: searchParams.get("brands")?.split(",").filter(Boolean) || [],
    priceMin: Number(searchParams.get("priceMin")) || 0,
    priceMax: Number(searchParams.get("priceMax")) || 100000,
    inStock: searchParams.get("inStock") === "true",
    onSale: searchParams.get("onSale") === "true",
    featured: searchParams.get("featured") === "true",
    newArrivals: searchParams.get("newArrivals") === "true",
    sortBy: searchParams.get("sortBy") || "relevance",
  });

  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.priceMin,
    filters.priceMax,
  ]);

  // Fetch categories and brands on mount
  useEffect(() => {
    const fetchFiltersData = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/brands"),
        ]);
        const catData = await catRes.json();
        const brandData = await brandRes.json();
        setCategories(catData.categories || []);
        setBrands(brandData.brands || []);
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    };
    fetchFiltersData();
  }, []);

  // Build query string from filters
  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.categories.length) params.set("categories", filters.categories.join(","));
    if (filters.brands.length) params.set("brands", filters.brands.join(","));
    if (filters.priceMin > 0) params.set("priceMin", String(filters.priceMin));
    if (filters.priceMax < 100000) params.set("priceMax", String(filters.priceMax));
    if (filters.inStock) params.set("inStock", "true");
    if (filters.onSale) params.set("onSale", "true");
    if (filters.featured) params.set("featured", "true");
    if (filters.newArrivals) params.set("newArrivals", "true");
    if (filters.sortBy !== "relevance") params.set("sortBy", filters.sortBy);
    params.set("page", String(page));
    params.set("limit", "20");
    return params.toString();
  }, [filters, page]);

  // Fetch products
  const fetchProducts = useCallback(async (reset = false) => {
    setIsLoading(true);
    try {
      const queryString = buildQueryString();
      const res = await fetch(`/api/products?${queryString}`);
      const data = await res.json();

      if (reset) {
        setProducts(data.products || []);
      } else {
        setProducts((prev) => [...prev, ...(data.products || [])]);
      }
      setTotalProducts(data.total || 0);
      setHasMore((data.products?.length || 0) === 20);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  }, [buildQueryString]);

  // Fetch products when filters change
  useEffect(() => {
    setPage(1);
    fetchProducts(true);
    // Update URL
    const queryString = buildQueryString();
    router.replace(`/products?${queryString}`, { scroll: false });
  }, [filters]);

  // Fetch more products when page changes (load more)
  useEffect(() => {
    if (page > 1) {
      fetchProducts(false);
    }
  }, [page]);

  const handleFilterChange = <K extends keyof FiltersState>(
    key: K,
    value: FiltersState[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter((c) => c !== categoryId)
        : [...prev.categories, categoryId],
    }));
  };

  const handleBrandToggle = (brandId: string) => {
    setFilters((prev) => ({
      ...prev,
      brands: prev.brands.includes(brandId)
        ? prev.brands.filter((b) => b !== brandId)
        : [...prev.brands, brandId],
    }));
  };

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  const applyPriceRange = () => {
    setFilters((prev) => ({
      ...prev,
      priceMin: priceRange[0],
      priceMax: priceRange[1],
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      search: "",
      categories: [],
      brands: [],
      priceMin: 0,
      priceMax: 100000,
      inStock: false,
      onSale: false,
      featured: false,
      newArrivals: false,
      sortBy: "relevance",
    });
    setPriceRange([0, 100000]);
  };

  const activeFiltersCount =
    filters.categories.length +
    filters.brands.length +
    (filters.inStock ? 1 : 0) +
    (filters.onSale ? 1 : 0) +
    (filters.featured ? 1 : 0) +
    (filters.newArrivals ? 1 : 0) +
    (filters.priceMin > 0 || filters.priceMax < 100000 ? 1 : 0);

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Search</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Categories */}
      <Accordion type="single" collapsible defaultValue="categories">
        <AccordionItem value="categories" className="border-none">
          <AccordionTrigger className="py-2 text-sm font-semibold hover:no-underline">
            Categories
          </AccordionTrigger>
          <AccordionContent>
            <div className="max-h-48 space-y-2 overflow-y-auto pr-2">
              {categories.map((cat) => (
                <label
                  key={cat._id}
                  className="flex cursor-pointer items-center gap-2 text-sm"
                >
                  <Checkbox
                    checked={filters.categories.includes(cat._id)}
                    onCheckedChange={() => handleCategoryToggle(cat._id)}
                  />
                  <span className="flex-1 text-foreground">{cat.name}</span>
                  {cat.productCount !== undefined && (
                    <span className="text-xs text-muted-foreground">
                      ({cat.productCount})
                    </span>
                  )}
                </label>
              ))}
              {categories.length === 0 && (
                <p className="text-sm text-muted-foreground">No categories found</p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Brands */}
      <Accordion type="single" collapsible defaultValue="brands">
        <AccordionItem value="brands" className="border-none">
          <AccordionTrigger className="py-2 text-sm font-semibold hover:no-underline">
            Brands
          </AccordionTrigger>
          <AccordionContent>
            <div className="max-h-48 space-y-2 overflow-y-auto pr-2">
              {brands.map((brand) => (
                <label
                  key={brand._id}
                  className="flex cursor-pointer items-center gap-2 text-sm"
                >
                  <Checkbox
                    checked={filters.brands.includes(brand._id)}
                    onCheckedChange={() => handleBrandToggle(brand._id)}
                  />
                  <span className="flex-1 text-foreground">{brand.name}</span>
                  {brand.productCount !== undefined && (
                    <span className="text-xs text-muted-foreground">
                      ({brand.productCount})
                    </span>
                  )}
                </label>
              ))}
              {brands.length === 0 && (
                <p className="text-sm text-muted-foreground">No brands found</p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Price Range */}
      <Accordion type="single" collapsible defaultValue="price">
        <AccordionItem value="price" className="border-none">
          <AccordionTrigger className="py-2 text-sm font-semibold hover:no-underline">
            Price Range
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 px-1">
              <Slider
                value={priceRange}
                onValueChange={handlePriceRangeChange}
                min={0}
                max={100000}
                step={500}
                className="w-full"
              />
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([Number(e.target.value), priceRange[1]])
                  }
                  className="h-8 text-sm"
                  placeholder="Min"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], Number(e.target.value)])
                  }
                  className="h-8 text-sm"
                  placeholder="Max"
                />
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={applyPriceRange}
              >
                Apply Price
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Availability & Features */}
      <Accordion type="single" collapsible defaultValue="availability">
        <AccordionItem value="availability" className="border-none">
          <AccordionTrigger className="py-2 text-sm font-semibold hover:no-underline">
            Availability & Features
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <Checkbox
                  checked={filters.inStock}
                  onCheckedChange={(checked) =>
                    handleFilterChange("inStock", checked === true)
                  }
                />
                <span className="text-foreground">In Stock Only</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <Checkbox
                  checked={filters.onSale}
                  onCheckedChange={(checked) =>
                    handleFilterChange("onSale", checked === true)
                  }
                />
                <span className="text-foreground">On Sale</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <Checkbox
                  checked={filters.featured}
                  onCheckedChange={(checked) =>
                    handleFilterChange("featured", checked === true)
                  }
                />
                <span className="text-foreground">Featured Products</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <Checkbox
                  checked={filters.newArrivals}
                  onCheckedChange={(checked) =>
                    handleFilterChange("newArrivals", checked === true)
                  }
                />
                <span className="text-foreground">New Arrivals</span>
              </label>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button
          variant="outline"
          className="w-full"
          onClick={clearAllFilters}
        >
          Clear All Filters ({activeFiltersCount})
        </Button>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b border-border bg-card">
          <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-primary">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">All Products</span>
          </div>
        </div>

        {/* Page Header */}
        <div className="bg-gradient-to-r from-primary to-stb-primary-dark">
          <div className="mx-auto max-w-7xl px-4 py-8">
            <h1 className="text-2xl font-bold text-white md:text-3xl">
              All Products
            </h1>
            <p className="mt-2 text-white/80">
              Browse our complete collection of products
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex gap-6">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden w-64 shrink-0 lg:block">
              <div className="sticky top-4 rounded-lg border border-border bg-card p-4">
                <h2 className="mb-4 text-base font-semibold text-foreground">
                  Filters
                </h2>
                <FilterSidebar />
              </div>
            </aside>

            {/* Products Area */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-3">
                {/* Mobile Filter Button */}
                <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden">
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      Filters
                      {activeFiltersCount > 0 && (
                        <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-[10px]">
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterSidebar />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Results Count */}
                <p className="text-sm text-muted-foreground">
                  Showing {products.length} of {totalProducts} products
                </p>

                {/* View Mode & Sort */}
                <div className="flex items-center gap-3">
                  {/* View Mode Toggle */}
                  <div className="hidden items-center gap-1 rounded-md border border-border p-1 sm:flex">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`rounded p-1.5 transition-colors ${
                        viewMode === "grid"
                          ? "bg-primary text-white"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`rounded p-1.5 transition-colors ${
                        viewMode === "list"
                          ? "bg-primary text-white"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <LayoutList className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Sort Select */}
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) => handleFilterChange("sortBy", value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="price-asc">Price: Low to High</SelectItem>
                      <SelectItem value="price-desc">Price: High to Low</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="bestselling">Best Selling</SelectItem>
                      <SelectItem value="name-asc">Name: A to Z</SelectItem>
                      <SelectItem value="name-desc">Name: Z to A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Active Filters */}
              {activeFiltersCount > 0 && (
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="text-sm text-muted-foreground">Active:</span>
                  {filters.categories.map((catId) => {
                    const cat = categories.find((c) => c._id === catId);
                    return cat ? (
                      <Badge
                        key={catId}
                        variant="secondary"
                        className="cursor-pointer gap-1 pr-1"
                        onClick={() => handleCategoryToggle(catId)}
                      >
                        {cat.name}
                        <X className="h-3 w-3" />
                      </Badge>
                    ) : null;
                  })}
                  {filters.brands.map((brandId) => {
                    const brand = brands.find((b) => b._id === brandId);
                    return brand ? (
                      <Badge
                        key={brandId}
                        variant="secondary"
                        className="cursor-pointer gap-1 pr-1"
                        onClick={() => handleBrandToggle(brandId)}
                      >
                        {brand.name}
                        <X className="h-3 w-3" />
                      </Badge>
                    ) : null;
                  })}
                  {filters.inStock && (
                    <Badge
                      variant="secondary"
                      className="cursor-pointer gap-1 pr-1"
                      onClick={() => handleFilterChange("inStock", false)}
                    >
                      In Stock
                      <X className="h-3 w-3" />
                    </Badge>
                  )}
                  {filters.onSale && (
                    <Badge
                      variant="secondary"
                      className="cursor-pointer gap-1 pr-1"
                      onClick={() => handleFilterChange("onSale", false)}
                    >
                      On Sale
                      <X className="h-3 w-3" />
                    </Badge>
                  )}
                  {(filters.priceMin > 0 || filters.priceMax < 100000) && (
                    <Badge
                      variant="secondary"
                      className="cursor-pointer gap-1 pr-1"
                      onClick={() => {
                        handleFilterChange("priceMin", 0);
                        handleFilterChange("priceMax", 100000);
                        setPriceRange([0, 100000]);
                      }}
                    >
                      ₹{filters.priceMin.toLocaleString()} - ₹{filters.priceMax.toLocaleString()}
                      <X className="h-3 w-3" />
                    </Badge>
                  )}
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-primary hover:underline"
                  >
                    Clear all
                  </button>
                </div>
              )}

              {/* Products Grid */}
              {isLoading && products.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card py-16">
                  <Image
                    src="https://illustrations.popsy.co/gray/product-launch.svg"
                    alt="No products"
                    width={200}
                    height={200}
                    className="mb-6 opacity-50"
                    unoptimized
                  />
                  <h3 className="text-lg font-semibold text-muted-foreground">
                    No products found
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Try adjusting your filters or search term
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={clearAllFilters}
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <>
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
                        : "space-y-4"
                    }
                  >
                    {products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>

                  {/* Load More */}
                  {hasMore && (
                    <div className="mt-8 flex justify-center">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          "Load More Products"
                        )}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
