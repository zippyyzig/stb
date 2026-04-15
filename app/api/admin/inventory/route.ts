import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import InventoryLog from "@/models/Inventory";

// GET inventory overview with low stock alerts
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter");
    const search = searchParams.get("search");
    const page = Number(searchParams.get("page")) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};

    if (filter === "low-stock") {
      query.stock = { $gt: 0, $lte: 10 };
    } else if (filter === "out-of-stock") {
      query.stock = 0;
    } else if (filter === "in-stock") {
      query.stock = { $gt: 10 };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
      ];
    }

    const [products, total, stats] = await Promise.all([
      Product.find(query)
        .select("_id name sku images stock minOrderQty priceB2C category")
        .populate("category", "name")
        .sort({ stock: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
      Product.aggregate([
        {
          $group: {
            _id: null,
            totalProducts: { $sum: 1 },
            totalStock: { $sum: "$stock" },
            outOfStock: {
              $sum: { $cond: [{ $eq: ["$stock", 0] }, 1, 0] },
            },
            lowStock: {
              $sum: {
                $cond: [
                  { $and: [{ $gt: ["$stock", 0] }, { $lte: ["$stock", 10] }] },
                  1,
                  0,
                ],
              },
            },
            totalValue: { $sum: { $multiply: ["$stock", "$priceB2C"] } },
          },
        },
      ]),
    ]);

    const inventoryStats = stats[0] || {
      totalProducts: 0,
      totalStock: 0,
      outOfStock: 0,
      lowStock: 0,
      totalValue: 0,
    };

    return NextResponse.json({
      products: JSON.parse(JSON.stringify(products)),
      total,
      page,
      totalPages: Math.ceil(total / limit),
      stats: inventoryStats,
    });
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return NextResponse.json(
      { error: "Failed to fetch inventory" },
      { status: 500 }
    );
  }
}

// POST - Update stock for a product
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, type, quantity, reason, reference } = await request.json();

    if (!productId || !type || quantity === undefined) {
      return NextResponse.json(
        { error: "Product ID, type, and quantity are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const previousStock = product.stock;
    let newStock: number;

    switch (type) {
      case "stock_in":
        newStock = previousStock + Math.abs(quantity);
        break;
      case "stock_out":
      case "damaged":
      case "expired":
        newStock = Math.max(0, previousStock - Math.abs(quantity));
        break;
      case "adjustment":
        newStock = Math.max(0, quantity);
        break;
      default:
        return NextResponse.json({ error: "Invalid stock change type" }, { status: 400 });
    }

    // Update product stock
    product.stock = newStock;
    await product.save();

    // Create inventory log
    await InventoryLog.create({
      product: productId,
      type,
      quantity: type === "adjustment" ? newStock - previousStock : quantity,
      previousStock,
      newStock,
      reason,
      reference,
      performedBy: session.user.id,
    });

    return NextResponse.json({
      message: "Stock updated successfully",
      product: {
        _id: product._id,
        name: product.name,
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
