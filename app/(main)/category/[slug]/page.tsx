import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryPageClient from "@/components/products/CategoryPageClient";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { siteConfig, getCanonicalUrl } from "@/lib/site-config";
import { generateCollectionPageSchema, generateOrganizationSchema } from "@/lib/schema";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getCategoryData(slug: string) {
  try {
    await dbConnect();
    const category = await Category.findOne({ slug, isActive: true }).lean();
    if (!category) return null;
    const subcategories = await Category.find({ parent: (category as { _id: unknown })._id, isActive: true })
      .sort({ sortOrder: 1 })
      .lean();
    const products = await Product.find({ category: (category as { _id: unknown })._id, isActive: true })
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

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCategoryData(slug);
  
  if (!data) {
    return { title: "Category Not Found" };
  }
  
  const title = data.category.name;
  const description = data.category.description || `Browse ${data.category.name} products at ${siteConfig.name}. Find the best deals on quality ${data.category.name.toLowerCase()} items.`;
  
  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl(`/category/${slug}`),
    },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: getCanonicalUrl(`/category/${slug}`),
      images: data.category.image ? [data.category.image] : undefined,
    },
  };
}

// Sample fallback products
const sampleProducts = [
  { _id: "s1", name: "TP-Link AC1200 Gigabit Router", slug: "tp-link-ac1200", priceB2C: 2499, priceB2B: 2199, mrp: 2999, stock: 15, images: ["https://images.unsplash.com/photo-1544985562-128e7b377a21?w=300&h=300&fit=crop"], brand: "TP-Link", isFeatured: true, isNewArrival: false },
  { _id: "s2", name: "D-Link 8-Port Gigabit Switch", slug: "d-link-8port", priceB2C: 1899, priceB2B: 1699, mrp: 2199, stock: 25, images: ["https://images.unsplash.com/photo-1544985562-128e7b377a21?w=300&h=300&fit=crop"], brand: "D-Link", isFeatured: false, isNewArrival: true },
  { _id: "s3", name: "Netgear Orbi Mesh WiFi System", slug: "netgear-orbi", priceB2C: 8999, priceB2B: 8499, mrp: 10999, stock: 8, images: ["https://images.unsplash.com/photo-1544985562-128e7b377a21?w=300&h=300&fit=crop"], brand: "Netgear", isFeatured: true, isNewArrival: false },
  { _id: "s4", name: "Cisco WAP150 Access Point", slug: "cisco-wap150", priceB2C: 12499, priceB2B: 11999, mrp: 14999, stock: 0, images: ["https://images.unsplash.com/photo-1544985562-128e7b377a21?w=300&h=300&fit=crop"], brand: "Cisco", isFeatured: false, isNewArrival: false },
  { _id: "s5", name: "Ubiquiti UniFi AP AC Pro", slug: "ubiquiti-unifi", priceB2C: 9999, priceB2B: 9499, mrp: 11999, stock: 12, images: ["https://images.unsplash.com/photo-1544985562-128e7b377a21?w=300&h=300&fit=crop"], brand: "Ubiquiti", isFeatured: true, isNewArrival: true },
  { _id: "s6", name: "MikroTik RouterBoard hEX S", slug: "mikrotik-hex", priceB2C: 4599, priceB2B: 4199, mrp: 5299, stock: 20, images: ["https://images.unsplash.com/photo-1544985562-128e7b377a21?w=300&h=300&fit=crop"], brand: "MikroTik", isFeatured: false, isNewArrival: false },
  { _id: "s7", name: "TP-Link EAP225 Access Point", slug: "tp-link-eap225", priceB2C: 3499, priceB2B: 3199, mrp: 3999, stock: 18, images: ["https://images.unsplash.com/photo-1544985562-128e7b377a21?w=300&h=300&fit=crop"], brand: "TP-Link", isFeatured: false, isNewArrival: true },
  { _id: "s8", name: "Linksys EA7500 Dual-Band Router", slug: "linksys-ea7500", priceB2C: 5999, priceB2B: 5499, mrp: 6999, stock: 5, images: ["https://images.unsplash.com/photo-1544985562-128e7b377a21?w=300&h=300&fit=crop"], brand: "Linksys", isFeatured: false, isNewArrival: false },
];

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const data = await getCategoryData(slug);

  const displayProducts = data?.products?.length ? data.products : sampleProducts;
  const categoryName = data?.category?.name || (slug.charAt(0).toUpperCase() + slug.slice(1));
  const categoryDescription = data?.category?.description || `Explore our range of ${categoryName} products`;
  const subcategories = data?.subcategories || [];
  const brands = [...new Set(displayProducts.map((p: { brand?: string }) => p.brand).filter(Boolean))] as string[];

  // Schema markup
  const schemas = [
    generateOrganizationSchema(),
    generateCollectionPageSchema(
      {
        name: categoryName,
        slug: slug,
        description: categoryDescription,
        image: data?.category?.image,
        productCount: displayProducts.length,
      },
      "category",
      displayProducts.slice(0, 10)
    ),
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F8FA]">
      <Header />
      <main className="flex-1">
        {/* Schema */}
        <JsonLd data={schemas} />

        {/* Breadcrumb */}
        <Breadcrumbs items={[{ label: categoryName }]} />

        {/* Category header */}
        <div className="border-b border-border bg-white px-3 py-4 md:px-4 md:py-6">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-lg font-extrabold text-foreground md:text-2xl">{categoryName}</h1>
            <p className="mt-1 text-xs text-muted-foreground md:text-sm">{categoryDescription}</p>
            <p className="mt-1.5 text-[10px] font-medium text-muted-foreground md:text-xs">
              {displayProducts.length} products found
            </p>
          </div>
        </div>

        {/* Client interactive section */}
        <CategoryPageClient
          products={displayProducts}
          subcategories={subcategories}
          brands={brands}
        />
      </main>
      <Footer />
    </div>
  );
}
