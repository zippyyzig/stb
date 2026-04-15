import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroBanner from "@/components/sections/HeroBanner";
import TopCategories from "@/components/sections/TopCategories";
import ProductSection from "@/components/sections/ProductSection";
import { ArrowRight, Truck, Shield, Headphones, CreditCard } from "lucide-react";
import Link from "next/link";

// Sample product sections data - will be replaced with MongoDB data
const productSections = [
  {
    title: "Networking",
    slug: "networking",
    subcategories: ["Desktop Switch", "Fiber", "POE Switch", "Router", "Tools"],
    products: [
      {
        id: "net-1",
        name: "TP-Link Gigabit Router AC1200",
        image: "https://picsum.photos/seed/net1/400/400",
        price: 2499,
        originalPrice: 2999,
        inStock: true,
        brand: "TP-Link",
      },
      {
        id: "net-2",
        name: "D-Link 8-Port Gigabit Switch",
        image: "https://picsum.photos/seed/net2/400/400",
        price: 1899,
        inStock: true,
        brand: "D-Link",
      },
      {
        id: "net-3",
        name: "Netgear Mesh WiFi System",
        image: "https://picsum.photos/seed/net3/400/400",
        price: 8999,
        originalPrice: 10999,
        inStock: true,
        brand: "Netgear",
      },
      {
        id: "net-4",
        name: "Cisco Access Point WAP150",
        image: "https://picsum.photos/seed/net4/400/400",
        price: 12499,
        inStock: false,
        brand: "Cisco",
      },
      {
        id: "net-5",
        name: "Ubiquiti UniFi AP AC Pro",
        image: "https://picsum.photos/seed/net5/400/400",
        price: 9999,
        inStock: true,
        brand: "Ubiquiti",
      },
      {
        id: "net-6",
        name: "MikroTik RouterBoard hEX S",
        image: "https://picsum.photos/seed/net6/400/400",
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
        image: "https://picsum.photos/seed/sec1/400/400",
        price: 4999,
        originalPrice: 5999,
        inStock: true,
        brand: "Hikvision",
      },
      {
        id: "sec-2",
        name: "CP-Plus 2MP Dome Camera",
        image: "https://picsum.photos/seed/sec2/400/400",
        price: 1299,
        inStock: true,
        brand: "CP-Plus",
      },
      {
        id: "sec-3",
        name: "Dahua 4MP IP Bullet Camera",
        image: "https://picsum.photos/seed/sec3/400/400",
        price: 3499,
        inStock: true,
        brand: "Dahua",
      },
      {
        id: "sec-4",
        name: "Hikvision 8CH NVR PoE",
        image: "https://picsum.photos/seed/sec4/400/400",
        price: 12999,
        inStock: true,
        brand: "Hikvision",
      },
      {
        id: "sec-5",
        name: "CP-Plus 5MP Turret Camera",
        image: "https://picsum.photos/seed/sec5/400/400",
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
        image: "https://picsum.photos/seed/soft1/400/400",
        price: 999,
        originalPrice: 1299,
        inStock: true,
        brand: "Quick Heal",
      },
      {
        id: "soft-2",
        name: "Kaspersky Internet Security 3 Device",
        image: "https://picsum.photos/seed/soft2/400/400",
        price: 1499,
        inStock: true,
        brand: "Kaspersky",
      },
      {
        id: "soft-3",
        name: "Norton 360 Deluxe 5 Device",
        image: "https://picsum.photos/seed/soft3/400/400",
        price: 1999,
        inStock: true,
        brand: "Norton",
      },
      {
        id: "soft-4",
        name: "Windows 11 Pro OEM License",
        image: "https://picsum.photos/seed/soft4/400/400",
        price: 8999,
        inStock: true,
        brand: "Microsoft",
      },
      {
        id: "soft-5",
        name: "Microsoft Office 2024 Home & Business",
        image: "https://picsum.photos/seed/soft5/400/400",
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
        image: "https://picsum.photos/seed/peri1/400/400",
        price: 8999,
        originalPrice: 10999,
        inStock: true,
        brand: "Logitech",
      },
      {
        id: "peri-2",
        name: "Razer DeathAdder V3 Gaming Mouse",
        image: "https://picsum.photos/seed/peri2/400/400",
        price: 4999,
        inStock: true,
        brand: "Razer",
      },
      {
        id: "peri-3",
        name: "HyperX Cloud III Gaming Headset",
        image: "https://picsum.photos/seed/peri3/400/400",
        price: 7999,
        inStock: true,
        brand: "HyperX",
      },
      {
        id: "peri-4",
        name: "Logitech C920 HD Pro Webcam",
        image: "https://picsum.photos/seed/peri4/400/400",
        price: 6999,
        inStock: false,
        brand: "Logitech",
      },
      {
        id: "peri-5",
        name: "Corsair K70 RGB Mechanical Keyboard",
        image: "https://picsum.photos/seed/peri5/400/400",
        price: 11999,
        originalPrice: 13999,
        inStock: true,
        brand: "Corsair",
      },
    ],
  },
];

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over ₹5,000",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% secure transactions",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated support team",
  },
  {
    icon: CreditCard,
    title: "Easy Returns",
    description: "30-day return policy",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Banner */}
        <HeroBanner />

        {/* Features Bar */}
        <section className="border-y border-border bg-muted/50">
          <div className="mx-auto max-w-7xl px-4 py-6">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.title} className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-card">
                    <feature.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <h3 className="heading-sm text-sm">{feature.title}</h3>
                    <p className="body-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Top Categories */}
        <TopCategories />

        {/* Product Sections */}
        {productSections.map((section) => (
          <ProductSection key={section.slug} section={section} />
        ))}

        {/* CTA Section */}
        <section className="bg-foreground py-16 text-background">
          <div className="mx-auto max-w-7xl px-4 text-center">
            <h2 className="heading-xl text-background">
              Ready to upgrade your tech?
            </h2>
            <p className="body-lg mx-auto mt-4 max-w-xl text-background/70">
              Join thousands of businesses and individuals who trust Sabka Tech Bazar for their technology needs.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-background px-8 py-3 font-medium text-foreground transition-colors hover:bg-background/90"
              >
                Browse Products
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-background/30 px-8 py-3 font-medium text-background transition-colors hover:bg-background/10"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
