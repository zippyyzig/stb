import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import Brand from "@/models/Brand";

const defaultCategories = [
  {
    name: "Electronics",
    slug: "electronics",
    description: "Electronic devices and gadgets",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800",
    isActive: true,
    subcategories: [
      { name: "Smartphones", slug: "smartphones" },
      { name: "Laptops", slug: "laptops" },
      { name: "Tablets", slug: "tablets" },
      { name: "Accessories", slug: "electronics-accessories" },
    ],
  },
  {
    name: "Fashion",
    slug: "fashion",
    description: "Clothing and fashion accessories",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800",
    isActive: true,
    subcategories: [
      { name: "Men's Clothing", slug: "mens-clothing" },
      { name: "Women's Clothing", slug: "womens-clothing" },
      { name: "Kids' Clothing", slug: "kids-clothing" },
      { name: "Footwear", slug: "footwear" },
    ],
  },
  {
    name: "Home & Living",
    slug: "home-living",
    description: "Home decor and furniture",
    image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800",
    isActive: true,
    subcategories: [
      { name: "Furniture", slug: "furniture" },
      { name: "Decor", slug: "decor" },
      { name: "Kitchen", slug: "kitchen" },
      { name: "Bedding", slug: "bedding" },
    ],
  },
  {
    name: "Beauty & Health",
    slug: "beauty-health",
    description: "Beauty products and health essentials",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800",
    isActive: true,
    subcategories: [
      { name: "Skincare", slug: "skincare" },
      { name: "Makeup", slug: "makeup" },
      { name: "Hair Care", slug: "hair-care" },
      { name: "Personal Care", slug: "personal-care" },
    ],
  },
  {
    name: "Sports & Outdoors",
    slug: "sports-outdoors",
    description: "Sports equipment and outdoor gear",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800",
    isActive: true,
    subcategories: [
      { name: "Fitness", slug: "fitness" },
      { name: "Outdoor", slug: "outdoor" },
      { name: "Team Sports", slug: "team-sports" },
      { name: "Cycling", slug: "cycling" },
    ],
  },
  {
    name: "Books & Stationery",
    slug: "books-stationery",
    description: "Books, office supplies, and stationery",
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800",
    isActive: true,
    subcategories: [
      { name: "Fiction", slug: "fiction" },
      { name: "Non-Fiction", slug: "non-fiction" },
      { name: "Office Supplies", slug: "office-supplies" },
      { name: "Art Supplies", slug: "art-supplies" },
    ],
  },
];

const defaultBrands = [
  {
    name: "Apple",
    slug: "apple",
    description: "Think different",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    website: "https://apple.com",
    isActive: true,
    isFeatured: true,
  },
  {
    name: "Samsung",
    slug: "samsung",
    description: "Inspire the World, Create the Future",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
    website: "https://samsung.com",
    isActive: true,
    isFeatured: true,
  },
  {
    name: "Nike",
    slug: "nike",
    description: "Just Do It",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
    website: "https://nike.com",
    isActive: true,
    isFeatured: true,
  },
  {
    name: "Adidas",
    slug: "adidas",
    description: "Impossible is Nothing",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg",
    website: "https://adidas.com",
    isActive: true,
    isFeatured: true,
  },
  {
    name: "Sony",
    slug: "sony",
    description: "Be Moved",
    website: "https://sony.com",
    isActive: true,
    isFeatured: false,
  },
  {
    name: "LG",
    slug: "lg",
    description: "Life's Good",
    website: "https://lg.com",
    isActive: true,
    isFeatured: false,
  },
  {
    name: "Puma",
    slug: "puma",
    description: "Forever Faster",
    website: "https://puma.com",
    isActive: true,
    isFeatured: false,
  },
  {
    name: "HP",
    slug: "hp",
    description: "Keep Reinventing",
    website: "https://hp.com",
    isActive: true,
    isFeatured: false,
  },
  {
    name: "Dell",
    slug: "dell",
    description: "Technology that moves you",
    website: "https://dell.com",
    isActive: true,
    isFeatured: false,
  },
  {
    name: "Lenovo",
    slug: "lenovo",
    description: "For Those Who Do",
    website: "https://lenovo.com",
    isActive: true,
    isFeatured: false,
  },
];

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only super_admin can seed data
    if (!session || session.user.role !== "super_admin") {
      return NextResponse.json(
        { error: "Only super admin can seed data" },
        { status: 403 }
      );
    }

    await dbConnect();

    const results = {
      categories: { created: 0, existing: 0 },
      brands: { created: 0, existing: 0 },
    };

    // Seed categories
    for (const categoryData of defaultCategories) {
      const existing = await Category.findOne({ slug: categoryData.slug });
      if (!existing) {
        await Category.create(categoryData);
        results.categories.created++;
      } else {
        results.categories.existing++;
      }
    }

    // Seed brands
    for (const brandData of defaultBrands) {
      const existing = await Brand.findOne({ slug: brandData.slug });
      if (!existing) {
        await Brand.create(brandData);
        results.brands.created++;
      } else {
        results.brands.existing++;
      }
    }

    return NextResponse.json({
      message: "Seed completed successfully",
      results,
    });
  } catch (error) {
    console.error("Error seeding data:", error);
    return NextResponse.json(
      { error: "Failed to seed data" },
      { status: 500 }
    );
  }
}
