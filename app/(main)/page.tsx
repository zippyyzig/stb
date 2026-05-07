import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroBanner from "@/components/sections/HeroBanner";
import TopCategories from "@/components/sections/TopCategories";
import ProductSection from "@/components/sections/ProductSection";
import BrandsSection from "@/components/sections/BrandsSection";
import AdBannerSlider from "@/components/sections/AdBannerSlider";
import BestSellersSection from "@/components/sections/BestSellersSection";
import MostPopularSection from "@/components/sections/MostPopularSection";
import HotBrandsSection from "@/components/sections/HotBrandsSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import JsonLd from "@/components/seo/JsonLd";
import dbConnect from "@/lib/mongodb";
import Settings from "@/models/Settings";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Brand from "@/models/Brand";
import Banner from "@/models/Banner";
import { 
  generateOrganizationSchema, 
  generateWebSiteSchema, 
  generateLocalBusinessSchema 
} from "@/lib/schema";

interface HomepageSection {
  categoryId: string;
  title: string;
  slug: string;
  enabled: boolean;
  sortOrder: number;
  productIds?: string[];
  subcategories: string[];
}

interface SubcategoryTab {
  name: string;
  href?: string;
  isActive?: boolean;
}

interface ProductData {
  id: string;
  name: string;
  slug: string;
  image: string;
  secondImage?: string;
  priceB2C: number;
  priceB2B: number;
  mrp: number;
  inStock: boolean;
  brand: string;
  brandLogo?: string;
  productId?: string;
  itemCode?: string;
  rating?: number;
  description?: string;
  soldCount?: number;
  views?: number;
}

interface SectionData {
  title: string;
  slug: string;
  subcategories: SubcategoryTab[];
  products: ProductData[];
}

interface CategoryData {
  id: string;
  name: string;
  image: string;
  slug: string;
  productCount: number;
}

interface BrandData {
  id: string;
  name: string;
  logo: string;
  slug: string;
  productCount?: number;
}

interface BannerData {
  id: string;
  image: string;
  imageMobile?: string;
  alt: string;
  href: string;
}

// Fetch hero slider banners from database
async function getHeroSliderBanners(): Promise<BannerData[]> {
  try {
    await dbConnect();

    const now = new Date();
    const banners = await Banner.find({
      position: "hero_slider",
      isActive: true,
      $or: [
        { startDate: null, endDate: null },
        { startDate: { $lte: now }, endDate: null },
        { startDate: null, endDate: { $gte: now } },
        { startDate: { $lte: now }, endDate: { $gte: now } },
      ],
    })
      .sort({ sortOrder: 1 })
      .lean();

    return banners.map((b) => ({
      id: b._id.toString(),
      image: b.image,
      imageMobile: b.imageMobile,
      alt: b.title || "Banner",
      href: b.link || "/",
    }));
  } catch (error) {
    console.error("Error fetching hero slider banners:", error);
    return [];
  }
}

// Fetch ad banners from database
async function getAdBanners(): Promise<BannerData[]> {
  try {
    await dbConnect();

    const now = new Date();
    const banners = await Banner.find({
      position: "ad_banner",
      isActive: true,
      $or: [
        { startDate: null, endDate: null },
        { startDate: { $lte: now }, endDate: null },
        { startDate: null, endDate: { $gte: now } },
        { startDate: { $lte: now }, endDate: { $gte: now } },
      ],
    })
      .sort({ sortOrder: 1 })
      .lean();

    return banners.map((b) => ({
      id: b._id.toString(),
      image: b.image,
      imageMobile: b.imageMobile,
      alt: b.title || "Ad Banner",
      href: b.link || "/",
    }));
  } catch (error) {
    console.error("Error fetching ad banners:", error);
    return [];
  }
}

// Fetch promo banners from database
async function getPromoBanners(): Promise<BannerData[]> {
  try {
    await dbConnect();

    const now = new Date();
    const banners = await Banner.find({
      position: "promo",
      isActive: true,
      $or: [
        { startDate: null, endDate: null },
        { startDate: { $lte: now }, endDate: null },
        { startDate: null, endDate: { $gte: now } },
        { startDate: { $lte: now }, endDate: { $gte: now } },
      ],
    })
      .sort({ sortOrder: 1 })
      .limit(1)
      .lean();

    return banners.map((b) => ({
      id: b._id.toString(),
      image: b.image,
      imageMobile: b.imageMobile,
      alt: b.title || "Promo Banner",
      href: b.link || "/",
    }));
  } catch (error) {
    console.error("Error fetching promo banners:", error);
    return [];
  }
}

// Fetch best sellers
async function getBestSellers(): Promise<ProductData[]> {
  try {
    await dbConnect();

    const products = await Product.find({
      isActive: true,
      isBestSeller: true,
    })
      .populate("brand", "name logo slug")
      .sort({ soldCount: -1 })
      .limit(10)
      .lean();

    // If not enough best sellers, also fetch by soldCount
    if (products.length < 10) {
      const additionalProducts = await Product.find({
        isActive: true,
        _id: { $nin: products.map((p) => p._id) },
      })
        .populate("brand", "name logo slug")
        .sort({ soldCount: -1 })
        .limit(10 - products.length)
        .lean();

      products.push(...additionalProducts);
    }

    return products.map((p) => {
      const brandObj = p.brand as { name?: string; logo?: string } | string | undefined;
      const brandName = typeof brandObj === "object" && brandObj?.name ? brandObj.name : (typeof brandObj === "string" ? brandObj : "Generic");
      return {
        id: p._id.toString(),
        name: p.name,
        slug: p.slug,
        image: p.images?.[0] || "https://picsum.photos/280/280",
        secondImage: p.images?.[1],
        priceB2C: p.priceB2C || p.mrp,
        priceB2B: p.priceB2B || p.priceB2C || p.mrp,
        mrp: p.mrp,
        inStock: p.stock > 0,
        brand: brandName,
        rating: 0,
        soldCount: p.soldCount || 0,
      };
    });
  } catch (error) {
    console.error("Error fetching best sellers:", error);
    return [];
  }
}

// Fetch most popular products (by views)
async function getMostPopular(): Promise<ProductData[]> {
  try {
    await dbConnect();

    const products = await Product.find({
      isActive: true,
    })
      .populate("brand", "name logo slug")
      .sort({ views: -1, isFeatured: -1 })
      .limit(10)
      .lean();

    return products.map((p) => {
      const brandObj = p.brand as { name?: string; logo?: string } | string | undefined;
      const brandName = typeof brandObj === "object" && brandObj?.name ? brandObj.name : (typeof brandObj === "string" ? brandObj : "Generic");
      return {
        id: p._id.toString(),
        name: p.name,
        slug: p.slug,
        image: p.images?.[0] || "https://picsum.photos/280/280",
        secondImage: p.images?.[1],
        priceB2C: p.priceB2C || p.mrp,
        priceB2B: p.priceB2B || p.priceB2C || p.mrp,
        mrp: p.mrp,
        inStock: p.stock > 0,
        brand: brandName,
        rating: 0,
        views: p.views || 0,
      };
    });
  } catch (error) {
    console.error("Error fetching most popular products:", error);
    return [];
  }
}

// Fetch hot brands (brands with most products or manually selected)
async function getHotBrands(): Promise<BrandData[]> {
  try {
    await dbConnect();

    const brands = await Brand.find({ isActive: true })
      .sort({ productCount: -1, sortOrder: 1 })
      .limit(12)
      .lean();

    return brands.map((brand) => ({
      id: brand._id.toString(),
      name: brand.name,
      logo: brand.logo || `https://picsum.photos/seed/${brand.slug}/120/60`,
      slug: brand.slug,
      productCount: brand.productCount || 0,
    }));
  } catch (error) {
    console.error("Error fetching hot brands:", error);
    return [];
  }
}

// Fetch categories from database (single aggregation, no N+1)
async function getCategories(): Promise<CategoryData[]> {
  try {
    await dbConnect();

    const categories = await Category.aggregate([
      { $match: { isActive: true, parent: null } },
      { $sort: { sortOrder: 1 } },
      { $limit: 12 },
      {
        $lookup: {
          from: "products",
          let: { catId: "$_id" },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ["$category", "$$catId"] }, { $eq: ["$isActive", true] }] } } },
            { $count: "n" },
          ],
          as: "productStats",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          image: 1,
          slug: 1,
          productCount: { $ifNull: [{ $arrayElemAt: ["$productStats.n", 0] }, 0] },
        },
      },
    ]);

    return categories.map((cat) => ({
      id: cat._id.toString(),
      name: cat.name,
      image: cat.image || "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=200&h=200&fit=crop",
      slug: cat.slug,
      productCount: cat.productCount,
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// Fetch brands from database
async function getBrands(): Promise<BrandData[]> {
  try {
    await dbConnect();

    const brands = await Brand.find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 })
      .limit(20)
      .lean();

    return brands.map((brand) => ({
      id: brand._id.toString(),
      name: brand.name,
      logo: brand.logo || `https://picsum.photos/seed/${brand.slug}/120/60`,
      slug: brand.slug,
    }));
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
}

// Fetch homepage sections with products from database
async function getHomepageSections(): Promise<SectionData[]> {
  try {
    await dbConnect();

    // Try to get homepage settings from database
    const homepageSettings = await Settings.findOne({ key: "homepage_sections" });

    if (homepageSettings?.value && Array.isArray(homepageSettings.value) && homepageSettings.value.length > 0) {
      const sections = homepageSettings.value as HomepageSection[];
      const enabledSections = sections
        .filter((s) => s.enabled)
        .sort((a, b) => a.sortOrder - b.sortOrder);

      const sectionData: SectionData[] = [];

      for (const section of enabledSections) {
        let products;

        if (section.productIds && section.productIds.length > 0) {
          // Fetch specific products
          products = await Product.find({
            _id: { $in: section.productIds },
            isActive: true,
          })
            .populate("brand", "name logo slug")
            .limit(10)
            .lean();
        } else if (section.categoryId) {
          // Fetch products by category
          products = await Product.find({
            category: section.categoryId,
            isActive: true,
          })
            .populate("brand", "name logo slug")
            .sort({ isFeatured: -1, soldCount: -1 })
            .limit(10)
            .lean();
        } else {
          continue;
        }

        if (products.length === 0) continue;

        // Convert subcategories to SubcategoryTab format
        const subcategoryTabs: SubcategoryTab[] = (section.subcategories || []).map((name, idx) => ({
          name,
          href: idx === 0 ? undefined : `/category/${section.slug}/${name.toLowerCase().replace(/\s+/g, "-")}`,
          isActive: idx === 0,
        }));

        // If no subcategories defined, add default "All" tab
        if (subcategoryTabs.length === 0) {
          subcategoryTabs.push({ name: `All ${section.title}`, isActive: true });
        }

        sectionData.push({
          title: section.title,
          slug: section.slug,
          subcategories: subcategoryTabs,
          products: products.map((p) => {
            const brandObj = p.brand as { name?: string; logo?: string } | string | undefined;
            const brandName = typeof brandObj === "object" && brandObj?.name ? brandObj.name : (typeof brandObj === "string" ? brandObj : "Generic");
            const brandLogo = typeof brandObj === "object" && brandObj?.logo ? brandObj.logo : undefined;
            return {
              id: p._id.toString(),
              name: p.name,
              slug: p.slug,
              image: p.images?.[0] || "https://picsum.photos/280/280",
              secondImage: p.images?.[1],
              priceB2C: p.priceB2C || p.mrp,
              priceB2B: p.priceB2B || p.priceB2C || p.mrp,
              mrp: p.mrp,
              inStock: p.stock > 0,
              brand: brandName,
              brandLogo: brandLogo,
              productId: `P${p._id.toString().slice(-4).toUpperCase()}`,
              itemCode: p.sku || p._id.toString().slice(-6).toUpperCase(),
              rating: 0,
              description: p.shortDescription || p.description?.slice(0, 100),
            };
          }),
        });
      }

      if (sectionData.length > 0) {
        return sectionData;
      }
    }

    // If no settings or empty, fetch default sections based on categories with products
    const categoriesWithProducts = await Category.aggregate([
      { $match: { isActive: true, parent: null } },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "category",
          as: "products",
          pipeline: [
            { $match: { isActive: true } },
            { $limit: 10 },
          ],
        },
      },
      { $match: { "products.0": { $exists: true } } },
      { $sort: { sortOrder: 1 } },
      { $limit: 4 },
    ]);

    const sectionData: SectionData[] = [];

    for (const cat of categoriesWithProducts) {
      // Get full product details with brand
      const products = await Product.find({
        category: cat._id,
        isActive: true,
      })
        .populate("brand", "name logo slug")
        .sort({ isFeatured: -1, soldCount: -1 })
        .limit(10)
        .lean();

      // Get subcategories
      const subcategories = await Category.find({
        parent: cat._id,
        isActive: true,
      })
        .sort({ sortOrder: 1 })
        .limit(8)
        .lean();

      const subcategoryTabs: SubcategoryTab[] = [
        { name: `All ${cat.name}`, isActive: true },
        ...subcategories.map((sub) => ({
          name: sub.name,
          href: `/category/${cat.slug}/${sub.slug}`,
        })),
      ];

      sectionData.push({
        title: cat.name,
        slug: cat.slug,
        subcategories: subcategoryTabs,
        products: products.map((p) => {
          const brandObj = p.brand as { name?: string; logo?: string } | string | undefined;
          const brandName = typeof brandObj === "object" && brandObj?.name ? brandObj.name : (typeof brandObj === "string" ? brandObj : "Generic");
          const brandLogo = typeof brandObj === "object" && brandObj?.logo ? brandObj.logo : undefined;
          return {
            id: p._id.toString(),
            name: p.name,
            slug: p.slug,
            image: p.images?.[0] || "https://picsum.photos/280/280",
            secondImage: p.images?.[1],
            priceB2C: p.priceB2C || p.mrp,
            priceB2B: p.priceB2B || p.priceB2C || p.mrp,
            mrp: p.mrp,
            inStock: p.stock > 0,
            brand: brandName,
            brandLogo: brandLogo,
            productId: `P${p._id.toString().slice(-4).toUpperCase()}`,
            itemCode: p.sku || p._id.toString().slice(-6).toUpperCase(),
            rating: 0,
            description: p.shortDescription || p.description?.slice(0, 100),
          };
        }),
      });
    }

    return sectionData;
  } catch (error) {
    console.error("Error fetching homepage sections:", error);
    return [];
  }
}

export default async function HomePage() {
  // Fetch all data in parallel
  const [
    productSections,
    categories,
    brands,
    heroSliderBanners,
    adBanners,
    promoBanners,
    bestSellers,
    mostPopular,
    hotBrands,
  ] = await Promise.all([
    getHomepageSections(),
    getCategories(),
    getBrands(),
    getHeroSliderBanners(),
    getAdBanners(),
    getPromoBanners(),
    getBestSellers(),
    getMostPopular(),
    getHotBrands(),
  ]);

  // Schema markup for homepage
  const schemas = [
    generateOrganizationSchema(),
    generateWebSiteSchema(),
    generateLocalBusinessSchema(),
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Schema markup */}
        <JsonLd data={schemas} />

        {/* Hero Slider - 1500x450 banners */}
        <HeroBanner banners={heroSliderBanners.length > 0 ? heroSliderBanners : undefined} />

        {/* Features Strip */}
        <FeaturesSection />

        {/* Top Categories */}
        <TopCategories categories={categories} />

        {/* Best Sellers Section */}
        {bestSellers.length > 0 && (
          <BestSellersSection products={bestSellers} />
        )}

        {/* Static Ad Banners Grid - 3 promotional banners */}
        <AdBannerSlider 
          banners={[
            {
              id: "cables-banner",
              image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Cables%20Banner%20%281%29.jpg-3QEaRBpxlFsQB5qXtVdQ7IvUlIX8YJ.jpeg",
              imageMobile: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cable%20%20banner%20350x150_.jpg-iOIFSa6BhKJCLhyvZjP1b09gpv9NIq.jpeg",
              alt: "High-quality data and power cables engineered for durability and lightning-fast transmission",
              href: "/category/cables",
            },
            {
              id: "desktop-banner",
              image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Desktop%20Banners.jpg-NxXCuf56a4qUEYkHIIWBsFRhr6iXXh.jpeg",
              imageMobile: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/desktop%20banner%20350x150_.jpg-p3wezM9unLyQWyas2JFdkJRGHOt81V.jpeg",
              alt: "Powerful Workstations and sleek all-in-ones designed to anchor your home or office productivity",
              href: "/category/desktop",
            },
            {
              id: "display-banner",
              image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Display%20Banner%20%281%29.jpg-gu1oIcOl6i73BkGckGoNbiuO40Ppe2.jpeg",
              imageMobile: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/display%20%20banner%20350x150_.jpg-mAB5Q7kUlBiFtk7Ps8vGs7f2T9Rmkc.jpeg",
              alt: "Crystal-clear monitors and immersive screens that bring every pixel to life with stunning detail",
              href: "/category/display",
            },
          ]} 
          showAsGrid={true}
        />

        {/* Dynamic Ad Banner Slider - 1500x300 banners from database */}
        {adBanners.length > 0 && (
          <AdBannerSlider banners={adBanners} />
        )}

        {/* First 2 Product Sections */}
        {productSections.slice(0, 2).map((section) => (
          <ProductSection key={section.slug} section={section} />
        ))}

        {/* Hot Brands Section */}
        {hotBrands.length > 0 && (
          <HotBrandsSection brands={hotBrands} />
        )}

        {/* Most Popular Section */}
        {mostPopular.length > 0 && (
          <MostPopularSection products={mostPopular} />
        )}

        {/* Secondary Ad Banners - 4 promotional banners */}
        <AdBannerSlider 
          banners={[
            {
              id: "laptop-banner",
              image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/laptop%20Banner.jpg-aZ74t8huDopt1RRCwikZSJznyGUZMl.jpeg",
              alt: "High-performance portability tailored for creators, students, and professionals on the move",
              href: "/category/laptops",
            },
            {
              id: "storage-banner",
              image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Storage%20%20Banner.jpg-Br2pDtXHqxUP0A7rMmWIwC6BKzMrRy.jpeg",
              alt: "Secure your digital life with high-speed SSDs, massive hard drives, and reliable cloud-ready solutions",
              href: "/category/storage",
            },
            {
              id: "networking-banner",
              image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Networking%20Banner.jpg-8TJO7lyqPmcGBoBLNeboJBiU5xTj4p.jpeg",
              alt: "Blazing fast internet starts here - Stay connected, stay ahead",
              href: "/category/networking",
            },
            {
              id: "mobility-banner",
              image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mobility%20Banner.jpg-fIVom9upVU5bdAYHsa9o5xGUeVS5U1.jpeg",
              alt: "Never run out of power - Smart, fast and portable charging solutions",
              href: "/category/mobility",
            },
          ]} 
        />

        {/* Remaining Product Sections */}
        {productSections.slice(2).map((section) => (
          <ProductSection key={section.slug} section={section} />
        ))}

        {/* Brands Carousel */}
        <BrandsSection brands={brands} />

        {/* Show message if no products */}
        {productSections.length === 0 && bestSellers.length === 0 && mostPopular.length === 0 && (
          <div className="mx-auto max-w-7xl px-4 py-20 text-center">
            <h2 className="heading-lg mb-4">No Products Available</h2>
            <p className="body-md text-muted-foreground">
              Products will appear here once they are added to the database.
              Configure homepage sections in the admin panel.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
