"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Heart,
  LifeBuoy,
  MapPin,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
} from "lucide-react";

interface Order {
  _id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  items: { name: string; quantity: number }[];
}

interface Ticket {
  _id: string;
  ticketNumber: string;
  subject: string;
  status: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  returned: "bg-gray-100 text-gray-700",
};

const ticketStatusColors: Record<string, string> = {
  open: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  waiting: "bg-orange-100 text-orange-800",
  resolved: "bg-green-100 text-green-800",
  closed: "bg-gray-100 text-gray-700",
};

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [addresses, setAddresses] = useState<unknown[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [ordersRes, ticketsRes, addressesRes, wishlistRes] = await Promise.all([
          fetch("/api/user/orders"),
          fetch("/api/user/tickets"),
          fetch("/api/user/addresses"),
          fetch("/api/wishlist"),
        ]);

        if (ordersRes.ok) {
          const data = await ordersRes.json();
          setOrders(data.orders || []);
        }
        if (ticketsRes.ok) {
          const data = await ticketsRes.json();
          setTickets(data.tickets || []);
        }
        if (addressesRes.ok) {
          const data = await addressesRes.json();
          setAddresses(data.addresses || []);
        }
        if (wishlistRes.ok) {
          const data = await wishlistRes.json();
          setWishlistCount(data.items?.length || 0);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;
  const pendingOrders = orders.filter((o) =>
    ["pending", "confirmed", "processing", "shipped"].includes(o.status)
  ).length;
  const cancelledOrders = orders.filter((o) => o.status === "cancelled").length;
  const openTickets = tickets.filter((t) => ["open", "in_progress", "waiting"].includes(t.status)).length;

  const stats = [
    { label: "Total Orders", value: totalOrders, icon: ShoppingBag, href: "/dashboard/orders", color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active Orders", value: pendingOrders, icon: Clock, href: "/dashboard/orders", color: "text-yellow-600", bg: "bg-yellow-50" },
    { label: "Delivered", value: deliveredOrders, icon: CheckCircle, href: "/dashboard/orders", color: "text-green-600", bg: "bg-green-50" },
    { label: "Cancelled", value: cancelledOrders, icon: XCircle, href: "/dashboard/orders", color: "text-red-600", bg: "bg-red-50" },
    { label: "Saved Items", value: wishlistCount, icon: Heart, href: "/dashboard/wishlist", color: "text-pink-600", bg: "bg-pink-50" },
    { label: "Open Tickets", value: openTickets, icon: LifeBuoy, href: "/dashboard/support", color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Addresses", value: addresses.length, icon: MapPin, href: "/dashboard/addresses", color: "text-primary", bg: "bg-red-50" },
    { label: "Saved Items", value: wishlistCount, icon: Package, href: "/dashboard/wishlist", color: "text-indigo-600", bg: "bg-indigo-50" },
  ].slice(0, 4);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-5 animate-pulse h-24" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Orders", value: totalOrders, icon: ShoppingBag, href: "/dashboard/orders", color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Active Orders", value: pendingOrders, icon: Clock, href: "/dashboard/orders", color: "text-yellow-600", bg: "bg-yellow-50" },
          { label: "Delivered", value: deliveredOrders, icon: CheckCircle, href: "/dashboard/orders", color: "text-green-600", bg: "bg-green-50" },
          { label: "Saved Items", value: wishlistCount, icon: Heart, href: "/dashboard/wishlist", color: "text-pink-600", bg: "bg-pink-50" },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow flex items-center gap-4"
          >
            <div className={`h-11 w-11 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-heading font-bold text-foreground">Recent Orders</h2>
            <Link href="/dashboard/orders" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-5">
              <ShoppingBag className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="text-sm font-medium text-foreground">No orders yet</p>
              <p className="text-xs text-muted-foreground mt-1">Your orders will appear here</p>
              <Link href="/" className="mt-4 text-xs text-primary hover:underline">Start shopping</Link>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {orders.slice(0, 4).map((order) => (
                <li key={order._id}>
                  <Link href={`/dashboard/orders/${order._id}`} className="flex items-center justify-between px-5 py-3.5 hover:bg-muted transition-colors">
                    <div>
                      <p className="text-sm font-medium text-foreground">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {order.items?.length} item{order.items?.length !== 1 ? "s" : ""} &middot; {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}>
                        {order.status}
                      </span>
                      <span className="text-sm font-semibold text-foreground">
                        ₹{order.total.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Support Tickets */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-heading font-bold text-foreground">Support Tickets</h2>
            <Link href="/dashboard/support/new" className="text-xs text-primary hover:underline flex items-center gap-1">
              New ticket <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          {tickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-5">
              <LifeBuoy className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="text-sm font-medium text-foreground">No tickets yet</p>
              <p className="text-xs text-muted-foreground mt-1">Need help? Open a support ticket</p>
              <Link href="/dashboard/support/new" className="mt-4 text-xs text-primary hover:underline">Create ticket</Link>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {tickets.slice(0, 4).map((ticket) => (
                <li key={ticket._id}>
                  <Link href={`/dashboard/support/${ticket._id}`} className="flex items-center justify-between px-5 py-3.5 hover:bg-muted transition-colors">
                    <div className="min-w-0 mr-3">
                      <p className="text-sm font-medium text-foreground truncate">{ticket.subject}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{ticket.ticketNumber}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize shrink-0 ${ticketStatusColors[ticket.status] || "bg-gray-100 text-gray-700"}`}>
                      {ticket.status.replace("_", " ")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Manage Addresses", desc: `${addresses.length} saved`, href: "/dashboard/addresses", icon: MapPin },
          { label: "Wishlist", desc: `${wishlistCount} items`, href: "/dashboard/wishlist", icon: Heart },
          { label: "Contact Support", desc: "We're here to help", href: "/dashboard/support/new", icon: LifeBuoy },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-card rounded-xl border border-border p-4 hover:shadow-md hover:border-primary/30 transition-all flex items-center gap-3"
          >
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <item.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
