import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroBanner from "@/components/sections/HeroBanner";
import TopCategories from "@/components/sections/TopCategories";
import ProductSection from "@/components/sections/ProductSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import BrandsSection from "@/components/sections/BrandsSection";
import PromoBanner from "@/components/sections/PromoBanner";
import dbConnect from "@/lib/mongodb";
import Settings from "@/models/Settings";
import Product from "@/models/Product";
import Category from "@/models/Category";

interface HomepageSection {
  categoryId: string;
  title: string;
  slug: string;
  enabled: boolean;
  sortOrder: number;
  productIds?: string[];
  subcategories: string[];
}

interface ProductData {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  brand: string;
}

interface SectionData {
  title: string;
  slug: string;
  subcategories: string[];
  products: ProductData[];
}

async function getHomepageSections(): Promise<SectionData[]> {
  try {
    await dbConnect();

    // Try to get homepage settings from database
    const homepageSettings = await Settings.findOne({ key: "homepage_sections" });

    if (homepageSettings?.value) {
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
            .limit(10)
            .lean();
        } else {
          // Fetch products by category
          products = await Product.find({
            category: section.categoryId,
            isActive: true,
          })
            .sort({ isFeatured: -1, soldCount: -1 })
            .limit(10)
            .lean();
        }

        sectionData.push({
          title: section.title,
          slug: section.slug,
          subcategories: section.subcategories || [],
          products: products.map((p) => ({
            id: p._id.toString(),
            name: p.name,
            image: p.images?.[0] || "https://picsum.photos/280/280",
            price: p.priceB2C,
            originalPrice: p.mrp > p.priceB2C ? p.mrp : undefined,
            inStock: p.stock > 0,
            brand: p.brand || "Generic",
          })),
        });
      }

      return sectionData;
    }
  } catch (error) {
    console.error("Error fetching homepage sections:", error);
  }

  // Return default sections if no settings found
  return defaultProductSections;
}

// Default product sections data
const defaultProductSections: SectionData[] = [
  {
    title: "Networking",
    slug: "networking",
    subcategories: ["Desktop Switch", "Fiber", "POE Switch", "Router", "Tools"],
    products: [
      {
        id: "net-1",
        name: "TP-Link Gigabit Router AC1200",
        image: "https://picsum.photos/seed/net1/280/280",
        price: 2499,
        originalPrice: 2999,
        inStock: true,
        brand: "TP-Link",
      },
      {
        id: "net-2",
        name: "D-Link 8-Port Gigabit Switch",
        image: "https://picsum.photos/seed/net2/280/280",
        price: 1899,
        inStock: true,
        brand: "D-Link",
      },
      {
        id: "net-3",
        name: "Netgear Mesh WiFi System",
        image: "https://picsum.photos/seed/net3/280/280",
        price: 8999,
        originalPrice: 10999,
        inStock: true,
        brand: "Netgear",
      },
      {
        id: "net-4",
        name: "Cisco Access Point WAP150",
        image: "https://picsum.photos/seed/net4/280/280",
        price: 12499,
        inStock: false,
        brand: "Cisco",
      },
      {
        id: "net-5",
        name: "Ubiquiti UniFi AP AC Pro",
        image: "https://picsum.photos/seed/net5/280/280",
        price: 9999,
        inStock: true,
        brand: "Ubiquiti",
      },
      {
        id: "net-6",
        name: "MikroTik RouterBoard hEX S",
        image: "https://picsum.photos/seed/net6/280/280",
        price: 4599,
        inStock: true,
        brand: "MikroTik",
      },
    ],
  },
  {
    title: "Security",
    slug: "security",
    subcategories: ["IP Camera", "Dome Camera", "DVR", "NVR", "Accessories"],
    products: [
      {
        id: "sec-1",
        name: "Hikvision 4CH DVR 5MP Turbo HD",
        image: "https://picsum.photos/seed/sec1/280/280",
        price: 4999,
        originalPrice: 5999,
        inStock: true,
        brand: "Hikvision",
      },
      {
        id: "sec-2",
        name: "CP-Plus 2MP Dome Camera",
        image: "https://picsum.photos/seed/sec2/280/280",
        price: 1299,
        inStock: true,
        brand: "CP-Plus",
      },
      {
        id: "sec-3",
        name: "Dahua 4MP IP Bullet Camera",
        image: "https://picsum.photos/seed/sec3/280/280",
        price: 3499,
        inStock: true,
        brand: "Dahua",
      },
      {
        id: "sec-4",
        name: "Hikvision 8CH NVR PoE",
        image: "https://picsum.photos/seed/sec4/280/280",
        price: 12999,
        inStock: true,
        brand: "Hikvision",
      },
      {
        id: "sec-5",
        name: "CP-Plus 5MP Turret Camera",
        image: "https://picsum.photos/seed/sec5/280/280",
        price: 2199,
        originalPrice: 2599,
        inStock: false,
        brand: "CP-Plus",
      },
    ],
  },
  {
    title: "Software",
    slug: "software",
    subcategories: ["Antivirus", "Office Suite", "Operating System", "Utility"],
    products: [
      {
        id: "soft-1",
        name: "Quick Heal Total Security 1 User 1 Year",
        image: "https://picsum.photos/seed/soft1/280/280",
        price: 999,
        originalPrice: 1299,
        inStock: true,
        brand: "Quick Heal",
      },
      {
        id: "soft-2",
        name: "Kaspersky Internet Security 3 Device",
        image: "https://picsum.photos/seed/soft2/280/280",
        price: 1499,
        inStock: true,
        brand: "Kaspersky",
      },
      {
        id: "soft-3",
        name: "Norton 360 Deluxe 5 Device",
        image: "https://picsum.photos/seed/soft3/280/280",
        price: 1999,
        inStock: true,
        brand: "Norton",
      },
      {
        id: "soft-4",
        name: "Windows 11 Pro OEM License",
        image: "https://picsum.photos/seed/soft4/280/280",
        price: 8999,
        inStock: true,
        brand: "Microsoft",
      },
      {
        id: "soft-5",
        name: "Microsoft Office 2024 Home & Business",
        image: "https://picsum.photos/seed/soft5/280/280",
        price: 12999,
        inStock: true,
        brand: "Microsoft",
      },
    ],
  },
  {
    title: "Peripherals",
    slug: "peripherals",
    subcategories: ["Keyboard", "Mouse", "Webcam", "Headset", "Gamepad"],
    products: [
      {
        id: "peri-1",
        name: "Logitech MX Keys Advanced Keyboard",
        image: "https://picsum.photos/seed/peri1/280/280",
        price: 8999,
        originalPrice: 10999,
        inStock: true,
        brand: "Logitech",
      },
      {
        id: "peri-2",
        name: "Razer DeathAdder V3 Gaming Mouse",
        image: "https://picsum.photos/seed/peri2/280/280",
        price: 4999,
        inStock: true,
        brand: "Razer",
      },
      {
        id: "peri-3",
        name: "HyperX Cloud III Gaming Headset",
        image: "https://picsum.photos/seed/peri3/280/280",
        price: 7999,
        inStock: true,
        brand: "HyperX",
      },
      {
        id: "peri-4",
        name: "Logitech C920 HD Pro Webcam",
        image: "https://picsum.photos/seed/peri4/280/280",
        price: 6999,
        inStock: false,
        brand: "Logitech",
      },
      {
        id: "peri-5",
        name: "Corsair K70 RGB Mechanical Keyboard",
        image: "https://picsum.photos/seed/peri5/280/280",
        price: 11999,
        originalPrice: 13999,
        inStock: true,
        brand: "Corsair",
      },
    ],
  },
];

export default async function HomePage() {
  const productSections = await getHomepageSections();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Slider with Side Banners */}
        <HeroBanner />


        {/* Top Categories */}
        <TopCategories />

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
        <BrandsSection />
      </main>
      <Footer />
    </div>
  );
}
