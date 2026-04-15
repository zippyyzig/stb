import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductGallery from "@/components/products/ProductGallery";
import ProductInfo from "@/components/products/ProductInfo";
import RelatedProducts from "@/components/products/RelatedProducts";
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

// Sample product for display when DB is empty
const sampleProduct = {
  _id: "sample-product",
  name: "Hikvision 4MP ColorVu IP Camera DS-2CD2347G2-L",
  slug: "hikvision-4mp-colorvu-ip-camera",
  description: `
    <h3>Experience True Color Night Vision</h3>
    <p>The Hikvision ColorVu technology delivers vivid colorful images in a 24/7 environment. With warm supplemental lighting, advanced lens design, and high performance sensor, ColorVu cameras meet the challenge of low light conditions, providing full color capture even in near zero-light environments.</p>
    
    <h3>Key Features</h3>
    <ul>
      <li>4 Megapixel high resolution imaging</li>
      <li>24/7 colorful imaging with F1.0 aperture</li>
      <li>Water and dust resistant (IP67)</li>
      <li>Built-in microphone for audio recording</li>
      <li>Smart hybrid light with warm and IR LEDs</li>
      <li>H.265+ compression for efficient storage</li>
    </ul>
    
    <h3>Applications</h3>
    <p>Perfect for retail stores, parking lots, building entrances, and any location requiring color video surveillance at all times.</p>
  `,
  shortDescription:
    "24/7 colorful imaging with F1.0 aperture and warm supplemental lighting for exceptional low-light performance.",
  sku: "HIK-2CD2347G2-L",
  category: { _id: "cat-1", name: "Security", slug: "security" },
  brand: "Hikvision",
  images: [
    "https://images.unsplash.com/photo-1576088137266-a6cba01057ed?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1580584869245-fca9e24e2b62?w=600&h=600&fit=crop",
  ],
  priceB2C: 6999,
  priceB2B: 6299,
  mrp: 8499,
  stock: 45,
  minOrderQty: 1,
  maxOrderQty: 50,
  unit: "piece",
  specifications: [
    { key: "Resolution", value: "4 Megapixel (2560 x 1440)" },
    { key: "Lens", value: "2.8mm / 4mm Fixed" },
    { key: "Night Vision", value: "ColorVu (24/7 Color)" },
    { key: "IR Distance", value: "30 meters" },
    { key: "Weather Proof", value: "IP67" },
    { key: "Audio", value: "Built-in Microphone" },
    { key: "Compression", value: "H.265+ / H.264+" },
    { key: "Power", value: "DC 12V / PoE (802.3af)" },
  ],
  tags: ["cctv", "ip camera", "colorvu", "hikvision", "4mp"],
  isFeatured: true,
  isNewArrival: true,
  isBestSeller: false,
  views: 1234,
  soldCount: 156,
};

const sampleRelatedProducts = [
  {
    _id: "rel-1",
    name: "Hikvision 8CH NVR DS-7608NI-K2",
    slug: "hikvision-8ch-nvr",
    images: ["https://images.unsplash.com/photo-1576088137266-a6cba01057ed?w=300&h=300&fit=crop"],
    priceB2C: 12999,
    priceB2B: 11999,
    mrp: 15999,
    stock: 20,
    brand: "Hikvision",
  },
  {
    _id: "rel-2",
    name: "CP-Plus 2MP Dome Camera",
    slug: "cp-plus-2mp-dome",
    images: ["https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=300&h=300&fit=crop"],
    priceB2C: 1899,
    priceB2B: 1699,
    mrp: 2299,
    stock: 50,
    brand: "CP-Plus",
  },
  {
    _id: "rel-3",
    name: "Dahua 4MP Bullet Camera",
    slug: "dahua-4mp-bullet",
    images: ["https://images.unsplash.com/photo-1580584869245-fca9e24e2b62?w=300&h=300&fit=crop"],
    priceB2C: 3499,
    priceB2B: 3199,
    mrp: 4199,
    stock: 30,
    brand: "Dahua",
  },
  {
    _id: "rel-4",
    name: "CCTV BNC Connector Pack",
    slug: "cctv-bnc-connector",
    images: ["https://images.unsplash.com/photo-1576088137266-a6cba01057ed?w=300&h=300&fit=crop"],
    priceB2C: 199,
    priceB2B: 149,
    mrp: 299,
    stock: 200,
    brand: "Generic",
  },
];

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const data = await getProductData(slug);

  // Use sample data if no DB data
  const product = data?.product || sampleProduct;
  const relatedProducts = data?.relatedProducts || sampleRelatedProducts;

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

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <RelatedProducts products={relatedProducts} />
        )}
      </main>
      <Footer />
    </div>
  );
}
