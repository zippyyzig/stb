"use client";

import Link from "next/link";
import Image from "next/image";
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
  { title: "Orders", href: "/dashboard/orders", icon: ShoppingBag, exact: false },
  { title: "Addresses", href: "/dashboard/addresses", icon: MapPin, exact: false },
  { title: "Wishlist", href: "/dashboard/wishlist", icon: Heart, exact: false },
  { title: "Notifications", href: "/dashboard/notifications", icon: Bell, exact: false },
  { title: "Support", href: "/dashboard/support", icon: LifeBuoy, exact: false },
  { title: "Profile", href: "/dashboard/profile", icon: User, exact: false },
  { title: "Security", href: "/dashboard/security", icon: Shield, exact: false },
];

// Items shown in the mobile bottom tab bar (max 5 incl. "More")
const mobileTabItems = menuItems.slice(0, 4);

export default function DashboardSidebar() {
  const pathname = usePathname();

  const isActive = (item: (typeof menuItems)[0]) =>
    item.exact
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(item.href + "/");

  return (
    <>
      {/* ── Desktop sidebar ────────────────────────────────────────────── */}
      <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r border-[#262626] bg-[#1A1A1A] md:flex xl:w-60">
        {/* Logo */}
        <div className="flex h-14 items-center gap-3 border-b border-[#262626] px-4">
          <Image
            src="/logo.png"
            alt="Smart Tech Bazaar"
            width={96}
            height={32}
            className="h-7 w-auto object-contain brightness-0 invert"
          />
          <span className="text-[10px] font-medium text-[#737373]">My Account</span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto p-2.5">
          <ul className="flex flex-col gap-0.5">
            {menuItems.map((item) => {
              const active = isActive(item);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[11px] font-semibold transition-colors xl:text-xs ${
                      active
                        ? "bg-primary text-white"
                        : "text-[#A3A3A3] hover:bg-[#262626] hover:text-white"
                    }`}
                  >
                    <item.icon className="h-3.5 w-3.5 shrink-0" />
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Back to store */}
        <div className="border-t border-[#262626] p-2.5">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[11px] font-semibold text-[#737373] transition-colors hover:bg-[#262626] hover:text-white xl:text-xs"
          >
            <Store className="h-3.5 w-3.5 shrink-0" />
            Back to Store
          </Link>
        </div>
      </aside>

      {/* ── Mobile top nav strip ──────────────────────────────────────── */}
      <div className="sticky top-0 z-30 border-b border-border bg-white md:hidden">
        <div className="flex items-center gap-1.5 overflow-x-auto px-3 py-2.5 scrollbar-hide">
          {menuItems.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[10px] font-semibold leading-none transition-all ${
                  active
                    ? "bg-primary text-white shadow-sm"
                    : "bg-[#F1F3F5] text-[#6B7280] hover:bg-[#E5E7EB] hover:text-foreground"
                }`}
              >
                <item.icon className="h-3 w-3 shrink-0" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
