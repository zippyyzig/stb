import { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductGallery from "@/components/products/ProductGallery";
import ProductInfo from "@/components/products/ProductInfo";
import RelatedProducts from "@/components/products/RelatedProducts";
import ProductReviews from "@/components/products/ProductReviews";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { siteConfig, getCanonicalUrl } from "@/lib/site-config";
import { generateProductSchema, generateOrganizationSchema } from "@/lib/schema";

// Disable caching to always fetch fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function getProductData(slug: string) {
  try {
    await dbConnect();

    // First try to find by slug with isActive: true
    let product = await Product.findOne({ slug, isActive: true })
      .populate("category", "name slug")
      .lean();

    // If not found, try without isActive filter (in case it's set to false by default)
    if (!product) {
      product = await Product.findOne({ slug })
        .populate("category", "name slug")
        .lean();
      
      // If found but inactive, still return null (product exists but is hidden)
      if (product && product.isActive === false) {
        console.log(`[v0] Product "${slug}" found but isActive is false`);
        return null;
      }
    }

    if (!product) {
      console.log(`[v0] Product not found for slug: ${slug}`);
      return null;
    }

    // Get related products from same category (only if category exists)
    let relatedProducts: typeof product[] = [];
    
    // Handle case where category might be an ObjectId or a populated object
    const categoryId = product.category && typeof product.category === 'object' && '_id' in product.category
      ? product.category._id
      : product.category;
    
    if (categoryId) {
      relatedProducts = await Product.find({
        category: categoryId,
        _id: { $ne: product._id },
        isActive: true,
      })
        .limit(6)
        .lean();
    }

    return {
      product: JSON.parse(JSON.stringify(product)),
      relatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
    };
  } catch (error) {
    console.error(`[v0] Error fetching product "${slug}":`, error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProductData(slug);

  if (!data) {
    return {
      title: "Product Not Found",
    };
  }

  const title = data.product.metaTitle || data.product.name;
  const description = data.product.metaDescription ||
    data.product.shortDescription ||
    data.product.description?.replace(/<[^>]*>/g, "").slice(0, 160) ||
    `Buy ${data.product.name} at ${siteConfig.name}. Best prices on ${data.product.brand || "quality"} products.`;

  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl(`/product/${slug}`),
    },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: getCanonicalUrl(`/product/${slug}`),
      images: data.product.images?.[0] ? [data.product.images[0]] : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description,
      images: data.product.images?.[0] ? [data.product.images[0]] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const data = await getProductData(slug);

  // Return 404 if product not found
  if (!data?.product) {
    notFound();
  }

  const product = data.product;
  const relatedProducts = data.relatedProducts || [];

  // Schema markup
  const schemas = [
    generateOrganizationSchema(),
    generateProductSchema({
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      images: product.images || [],
      priceB2C: product.priceB2C,
      mrp: product.mrp,
      stock: product.stock,
      sku: product.sku,
      brand: product.brand,
      category: product.category,
      specifications: product.specifications,
    }),
  ];

  // Breadcrumb items - handle case where category might not be populated
  const categoryName = product.category && typeof product.category === 'object' ? product.category.name : null;
  const categorySlug = product.category && typeof product.category === 'object' ? product.category.slug : null;
  
  const breadcrumbItems = [
    ...(categoryName && categorySlug ? [{ label: categoryName, href: `/category/${categorySlug}` }] : []),
    { label: product.name },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-[#F7F8FA] pb-40 md:pb-0">
        {/* Schema */}
        <JsonLd data={schemas} />

        {/* Breadcrumb */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* Product Section */}
        <section className="mx-auto max-w-7xl px-3 py-4 md:px-4 md:py-8">
          <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
            {/* Gallery */}
            <ProductGallery images={product.images || []} name={product.name} />

            {/* Product Info */}
            <ProductInfo product={product} />
          </div>
        </section>

        {/* Description & Specs */}
        <section className="border-t border-border bg-card">
          <div className="mx-auto max-w-7xl px-3 py-5 md:px-4 md:py-8">
            <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
              {/* Description */}
              <div className="lg:col-span-2">
                <h2 className="heading-lg mb-4">Product Description</h2>
                <div
                  className="prose prose-sm max-w-none text-muted-foreground"
                  dangerouslySetInnerHTML={{
                    __html: product.description || "No description available.",
                  }}
                />
              </div>

              {/* Specifications */}
              <div>
                <h2 className="heading-lg mb-4">Specifications</h2>
                <div className="rounded-lg border border-border">
                  {product.specifications?.map(
                    (spec: { key: string; value: string }, index: number) => (
                      <div
                        key={spec.key}
                        className={`flex items-start justify-between gap-3 px-3 py-2.5 md:px-4 md:py-3 ${
                          index % 2 === 0 ? "bg-muted/50" : "bg-card"
                        }`}
                      >
                        <span className="body-sm shrink-0 font-medium text-foreground">
                          {spec.key}
                        </span>
                        <span className="body-sm min-w-0 break-words text-right text-muted-foreground">
                          {spec.value}
                        </span>
                      </div>
                    )
                  )}
                  {(!product.specifications ||
                    product.specifications.length === 0) && (
                    <div className="px-4 py-8 text-center text-muted-foreground">
                      No specifications available
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-7xl px-3 py-5 md:px-4 md:py-8">
            <ProductReviews productId={product._id} productName={product.name} />
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <RelatedProducts products={relatedProducts} />
        )}
      </main>
      <Footer />
    </div>
  );
}
