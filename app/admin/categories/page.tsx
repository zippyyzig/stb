import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";
import CategoriesClient from "./CategoriesClient";

async function getCategories() {
  try {
    await dbConnect();

    const categories = await Category.find()
      .populate("parent", "name slug")
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    // Get product counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (cat) => {
        const productsCount = await Product.countDocuments({ category: cat._id });
        return {
          ...cat,
          _id: cat._id.toString(),
          parent: cat.parent ? {
            ...cat.parent,
            _id: (cat.parent as { _id: { toString: () => string } })._id.toString(),
          } : null,
          productsCount,
        };
      })
    );

    return categoriesWithCounts;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function CategoriesPage() {
  const session = await getServerSession(authOptions);
  const categories = await getCategories();
  const isSuperAdmin = session?.user.role === "super_admin";

  return <CategoriesClient categories={categories} isSuperAdmin={isSuperAdmin} />;
}
