import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Product from "@/models/Product";
import Order from "@/models/Order";
import Category from "@/models/Category";
import {
  Package,
  ShoppingCart,
  Users,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

async function getDashboardStats() {
  try {
    await dbConnect();

    const [
      totalProducts,
      totalOrders,
      totalCustomers,
      totalCategories,
      recentOrders,
      lowStockProducts,
    ] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      User.countDocuments({ role: "customer" }),
      Category.countDocuments({ isActive: true }),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("user", "name email")
        .lean(),
      Product.find({ stock: { $lt: 10 }, isActive: true })
        .limit(5)
        .lean(),
    ]);

    // Calculate revenue
    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    return {
      totalProducts,
      totalOrders,
      totalCustomers,
      totalCategories,
      totalRevenue,
      recentOrders: JSON.parse(JSON.stringify(recentOrders)),
      lowStockProducts: JSON.parse(JSON.stringify(lowStockProducts)),
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalProducts: 0,
      totalOrders: 0,
      totalCustomers: 0,
      totalCategories: 0,
      totalRevenue: 0,
      recentOrders: [],
      lowStockProducts: [],
    };
  }
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  const stats = await getDashboardStats();

  const statCards = [
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`,
      change: "+12.5%",
      trend: "up",
      icon: IndianRupee,
      color: "bg-stb-success",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      change: "+8.2%",
      trend: "up",
      icon: ShoppingCart,
      color: "bg-primary",
    },
    {
      title: "Total Products",
      value: stats.totalProducts.toString(),
      change: "+3.1%",
      trend: "up",
      icon: Package,
      color: "bg-accent",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers.toString(),
      change: "+15.3%",
      trend: "up",
      icon: Users,
      color: "bg-chart-4",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome */}
      <div>
        <h1 className="heading-xl">
          Welcome back, {session?.user?.name?.split(" ")[0]}
        </h1>
        <p className="body-md mt-1 text-muted-foreground">
          {"Here's what's happening with your store today."}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="rounded-xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color}`}
              >
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <span
                className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === "up" ? "text-stb-success" : "text-destructive"
                }`}
              >
                {stat.trend === "up" ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="body-sm text-muted-foreground">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders & Low Stock */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="heading-md">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              View All
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {stats.recentOrders.length > 0 ? (
              stats.recentOrders.map((order: {
                _id: string;
                orderNumber: string;
                user?: { name: string; email: string };
                total: number;
                status: string;
                createdAt: string;
              }) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      #{order.orderNumber}
                    </p>
                    <p className="body-sm text-muted-foreground">
                      {order.user?.name || "Guest"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">
                      ₹{order.total.toLocaleString("en-IN")}
                    </p>
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        order.status === "delivered"
                          ? "bg-stb-success/10 text-stb-success"
                          : order.status === "cancelled"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-accent/10 text-accent"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-muted-foreground">
                No orders yet
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="heading-md">Low Stock Alert</h2>
            <Link
              href="/admin/products?filter=low-stock"
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              View All
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {stats.lowStockProducts.length > 0 ? (
              stats.lowStockProducts.map((product: {
                _id: string;
                name: string;
                sku: string;
                stock: number;
              }) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div>
                    <p className="font-medium text-foreground line-clamp-1">
                      {product.name}
                    </p>
                    <p className="body-sm text-muted-foreground">
                      SKU: {product.sku}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      product.stock === 0
                        ? "bg-destructive/10 text-destructive"
                        : "bg-stb-warning/10 text-stb-warning"
                    }`}
                  >
                    {product.stock === 0 ? "Out of Stock" : `${product.stock} left`}
                  </span>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-muted-foreground">
                All products are well stocked
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="heading-md mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/products/new"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-stb-primary-dark"
          >
            Add Product
          </Link>
          <Link
            href="/admin/categories/new"
            className="rounded-lg bg-muted px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/80"
          >
            Add Category
          </Link>
          <Link
            href="/admin/orders"
            className="rounded-lg bg-muted px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/80"
          >
            View Orders
          </Link>
          <Link
            href="/admin/banners"
            className="rounded-lg bg-muted px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/80"
          >
            Manage Banners
          </Link>
        </div>
      </div>
    </div>
  );
}
