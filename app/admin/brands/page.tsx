import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Brand from "@/models/Brand";
import Product from "@/models/Product";
import BrandsClient from "./BrandsClient";

async function getBrands() {
  try {
    await dbConnect();

    const brands = await Brand.find()
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    // Get product counts for each brand
    const brandsWithCounts = await Promise.all(
      brands.map(async (brand) => {
        const productsCount = await Product.countDocuments({ brand: brand.name });
        return {
          ...brand,
          _id: brand._id.toString(),
          productsCount,
        };
      })
    );

    return brandsWithCounts;
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
}

export default async function BrandsPage() {
  const session = await getServerSession(authOptions);
  const brands = await getBrands();
  const isSuperAdmin = session?.user.role === "super_admin";

  return <BrandsClient brands={brands} isSuperAdmin={isSuperAdmin} />;
}
