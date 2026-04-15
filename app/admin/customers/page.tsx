import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Order from "@/models/Order";
import CustomersClient from "./CustomersClient";

interface CustomersPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getCustomers(searchParams: { [key: string]: string | string[] | undefined }) {
  try {
    await dbConnect();

    const search = searchParams.search as string;
    const status = searchParams.status as string;
    const page = Number(searchParams.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = { role: "customer" };

    if (status === "active") {
      query.isActive = true;
    } else if (status === "inactive") {
      query.isActive = false;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const [customers, total] = await Promise.all([
      User.find(query)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ]);

    // Get order stats for each customer
    const customersWithStats = await Promise.all(
      customers.map(async (customer) => {
        const orderStats = await Order.aggregate([
          { $match: { user: customer._id } },
          {
            $group: {
              _id: null,
              totalOrders: { $sum: 1 },
              totalSpent: { $sum: "$total" },
            },
          },
        ]);

        return {
          ...customer,
          _id: customer._id.toString(),
          totalOrders: orderStats[0]?.totalOrders || 0,
          totalSpent: orderStats[0]?.totalSpent || 0,
        };
      })
    );

    return {
      customers: customersWithStats,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Error fetching customers:", error);
    return { customers: [], total: 0, page: 1, totalPages: 1 };
  }
}

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
  const session = await getServerSession(authOptions);
  const params = await searchParams;
  const data = await getCustomers(params);
  const isSuperAdmin = session?.user.role === "super_admin";

  return <CustomersClient {...data} isSuperAdmin={isSuperAdmin} currentStatus={params.status as string} />;
}
