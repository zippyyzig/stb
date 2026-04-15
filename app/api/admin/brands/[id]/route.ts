import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Brand from "@/models/Brand";
import Product from "@/models/Product";

// GET single brand
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

    const brand = await Brand.findById(id).lean();

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    // Get product count for this brand
    const productsCount = await Product.countDocuments({ brand: brand.name });

    return NextResponse.json({ brand: { ...brand, productsCount } });
  } catch (error) {
    console.error("Error fetching brand:", error);
    return NextResponse.json(
      { error: "Failed to fetch brand" },
      { status: 500 }
    );
  }
}

// PUT update brand
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

    // Get the old brand name for updating products
    const oldBrand = await Brand.findById(id);
    if (!oldBrand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    // Generate slug from name if name changed
    if (data.name) {
      const slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // Check if slug exists for a different brand
      const existingBrand = await Brand.findOne({ slug, _id: { $ne: id } });
      if (existingBrand) {
        return NextResponse.json(
          { error: "A brand with this name already exists" },
          { status: 400 }
        );
      }

      data.slug = slug;

      // Update brand name in all products if name changed
      if (data.name !== oldBrand.name) {
        await Product.updateMany(
          { brand: oldBrand.name },
          { $set: { brand: data.name } }
        );
      }
    }

    const brand = await Brand.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );

    return NextResponse.json({
      message: "Brand updated successfully",
      brand,
    });
  } catch (error) {
    console.error("Error updating brand:", error);
    return NextResponse.json(
      { error: "Failed to update brand" },
      { status: 500 }
    );
  }
}

// DELETE brand (super_admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "super_admin") {
      return NextResponse.json(
        { error: "Only super admins can delete brands" },
        { status: 403 }
      );
    }

    const { id } = await params;
    await dbConnect();

    const brand = await Brand.findById(id);
    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    // Check if brand has products
    const productsCount = await Product.countDocuments({ brand: brand.name });
    if (productsCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete brand with ${productsCount} products. Update products first.` },
        { status: 400 }
      );
    }

    await Brand.findByIdAndDelete(id);

    return NextResponse.json({
      message: "Brand deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting brand:", error);
    return NextResponse.json(
      { error: "Failed to delete brand" },
      { status: 500 }
    );
  }
}
