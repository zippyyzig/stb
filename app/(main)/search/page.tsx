import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/products/ProductCard";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { Search, ChevronRight, Filter, SlidersHorizontal, X } from "lucide-react";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; sort?: string; page?: string }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q || "";

  return {
    title: query ? `Search: ${query}` : "Search Products",
    description: query
      ? `Search results for "${query}" at Smart Tech Bazaar. Find computer accessories, CCTV cameras, networking equipment, and more.`
      : "Search our extensive catalog of computer accessories, CCTV cameras, printers, and IT solutions.",
    robots: {
      index: false, // Don't index search pages
      follow: true,
    },
  };
}

interface ProductData {
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
  itemCode?: string;
  rating?: number;
}

async function searchProducts(
  query: string,
  sort: string = "relevance",
  page: number = 1,
  limit: number = 24
): Promise<{ products: ProductData[]; total: number }> {
  if (!query || query.length < 2) {
    return { products: [], total: 0 };
  }

  try {
    await dbConnect();

    // Build search query
    const searchRegex = new RegExp(query.split(/\s+/).join("|"), "i");
    const searchQuery = {
      isActive: true,
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { shortDescription: searchRegex },
        { sku: searchRegex },
        { tags: searchRegex },
      ],
    };

    // Build sort options
    let sortOptions: Record<string, 1 | -1> = {};
    switch (sort) {
      case "price_low":
        sortOptions = { priceB2C: 1 };
        break;
      case "price_high":
        sortOptions = { priceB2C: -1 };
        break;
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "popular":
        sortOptions = { soldCount: -1 };
        break;
      default:
        // Relevance - prioritize featured and best sellers
        sortOptions = { isFeatured: -1, soldCount: -1, createdAt: -1 };
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(searchQuery)
        .populate("brand", "name logo slug")
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(searchQuery),
    ]);

    return {
      products: products.map((p) => {
        const brandObj = p.brand as { name?: string; logo?: string } | string | undefined;
        const brandName = typeof brandObj === "object" && brandObj?.name
          ? brandObj.name
          : typeof brandObj === "string"
            ? brandObj
            : "Generic";
        const brandLogo = typeof brandObj === "object" && brandObj?.logo
          ? brandObj.logo
          : undefined;

        return {
          _id: p._id.toString(),
          name: p.name,
          slug: p.slug,
          images: p.images,
          priceB2C: p.priceB2C || p.mrp,
          priceB2B: p.priceB2B || p.priceB2C || p.mrp,
          mrp: p.mrp,
          stock: p.stock,
          brand: brandName,
          brandLogo,
          itemCode: p.sku || p._id.toString().slice(-6).toUpperCase(),
          rating: 0,
        };
      }),
      total,
    };
  } catch (error) {
    console.error("Search error:", error);
    return { products: [], total: 0 };
  }
}

const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "newest", label: "Newest First" },
  { value: "popular", label: "Most Popular" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
];

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || "";
  const sort = params.sort || "relevance";
  const page = parseInt(params.page || "1", 10);

  const { products, total } = await searchProducts(query, sort, page);
  const totalPages = Math.ceil(total / 24);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 pb-20 md:pb-0">
        {/* Breadcrumb */}
        <div className="border-b border-border bg-card">
          <div className="mx-auto flex max-w-7xl items-center gap-1.5 px-3 py-2.5 text-xs md:gap-2 md:px-4 md:py-3 md:text-sm">
            <Link href="/" className="text-muted-foreground hover:text-primary">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground md:h-4 md:w-4" />
            <span className="text-foreground">Search</span>
            {query && (
              <>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground md:h-4 md:w-4" />
                <span className="text-foreground truncate max-w-[200px]">{query}</span>
              </>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-3 py-4 md:px-4 md:py-8">
          {/* Search Header */}
          <div className="mb-6">
            <h1 className="heading-xl mb-2">
              {query ? (
                <>
                  Search results for{" "}
                  <span className="text-primary">&quot;{query}&quot;</span>
                </>
              ) : (
                "Search Products"
              )}
            </h1>
            {query && (
              <p className="body-md text-muted-foreground">
                {total} {total === 1 ? "product" : "products"} found
              </p>
            )}
          </div>

          {/* No Query State */}
          {!query && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="heading-md mb-2">Start your search</h2>
              <p className="body-md max-w-md text-muted-foreground">
                Enter a search term in the search bar above to find products.
                You can search by product name, brand, category, or SKU.
              </p>
            </div>
          )}

          {/* No Results State */}
          {query && products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="heading-md mb-2">No results found</h2>
              <p className="body-md max-w-md text-muted-foreground mb-6">
                We couldn&apos;t find any products matching &quot;{query}&quot;. Try
                adjusting your search or browse our categories.
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/products"
                  className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-stb-red-dark"
                >
                  Browse All Products
                </Link>
                <Link
                  href="/"
                  className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
                >
                  Go to Homepage
                </Link>
              </div>
            </div>
          )}

          {/* Results */}
          {query && products.length > 0 && (
            <>
              {/* Toolbar */}
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Showing {(page - 1) * 24 + 1}-{Math.min(page * 24, total)} of {total}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                  <select
                    defaultValue={sort}
                    onChange={(e) => {
                      const url = new URL(window.location.href);
                      url.searchParams.set("sort", e.target.value);
                      url.searchParams.set("page", "1");
                      window.location.href = url.toString();
                    }}
                    className="h-9 rounded-lg border border-border bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  {page > 1 && (
                    <Link
                      href={`/search?q=${encodeURIComponent(query)}&sort=${sort}&page=${page - 1}`}
                      className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium hover:bg-muted"
                    >
                      Previous
                    </Link>
                  )}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }
                      return (
                        <Link
                          key={pageNum}
                          href={`/search?q=${encodeURIComponent(query)}&sort=${sort}&page=${pageNum}`}
                          className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium ${
                            page === pageNum
                              ? "bg-primary text-white"
                              : "border border-border bg-white hover:bg-muted"
                          }`}
                        >
                          {pageNum}
                        </Link>
                      );
                    })}
                  </div>
                  {page < totalPages && (
                    <Link
                      href={`/search?q=${encodeURIComponent(query)}&sort=${sort}&page=${page + 1}`}
                      className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium hover:bg-muted"
                    >
                      Next
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
