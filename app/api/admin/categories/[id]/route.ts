import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";

// GET single category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    const category = await Category.findById(id).populate("parent", "name slug").lean();

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // Get product count for this category
    const productsCount = await Product.countDocuments({ category: id });

    return NextResponse.json({ category: { ...category, productsCount } });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

// PUT update category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    await dbConnect();

    // Generate slug from name if name changed
    if (data.name) {
      const slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // Check if slug exists for a different category
      const existingCategory = await Category.findOne({ slug, _id: { $ne: id } });
      if (existingCategory) {
        return NextResponse.json(
          { error: "A category with this name already exists" },
          { status: 400 }
        );
      }

      data.slug = slug;
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE category (super_admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "super_admin") {
      return NextResponse.json(
        { error: "Only super admins can delete categories" },
        { status: 403 }
      );
    }

    const { id } = await params;
    await dbConnect();

    // Check if category has products
    const productsCount = await Product.countDocuments({ category: id });
    if (productsCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete category with ${productsCount} products. Move or delete products first.` },
        { status: 400 }
      );
    }

    // Check if category has child categories
    const childCategories = await Category.countDocuments({ parent: id });
    if (childCategories > 0) {
      return NextResponse.json(
        { error: `Cannot delete category with ${childCategories} subcategories. Delete subcategories first.` },
        { status: 400 }
      );
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
