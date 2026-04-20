"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  MapPin,
  Heart,
  LifeBuoy,
  User,
  Shield,
  Store,
  Bell,
} from "lucide-react";

const menuItems = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { title: "My Orders", href: "/dashboard/orders", icon: ShoppingBag, exact: false },
  { title: "Addresses", href: "/dashboard/addresses", icon: MapPin, exact: false },
  { title: "Wishlist", href: "/dashboard/wishlist", icon: Heart, exact: false },
  { title: "Notifications", href: "/dashboard/notifications", icon: Bell, exact: false },
  { title: "Support", href: "/dashboard/support", icon: LifeBuoy, exact: false },
  { title: "Profile", href: "/dashboard/profile", icon: User, exact: false },
  { title: "Security", href: "/dashboard/security", icon: Shield, exact: false },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-60 flex-col border-r border-border bg-[#1A1A1A]">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-[#262626] px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <span className="font-heading text-sm font-bold text-white">S</span>
        </div>
        <div>
          <h1 className="font-heading text-base font-bold text-white">STB</h1>
          <p className="text-[11px] -mt-0.5 text-[#737373]">My Account</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="flex flex-col gap-0.5">
          {menuItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-[#A3A3A3] hover:bg-[#262626] hover:text-white"
                  }`}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Back to Store */}
      <div className="border-t border-[#262626] p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#737373] transition-colors hover:bg-[#262626] hover:text-white"
        >
          <Store className="h-4 w-4 shrink-0" />
          Back to Store
        </Link>
      </div>
    </aside>
  );
}
