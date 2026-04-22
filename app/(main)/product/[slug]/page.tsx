import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductGallery from "@/components/products/ProductGallery";
import ProductInfo from "@/components/products/ProductInfo";
import RelatedProducts from "@/components/products/RelatedProducts";
import ProductReviews from "@/components/products/ProductReviews";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { ChevronRight } from "lucide-react";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function getProductData(slug: string) {
  try {
    await dbConnect();

    const product = await Product.findOne({ slug, isActive: true })
      .populate("category", "name slug")
      .lean();

    if (!product) {
      return null;
    }

    // Get related products from same category
    const relatedProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
      isActive: true,
    })
      .limit(6)
      .lean();

    return {
      product: JSON.parse(JSON.stringify(product)),
      relatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
    };
  } catch {
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

  return {
    title: data.product.metaTitle || data.product.name,
    description:
      data.product.metaDescription ||
      data.product.shortDescription ||
      data.product.description?.slice(0, 160),
    openGraph: {
      images: data.product.images?.[0] ? [data.product.images[0]] : [],
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
            <Link
              href={`/category/${product.category?.slug || "products"}`}
              className="text-muted-foreground hover:text-primary"
            >
              {product.category?.name || "Products"}
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="line-clamp-1 text-foreground">{product.name}</span>
          </div>
        </div>

        {/* Product Section */}
        <section className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Gallery */}
            <ProductGallery images={product.images || []} name={product.name} />

            {/* Product Info */}
            <ProductInfo product={product} />
          </div>
        </section>

        {/* Description & Specs */}
        <section className="border-t border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 py-8">
            <div className="grid gap-8 lg:grid-cols-3">
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
                        className={`flex justify-between px-4 py-3 ${
                          index % 2 === 0 ? "bg-muted/50" : "bg-card"
                        }`}
                      >
                        <span className="body-sm font-medium text-foreground">
                          {spec.key}
                        </span>
                        <span className="body-sm text-muted-foreground">
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
          <div className="mx-auto max-w-7xl px-4 py-8">
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
