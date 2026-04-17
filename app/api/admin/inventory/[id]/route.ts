import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import InventoryLog from "@/models/InventoryLog";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET inventory history for a product
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;
    const skip = (page - 1) * limit;

    const [product, logs, total] = await Promise.all([
      Product.findById(id).select("name sku stock images").lean(),
      InventoryLog.find({ product: id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      InventoryLog.countDocuments({ product: id }),
    ]);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      product: JSON.parse(JSON.stringify(product)),
      logs: JSON.parse(JSON.stringify(logs)),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching inventory history:", error);
    return NextResponse.json(
      { error: "Failed to fetch inventory history" },
      { status: 500 }
    );
  }
}

// PUT - Adjust stock for single product
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { quantity, type, reason, actionType = "adjustment" } = await request.json();

    if (quantity === undefined || quantity === null) {
      return NextResponse.json(
        { error: "Quantity is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const previousStock = product.stock;
    let newStock: number;

    if (type === "set") {
      newStock = quantity;
    } else if (type === "add") {
      newStock = previousStock + quantity;
    } else if (type === "subtract") {
      newStock = previousStock - quantity;
    } else {
      newStock = previousStock + quantity; // Default: add/subtract based on sign
    }

    if (newStock < 0) {
      return NextResponse.json(
        { error: "Stock cannot be negative" },
        { status: 400 }
      );
    }

    product.stock = newStock;
    await product.save();

    // Log the adjustment
    await InventoryLog.create({
      product: product._id,
      productName: product.name,
      productSku: product.sku,
      actionType,
      quantityChange: newStock - previousStock,
      previousStock,
      newStock,
      reason: reason || "Manual adjustment",
      performedBy: session.user.id,
      performedByName: session.user.name,
    });

    return NextResponse.json({
      message: "Stock updated successfully",
      product: {
        _id: product._id,
        sku: product.sku,
        previousStock,
        newStock,
      },
    });
  } catch (error) {
    console.error("Error updating stock:", error);
    return NextResponse.json(
      { error: "Failed to update stock" },
      { status: 500 }
    );
  }
}
