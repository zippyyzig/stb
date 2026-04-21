import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroBanner from "@/components/sections/HeroBanner";
import TopCategories from "@/components/sections/TopCategories";
import ProductSection from "@/components/sections/ProductSection";
import BrandsSection from "@/components/sections/BrandsSection";
import PromoBanner from "@/components/sections/PromoBanner";
import FeaturesSection from "@/components/sections/FeaturesSection";
import dbConnect from "@/lib/mongodb";
import Settings from "@/models/Settings";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Brand from "@/models/Brand";

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
  const [productSections, categories, brands] = await Promise.all([
    getHomepageSections(),
    getCategories(),
    getBrands(),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Slider with Side Banners */}
        <HeroBanner />

        {/* Features Strip */}
        <FeaturesSection />

        {/* Top Categories */}
        <TopCategories categories={categories} />

        {/* First 2 Product Sections */}
        {productSections.slice(0, 2).map((section) => (
          <ProductSection key={section.slug} section={section} />
        ))}

        {/* Promo Banners */}
        <PromoBanner />

        {/* Remaining Product Sections */}
        {productSections.slice(2).map((section) => (
          <ProductSection key={section.slug} section={section} />
        ))}

        {/* Brands Carousel */}
        <BrandsSection brands={brands} />

        {/* Show message if no products */}
        {productSections.length === 0 && (
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
