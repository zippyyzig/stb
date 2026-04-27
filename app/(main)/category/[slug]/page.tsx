import { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryPageClient from "@/components/products/CategoryPageClient";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";
import Brand from "@/models/Brand";
import { siteConfig, getCanonicalUrl } from "@/lib/site-config";
import { generateCollectionPageSchema, generateOrganizationSchema } from "@/lib/schema";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getCategoryData(slug: string) {
  try {
    await dbConnect();
    
    // Get category
    const category = await Category.findOne({ slug, isActive: true }).lean();
    if (!category) return null;

    const categoryId = (category as { _id: unknown })._id;
    
    // Get subcategories
    const subcategories = await Category.find({ parent: categoryId, isActive: true })
      .sort({ sortOrder: 1 })
      .lean();

    // Get products for this category
    const products = await Product.find({ 
      category: categoryId, 
      isActive: true 
    })
      .sort({ isFeatured: -1, createdAt: -1 })
      .lean();

    // Get unique brand names from products
    const brandNames = [...new Set(products.map((p: { brand?: string }) => p.brand).filter(Boolean))] as string[];
    
    // Get brand details for the brands used in this category
    const brandDocs = await Brand.find({ 
      name: { $in: brandNames }, 
      isActive: true 
    }).lean();

    // Count products per brand
    const brandWithCounts = brandDocs.map((brand) => ({
      ...brand,
      productCount: products.filter((p: { brand?: string }) => p.brand === brand.name).length,
    }));

    // Get unique tags from products
    const allTags = products.flatMap((p: { tags?: string[] }) => p.tags || []);
    const uniqueTags = [...new Set(allTags)];

    // Calculate max price
    const prices = products.map((p: { priceB2C: number }) => p.priceB2C);
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 100000;

    return {
      category: JSON.parse(JSON.stringify(category)),
      subcategories: JSON.parse(JSON.stringify(subcategories)),
      products: JSON.parse(JSON.stringify(products)),
      brands: JSON.parse(JSON.stringify(brandWithCounts)),
      tags: uniqueTags,
      maxPrice: Math.ceil(maxPrice / 1000) * 1000, // Round up to nearest 1000
    };
  } catch (error) {
    console.error("Error fetching category data:", error);
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

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const data = await getCategoryData(slug);

  // If category not found, show 404
  if (!data) {
    notFound();
  }

  const { category, subcategories, products, brands, tags, maxPrice } = data;

  // Schema markup
  const schemas = [
    generateOrganizationSchema(),
    generateCollectionPageSchema(
      {
        name: category.name,
        slug: slug,
        description: category.description || `Browse ${category.name} products`,
        image: category.image,
        productCount: products.length,
      },
      "category",
      products.slice(0, 10)
    ),
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F8FA]">
      <Header />
      <main className="flex-1">
        {/* Schema */}
        <JsonLd data={schemas} />

        {/* Breadcrumb */}
        <Breadcrumbs items={[{ label: category.name }]} />

        {/* Category header */}
        <div className="border-b border-border bg-white px-3 py-4 md:px-4 md:py-6">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-lg font-extrabold text-foreground md:text-2xl">
              {category.name}
            </h1>
            {category.description && (
              <p className="mt-1 text-xs text-muted-foreground md:text-sm">
                {category.description}
              </p>
            )}
            <p className="mt-1.5 text-[10px] font-medium text-muted-foreground md:text-xs">
              {products.length} {products.length === 1 ? "product" : "products"} found
            </p>
          </div>
        </div>

        {/* Client interactive section */}
        <CategoryPageClient
          products={products}
          subcategories={subcategories}
          brands={brands}
          availableTags={tags}
          maxPrice={maxPrice}
          categorySlug={slug}
        />
      </main>
      <Footer />
    </div>
  );
}
