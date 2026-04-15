import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import InventoryClient from "./InventoryClient";

interface InventoryPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getInventoryData(searchParams: { [key: string]: string | string[] | undefined }) {
  try {
    await dbConnect();

    const filter = searchParams.filter as string;
    const search = searchParams.search as string;
    const page = Number(searchParams.page) || 1;
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
        .select("_id name sku images stock minOrderQty priceB2C category brand")
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

    return {
      products: JSON.parse(JSON.stringify(products)),
      total,
      page,
      totalPages: Math.ceil(total / limit),
      stats: inventoryStats,
    };
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return {
      products: [],
      total: 0,
      page: 1,
      totalPages: 1,
      stats: {
        totalProducts: 0,
        totalStock: 0,
        outOfStock: 0,
        lowStock: 0,
        totalValue: 0,
      },
    };
  }
}

export default async function InventoryPage({ searchParams }: InventoryPageProps) {
  const params = await searchParams;
  const data = await getInventoryData(params);

  return <InventoryClient {...data} currentFilter={params.filter as string} />;
}
