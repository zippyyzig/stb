import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

// Define schemas inline to avoid import issues in script
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, trim: true },
  image: { type: String },
  icon: { type: String },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

const BrandSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, trim: true },
  logo: { type: String },
  website: { type: String, trim: true },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
  productsCount: { type: Number, default: 0 },
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
const Brand = mongoose.models.Brand || mongoose.model("Brand", BrandSchema);

const defaultCategories = [
  {
    name: "Desktop",
    slug: "desktop",
    description: "Desktop computers, workstations, and all-in-one PCs",
    icon: "Monitor",
    sortOrder: 1,
  },
  {
    name: "Laptop",
    slug: "laptop",
    description: "Laptops, notebooks, and portable computing devices",
    icon: "Laptop",
    sortOrder: 2,
  },
  {
    name: "Networking",
    slug: "networking",
    description: "Routers, switches, access points, and networking equipment",
    icon: "Network",
    sortOrder: 3,
  },
  {
    name: "Security & CCTV",
    slug: "security-cctv",
    description: "CCTV cameras, DVR/NVR systems, and security equipment",
    icon: "Shield",
    sortOrder: 4,
  },
  {
    name: "Storage",
    slug: "storage",
    description: "Hard drives, SSDs, NAS, and storage solutions",
    icon: "HardDrive",
    sortOrder: 5,
  },
  {
    name: "Peripherals",
    slug: "peripherals",
    description: "Keyboards, mice, webcams, and other peripherals",
    icon: "Mouse",
    sortOrder: 6,
  },
  {
    name: "Components",
    slug: "components",
    description: "RAM, processors, graphics cards, and PC components",
    icon: "Cpu",
    sortOrder: 7,
  },
  {
    name: "Printers & Scanners",
    slug: "printers-scanners",
    description: "Printers, scanners, and multifunction devices",
    icon: "Printer",
    sortOrder: 8,
  },
  {
    name: "UPS & Power",
    slug: "ups-power",
    description: "UPS, surge protectors, and power solutions",
    icon: "Zap",
    sortOrder: 9,
  },
  {
    name: "Cables & Accessories",
    slug: "cables-accessories",
    description: "Cables, adapters, and miscellaneous accessories",
    icon: "Cable",
    sortOrder: 10,
  },
];

const defaultBrands = [
  {
    name: "HP",
    slug: "hp",
    description: "Hewlett-Packard - Leading computer and printer manufacturer",
    website: "https://www.hp.com",
    sortOrder: 1,
  },
  {
    name: "Dell",
    slug: "dell",
    description: "Dell Technologies - Enterprise solutions and consumer electronics",
    website: "https://www.dell.com",
    sortOrder: 2,
  },
  {
    name: "Lenovo",
    slug: "lenovo",
    description: "Lenovo - Global technology company known for ThinkPad laptops",
    website: "https://www.lenovo.com",
    sortOrder: 3,
  },
  {
    name: "ASUS",
    slug: "asus",
    description: "ASUS - Motherboards, laptops, and gaming hardware",
    website: "https://www.asus.com",
    sortOrder: 4,
  },
  {
    name: "Acer",
    slug: "acer",
    description: "Acer - Consumer electronics and IT solutions",
    website: "https://www.acer.com",
    sortOrder: 5,
  },
  {
    name: "TP-Link",
    slug: "tp-link",
    description: "TP-Link - Networking and smart home products",
    website: "https://www.tp-link.com",
    sortOrder: 6,
  },
  {
    name: "D-Link",
    slug: "d-link",
    description: "D-Link - Networking solutions for home and business",
    website: "https://www.dlink.com",
    sortOrder: 7,
  },
  {
    name: "Hikvision",
    slug: "hikvision",
    description: "Hikvision - World leading video surveillance products",
    website: "https://www.hikvision.com",
    sortOrder: 8,
  },
  {
    name: "Dahua",
    slug: "dahua",
    description: "Dahua Technology - Video-centric smart IoT solutions",
    website: "https://www.dahuasecurity.com",
    sortOrder: 9,
  },
  {
    name: "CP Plus",
    slug: "cp-plus",
    description: "CP Plus - Security and surveillance solutions",
    website: "https://www.cpplusworld.com",
    sortOrder: 10,
  },
  {
    name: "Logitech",
    slug: "logitech",
    description: "Logitech - Computer peripherals and accessories",
    website: "https://www.logitech.com",
    sortOrder: 11,
  },
  {
    name: "Samsung",
    slug: "samsung",
    description: "Samsung Electronics - Consumer electronics and semiconductors",
    website: "https://www.samsung.com",
    sortOrder: 12,
  },
  {
    name: "Seagate",
    slug: "seagate",
    description: "Seagate Technology - Data storage solutions",
    website: "https://www.seagate.com",
    sortOrder: 13,
  },
  {
    name: "Western Digital",
    slug: "western-digital",
    description: "Western Digital - Hard drives and data storage",
    website: "https://www.westerndigital.com",
    sortOrder: 14,
  },
  {
    name: "APC",
    slug: "apc",
    description: "APC by Schneider Electric - UPS and power management",
    website: "https://www.apc.com",
    sortOrder: 15,
  },
];

async function seedData() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Seed Categories
    console.log("\nSeeding categories...");
    for (const category of defaultCategories) {
      const existing = await Category.findOne({ slug: category.slug });
      if (!existing) {
        await Category.create(category);
        console.log(`  Created category: ${category.name}`);
      } else {
        console.log(`  Category already exists: ${category.name}`);
      }
    }

    // Seed Brands
    console.log("\nSeeding brands...");
    for (const brand of defaultBrands) {
      const existing = await Brand.findOne({ slug: brand.slug });
      if (!existing) {
        await Brand.create(brand);
        console.log(`  Created brand: ${brand.name}`);
      } else {
        console.log(`  Brand already exists: ${brand.name}`);
      }
    }

    console.log("\nSeeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

seedData();
