import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/products/ProductCard";
import CategoryFilters from "@/components/products/CategoryFilters";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { ChevronRight, Grid3X3, List, SlidersHorizontal } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getCategoryData(slug: string) {
  try {
    await dbConnect();

    const category = await Category.findOne({ slug, isActive: true }).lean();

    if (!category) {
      return null;
    }

    // Get subcategories
    const subcategories = await Category.find({
      parent: category._id,
      isActive: true,
    })
      .sort({ sortOrder: 1 })
      .lean();

    // Get products
    const products = await Product.find({
      category: category._id,
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .lean();

    return {
      category: JSON.parse(JSON.stringify(category)),
      subcategories: JSON.parse(JSON.stringify(subcategories)),
      products: JSON.parse(JSON.stringify(products)),
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCategoryData(slug);

  if (!data) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: data.category.name,
    description:
      data.category.description ||
      `Browse ${data.category.name} products at Sabka Tech Bazar`,
  };
}

// Sample products for display when DB is empty
const sampleProducts = [
  {
    _id: "sample-1",
    name: "TP-Link Gigabit Router AC1200",
    slug: "tp-link-gigabit-router",
    priceB2C: 2499,
    priceB2B: 2199,
    mrp: 2999,
    stock: 15,
    images: [
      "https://images.unsplash.com/photo-1544985562-128e7b377a21?w=300&h=300&fit=crop",
    ],
    brand: "TP-Link",
    isFeatured: true,
    isNewArrival: false,
  },
  {
    _id: "sample-2",
    name: "D-Link 8-Port Gigabit Switch",
    slug: "d-link-8-port-switch",
    priceB2C: 1899,
    priceB2B: 1699,
    mrp: 2199,
    stock: 25,
    images: [
      "https://images.unsplash.com/photo-1544985562-128e7b377a21?w=300&h=300&fit=crop",
    ],
    brand: "D-Link",
    isFeatured: false,
    isNewArrival: true,
  },
  {
    _id: "sample-3",
    name: "Netgear Mesh WiFi System",
    slug: "netgear-mesh-wifi",
    priceB2C: 8999,
    priceB2B: 8499,
    mrp: 10999,
    stock: 8,
    images: [
      "https://images.unsplash.com/photo-1544985562-128e7b377a21?w=300&h=300&fit=crop",
    ],
    brand: "Netgear",
    isFeatured: true,
    isNewArrival: false,
  },
  {
    _id: "sample-4",
    name: "Cisco Access Point WAP150",
    slug: "cisco-access-point",
    priceB2C: 12499,
    priceB2B: 11999,
    mrp: 14999,
    stock: 0,
    images: [
      "https://images.unsplash.com/photo-1544985562-128e7b377a21?w=300&h=300&fit=crop",
    ],
    brand: "Cisco",
    isFeatured: false,
    isNewArrival: false,
  },
  {
    _id: "sample-5",
    name: "Ubiquiti UniFi AP AC Pro",
    slug: "ubiquiti-unifi-ap",
    priceB2C: 9999,
    priceB2B: 9499,
    mrp: 11999,
    stock: 12,
    images: [
      "https://images.unsplash.com/photo-1544985562-128e7b377a21?w=300&h=300&fit=crop",
    ],
    brand: "Ubiquiti",
    isFeatured: true,
    isNewArrival: true,
  },
  {
    _id: "sample-6",
    name: "MikroTik RouterBoard hEX S",
    slug: "mikrotik-routerboard",
    priceB2C: 4599,
    priceB2B: 4199,
    mrp: 5299,
    stock: 20,
    images: [
      "https://images.unsplash.com/photo-1544985562-128e7b377a21?w=300&h=300&fit=crop",
    ],
    brand: "MikroTik",
    isFeatured: false,
    isNewArrival: false,
  },
];

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const searchParamsData = await searchParams;
  const data = await getCategoryData(slug);

  // For demo, show sample data if no DB data
  const displayProducts = data?.products?.length ? data.products : sampleProducts;
  const categoryName = data?.category?.name || slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        {/* Breadcrumb */}
        <div className="border-b border-border bg-card">
          <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-primary">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">{categoryName}</span>
          </div>
        </div>

        {/* Category Header */}
        <div className="bg-gradient-to-r from-primary to-stb-primary-dark">
          <div className="mx-auto max-w-7xl px-4 py-8">
            <h1 className="heading-xl text-white">{categoryName}</h1>
            <p className="body-md mt-2 text-white/80">
              {data?.category?.description ||
                `Explore our range of ${categoryName} products`}
            </p>
            <p className="body-sm mt-4 text-white/60">
              Showing {displayProducts.length} products
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex gap-6">
            {/* Filters Sidebar */}
            <aside className="hidden w-64 shrink-0 lg:block">
              <CategoryFilters
                subcategories={data?.subcategories || []}
                brands={[...new Set(displayProducts.map((p: { brand?: string }) => p.brand).filter(Boolean))] as string[]}
              />
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Sort & View Options */}
              <div className="mb-6 flex items-center justify-between rounded-lg bg-card p-3 shadow-sm">
                <div className="flex items-center gap-2 lg:hidden">
                  <button className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </button>
                </div>
                <div className="hidden items-center gap-2 lg:flex">
                  <span className="body-sm text-muted-foreground">View:</span>
                  <button className="rounded-md bg-primary p-2 text-white">
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button className="rounded-md bg-muted p-2 text-muted-foreground hover:bg-muted/80">
                    <List className="h-4 w-4" />
                  </button>
                </div>
                <select className="rounded-md border border-border bg-card px-3 py-2 text-sm">
                  <option>Sort by: Relevance</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest First</option>
                  <option>Best Selling</option>
                </select>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {displayProducts.map((product: {
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
                }) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* No Products */}
              {displayProducts.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-lg bg-card py-16">
                  <Image
                    src="https://illustrations.popsy.co/gray/product-launch.svg"
                    alt="No products"
                    width={200}
                    height={200}
                    className="mb-6 opacity-50"
                    unoptimized
                  />
                  <h3 className="heading-md text-muted-foreground">
                    No products found
                  </h3>
                  <p className="body-md mt-2 text-muted-foreground">
                    Try adjusting your filters or check back later
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
