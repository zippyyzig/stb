import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroBanner from "@/components/sections/HeroBanner";
import TopCategories from "@/components/sections/TopCategories";
import ProductSection from "@/components/sections/ProductSection";
import BrandsSection from "@/components/sections/BrandsSection";
import PromoBanner from "@/components/sections/PromoBanner";
import dbConnect from "@/lib/mongodb";
import Settings from "@/models/Settings";
import Product from "@/models/Product";

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
  image: string;
  secondImage?: string;
  price: number;
  originalPrice?: number;
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

        // Convert subcategories to SubcategoryTab format
        const subcategoryTabs: SubcategoryTab[] = (section.subcategories || []).map((name, idx) => ({
          name,
          href: idx === 0 ? undefined : `/category/${section.slug}/${name.toLowerCase().replace(/\s+/g, "-")}`,
          isActive: idx === 0,
        }));

        sectionData.push({
          title: section.title,
          slug: section.slug,
          subcategories: subcategoryTabs,
          products: products.map((p) => ({
            id: p._id.toString(),
            name: p.name,
            image: p.images?.[0] || "https://picsum.photos/280/280",
            secondImage: p.images?.[1],
            price: p.priceB2C,
            originalPrice: p.mrp > p.priceB2C ? p.mrp : undefined,
            inStock: p.stock > 0,
            brand: p.brand || "Generic",
            brandLogo: p.brandLogo,
            productId: p.productId || `P${p._id.toString().slice(-4).toUpperCase()}`,
            itemCode: p.itemCode || p._id.toString().slice(-6).toUpperCase(),
            rating: p.rating || 0,
            description: p.shortDescription || p.description?.slice(0, 100),
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

// Generate random item codes
function generateItemCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Default product sections data with megajaipur.com style
const defaultProductSections: SectionData[] = [
  {
    title: "Desktop",
    slug: "desktop",
    subcategories: [
      { name: "Desktop", isActive: true },
      { name: "Branded PC", href: "/category/branded-pc" },
      { name: "Processor", href: "/category/processor" },
      { name: "CPU Fan", href: "/category/cpu-fan" },
      { name: "Motherboard", href: "/category/motherboard" },
      { name: "RAM", href: "/category/ram" },
      { name: "Graphic Card", href: "/category/graphic-card" },
      { name: "Cabinet | Fan", href: "/category/cabinet" },
      { name: "SMPS", href: "/category/smps" },
      { name: "UPS", href: "/category/ups" },
      { name: "SSD | HDD", isActive: false },
    ],
    products: [
      {
        id: "desk-1",
        name: "Ant Esports CPU Cooler Liquid Glacius-360D ARGB",
        image: "https://picsum.photos/seed/desk1/280/280",
        secondImage: "https://picsum.photos/seed/desk1b/280/280",
        price: 7732,
        originalPrice: 8999,
        inStock: true,
        brand: "ANT E-SPORTS",
        productId: "A1936",
        itemCode: "JADWAQ",
        rating: 4,
        description: "Intel LGA1851/1700/115X/20XX compatible liquid cooler with ARGB lighting",
      },
      {
        id: "desk-2",
        name: "Logitech USB Gaming Mouse RGB Light Sync G102 White",
        image: "https://picsum.photos/seed/desk2/280/280",
        secondImage: "https://picsum.photos/seed/desk2b/280/280",
        price: 1051,
        originalPrice: 1299,
        inStock: true,
        brand: "LOGITECH",
        productId: "A2852",
        itemCode: "JUELNS",
        rating: 5,
        description: "6 Programmable Buttons, RGB LIGHTSYNC Gaming Mouse",
      },
      {
        id: "desk-3",
        name: "EVM Desktop Ram 8GB DDR4 2666Mhz",
        image: "https://picsum.photos/seed/desk3/280/280",
        secondImage: "https://picsum.photos/seed/desk3b/280/280",
        price: 4461,
        inStock: true,
        brand: "EVM",
        productId: "P5076",
        itemCode: "ECGWII",
        rating: 4,
        description: "8GB DDR4 2666Mhz Long Dimm Desktop Memory",
      },
      {
        id: "desk-4",
        name: "Intel Core i5-12400F 12th Gen Processor",
        image: "https://picsum.photos/seed/desk4/280/280",
        price: 12999,
        originalPrice: 14999,
        inStock: true,
        brand: "INTEL",
        productId: "P4521",
        itemCode: generateItemCode(),
        rating: 5,
        description: "6 Cores, 12 Threads, Up to 4.4GHz, LGA 1700 Socket",
      },
      {
        id: "desk-5",
        name: "ASUS Prime B660M-K D4 Motherboard",
        image: "https://picsum.photos/seed/desk5/280/280",
        price: 8999,
        inStock: true,
        brand: "ASUS",
        productId: "P3892",
        itemCode: generateItemCode(),
        rating: 4,
        description: "Intel LGA 1700 mATX motherboard with PCIe 4.0",
      },
      {
        id: "desk-6",
        name: "Corsair Vengeance LPX 16GB DDR4 3200MHz",
        image: "https://picsum.photos/seed/desk6/280/280",
        price: 4599,
        originalPrice: 5299,
        inStock: true,
        brand: "CORSAIR",
        productId: "P2145",
        itemCode: generateItemCode(),
        rating: 5,
        description: "16GB (2x8GB) DDR4 DRAM 3200MHz C16 Memory Kit",
      },
    ],
  },
  {
    title: "Networking",
    slug: "networking",
    subcategories: [
      { name: "All Networking", isActive: true },
      { name: "Desktop Switch", href: "/category/desktop-switch" },
      { name: "Fiber", href: "/category/fiber" },
      { name: "POE Switch", href: "/category/poe-switch" },
      { name: "Router", href: "/category/router" },
      { name: "WiFi Adapter", href: "/category/wifi-adapter" },
      { name: "Tools", href: "/category/networking-tools" },
    ],
    products: [
      {
        id: "net-1",
        name: "TP-Link Gigabit Router Archer AX1500 WiFi 6",
        image: "https://picsum.photos/seed/net1/280/280",
        price: 2499,
        originalPrice: 2999,
        inStock: true,
        brand: "TP-LINK",
        productId: "N1234",
        itemCode: generateItemCode(),
        rating: 4,
        description: "Dual Band WiFi 6 Router with 1.5Gbps Speed",
      },
      {
        id: "net-2",
        name: "D-Link 8-Port Gigabit Desktop Switch DGS-1008A",
        image: "https://picsum.photos/seed/net2/280/280",
        price: 1899,
        inStock: true,
        brand: "D-LINK",
        productId: "N2345",
        itemCode: generateItemCode(),
        rating: 5,
        description: "8 x 10/100/1000 Mbps Gigabit Ethernet Ports",
      },
      {
        id: "net-3",
        name: "Netgear Orbi Mesh WiFi 6 System RBK752",
        image: "https://picsum.photos/seed/net3/280/280",
        price: 18999,
        originalPrice: 22999,
        inStock: true,
        brand: "NETGEAR",
        productId: "N3456",
        itemCode: generateItemCode(),
        rating: 5,
        description: "Whole Home Mesh WiFi 6 System, 5,000 sq. ft. coverage",
      },
      {
        id: "net-4",
        name: "Cisco Business CBS110-24T Switch 24 Port",
        image: "https://picsum.photos/seed/net4/280/280",
        price: 12499,
        inStock: false,
        brand: "CISCO",
        productId: "N4567",
        itemCode: generateItemCode(),
        rating: 4,
        description: "24 Port Gigabit Unmanaged Network Switch",
      },
      {
        id: "net-5",
        name: "Ubiquiti UniFi AP AC Pro Access Point",
        image: "https://picsum.photos/seed/net5/280/280",
        price: 9999,
        inStock: true,
        brand: "UBIQUITI",
        productId: "N5678",
        itemCode: generateItemCode(),
        rating: 5,
        description: "802.11ac Dual-Band Access Point, PoE Supported",
      },
    ],
  },
  {
    title: "Security & CCTV",
    slug: "security",
    subcategories: [
      { name: "All Security", isActive: true },
      { name: "IP Camera", href: "/category/ip-camera" },
      { name: "Dome Camera", href: "/category/dome-camera" },
      { name: "Bullet Camera", href: "/category/bullet-camera" },
      { name: "DVR", href: "/category/dvr" },
      { name: "NVR", href: "/category/nvr" },
      { name: "Accessories", href: "/category/cctv-accessories" },
    ],
    products: [
      {
        id: "sec-1",
        name: "Hikvision 4CH DVR 5MP Turbo HD DS-7204HUHI-K1",
        image: "https://picsum.photos/seed/sec1/280/280",
        price: 4999,
        originalPrice: 5999,
        inStock: true,
        brand: "HIKVISION",
        productId: "S1234",
        itemCode: generateItemCode(),
        rating: 5,
        description: "4 Channel 5MP H.265 Turbo HD DVR with Audio",
      },
      {
        id: "sec-2",
        name: "CP-Plus 2MP Full HD Dome Camera CP-USC-DA24L2",
        image: "https://picsum.photos/seed/sec2/280/280",
        price: 1299,
        inStock: true,
        brand: "CP-PLUS",
        productId: "S2345",
        itemCode: generateItemCode(),
        rating: 4,
        description: "2MP Full HD IR Dome Camera with 20m Night Vision",
      },
      {
        id: "sec-3",
        name: "Dahua 4MP IP Bullet Camera IPC-HFW1439S1-LED",
        image: "https://picsum.photos/seed/sec3/280/280",
        price: 3499,
        inStock: true,
        brand: "DAHUA",
        productId: "S3456",
        itemCode: generateItemCode(),
        rating: 4,
        description: "4MP Full-Color Fixed-focal Bullet Network Camera",
      },
      {
        id: "sec-4",
        name: "Hikvision 8CH PoE NVR DS-7608NI-K2/8P",
        image: "https://picsum.photos/seed/sec4/280/280",
        price: 12999,
        inStock: true,
        brand: "HIKVISION",
        productId: "S4567",
        itemCode: generateItemCode(),
        rating: 5,
        description: "8 Channel PoE NVR with 8MP Recording Support",
      },
      {
        id: "sec-5",
        name: "CP-Plus 5MP Turret Camera CP-VNC-D55R3-D",
        image: "https://picsum.photos/seed/sec5/280/280",
        price: 2199,
        originalPrice: 2599,
        inStock: false,
        brand: "CP-PLUS",
        productId: "S5678",
        itemCode: generateItemCode(),
        rating: 3,
        description: "5MP IR Turret Camera with 30m Night Vision",
      },
    ],
  },
  {
    title: "Peripherals",
    slug: "peripherals",
    subcategories: [
      { name: "All Peripherals", isActive: true },
      { name: "Keyboard", href: "/category/keyboard" },
      { name: "Mouse", href: "/category/mouse" },
      { name: "Combo", href: "/category/keyboard-mouse-combo" },
      { name: "Webcam", href: "/category/webcam" },
      { name: "Headset", href: "/category/headset" },
      { name: "Gamepad", href: "/category/gamepad" },
      { name: "Gaming Chair", href: "/category/gaming-chair" },
    ],
    products: [
      {
        id: "peri-1",
        name: "Logitech MX Keys Advanced Wireless Keyboard",
        image: "https://picsum.photos/seed/peri1/280/280",
        price: 8999,
        originalPrice: 10999,
        inStock: true,
        brand: "LOGITECH",
        productId: "P1234",
        itemCode: generateItemCode(),
        rating: 5,
        description: "Wireless Illuminated Keyboard with Smart Backlighting",
      },
      {
        id: "peri-2",
        name: "Razer DeathAdder V3 Pro Gaming Mouse",
        image: "https://picsum.photos/seed/peri2/280/280",
        price: 12999,
        inStock: true,
        brand: "RAZER",
        productId: "P2345",
        itemCode: generateItemCode(),
        rating: 5,
        description: "Wireless Ergonomic Gaming Mouse with 30K DPI Sensor",
      },
      {
        id: "peri-3",
        name: "HyperX Cloud III Wireless Gaming Headset",
        image: "https://picsum.photos/seed/peri3/280/280",
        price: 11999,
        originalPrice: 13999,
        inStock: true,
        brand: "HYPERX",
        productId: "P3456",
        itemCode: generateItemCode(),
        rating: 4,
        description: "Wireless Gaming Headset with DTS Headphone:X",
      },
      {
        id: "peri-4",
        name: "Logitech C920 HD Pro Full HD Webcam",
        image: "https://picsum.photos/seed/peri4/280/280",
        price: 6999,
        inStock: false,
        brand: "LOGITECH",
        productId: "P4567",
        itemCode: generateItemCode(),
        rating: 4,
        description: "1080p Full HD Video Calling and Recording",
      },
      {
        id: "peri-5",
        name: "Corsair K70 RGB Pro Mechanical Keyboard",
        image: "https://picsum.photos/seed/peri5/280/280",
        price: 14999,
        originalPrice: 17999,
        inStock: true,
        brand: "CORSAIR",
        productId: "P5678",
        itemCode: generateItemCode(),
        rating: 5,
        description: "Cherry MX RGB Mechanical Gaming Keyboard",
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
