export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  brand: string;
  category: string;
}

export interface ProductSection {
  title: string;
  subcategories: string[];
  products: Product[];
}

const generateProducts = (
  category: string,
  names: string[],
  brands: string[],
  priceRange: [number, number]
): Product[] => {
  return names.map((name, i) => ({
    id: `${category}-${i + 1}`,
    name,
    image: `https://picsum.photos/seed/${category}${i}/280/280`,
    price: Math.floor(Math.random() * (priceRange[1] - priceRange[0]) + priceRange[0]),
    originalPrice:
      Math.random() > 0.5
        ? Math.floor(Math.random() * (priceRange[1] * 1.3 - priceRange[1]) + priceRange[1])
        : undefined,
    inStock: Math.random() > 0.15,
    brand: brands[i % brands.length],
    category,
  }));
};

export const productSections: ProductSection[] = [
  {
    title: "Networking",
    subcategories: ["Desktop Switch", "Fiber", "Fiber Switch", "POE Switch", "Router", "Tools"],
    products: generateProducts(
      "networking",
      [
        "TP-Link Gigabit Router",
        "D-Link 8-Port Switch",
        "Netgear Mesh WiFi",
        "Cisco Access Point",
        "Ubiquiti UniFi AP",
        "MikroTik RouterBoard",
        "Tenda AC1200 Router",
        "TP-Link POE Switch",
      ],
      ["TP-Link", "D-Link", "Netgear", "Cisco", "Ubiquiti", "MikroTik", "Tenda", "TP-Link"],
      [500, 15000]
    ),
  },
  {
    title: "Security",
    subcategories: ["IP Camera", "Dome Camera", "DVR", "NVR", "Accessories"],
    products: generateProducts(
      "security",
      [
        "Hikvision 4ch DVR",
        "CP-Plus 2MP Dome",
        "Dahua IP Camera",
        "Hikvision Bullet Cam",
        "CP-Plus 8ch NVR",
        "Godrej CCTV Kit",
        "Hikvision 5MP Turret",
        "CP-Plus Fisheye Cam",
      ],
      ["Hikvision", "CP-Plus", "Dahua", "Hikvision", "CP-Plus", "Godrej", "Hikvision", "CP-Plus"],
      [1000, 25000]
    ),
  },
  {
    title: "Software",
    subcategories: ["Antivirus", "Office Suite", "Operating System", "Utility"],
    products: generateProducts(
      "software",
      [
        "Quick Heal Pro LR1",
        "Kaspersky Internet Sec",
        "Norton 360 Deluxe",
        "McAfee Total Protection",
        "Windows 11 Pro OEM",
        "MS Office 2024 Home",
        "Adobe Creative Cloud",
        "Bitdefender Total Sec",
      ],
      [
        "Quick Heal",
        "Kaspersky",
        "Norton",
        "McAfee",
        "Microsoft",
        "Microsoft",
        "Adobe",
        "Bitdefender",
      ],
      [300, 8000]
    ),
  },
  {
    title: "Cables & Connectors",
    subcategories: ["HDMI Cables", "USB Cables", "LAN Cables", "Power Cables", "VGA Cables"],
    products: generateProducts(
      "cables",
      [
        "HDMI 2.1 Cable 2m",
        "USB-C to USB-A Cable",
        "Cat6 LAN Cable 5m",
        "Type-C Hub Adapter",
        "VGA Cable 3m",
        "Power Extension 4m",
        "DisplayPort Cable",
        "USB 3.0 Extension",
      ],
      ["Belkin", "Anker", "D-Link", "Ugreen", "Amazon Basics", "Branded", "Ugreen", "Anker"],
      [50, 2500]
    ),
  },
  {
    title: "Peripherals",
    subcategories: ["Keyboard", "Mouse", "Webcam", "Headset", "Gamepad"],
    products: generateProducts(
      "peripherals",
      [
        "Logitech MX Keys",
        "Razer DeathAdder V3",
        "HyperX Cloud III",
        "Logitech C920 HD Pro",
        "Corsair K70 RGB",
        "SteelSeries Rival 600",
        "JBL Quantum 400",
        "Logitech Brio 4K",
      ],
      [
        "Logitech",
        "Razer",
        "HyperX",
        "Logitech",
        "Corsair",
        "SteelSeries",
        "JBL",
        "Logitech",
      ],
      [800, 12000]
    ),
  },
];
