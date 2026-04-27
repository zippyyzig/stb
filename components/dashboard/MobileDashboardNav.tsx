"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  Bell,
  MoreHorizontal,
  MapPin,
  LifeBuoy,
  User,
  Shield,
  Store,
  LogOut,
  X,
} from "lucide-react";
import { useState } from "react";

const primaryTabs = [
  { title: "Home", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { title: "Orders", href: "/dashboard/orders", icon: ShoppingBag, exact: false },
  { title: "Wishlist", href: "/dashboard/wishlist", icon: Heart, exact: false },
  { title: "Alerts", href: "/dashboard/notifications", icon: Bell, exact: false },
  { title: "More", href: "#more", icon: MoreHorizontal, exact: false },
];

const moreItems = [
  { title: "Profile", href: "/dashboard/profile", icon: User, color: "bg-blue-50 text-blue-600" },
  { title: "Addresses", href: "/dashboard/addresses", icon: MapPin, color: "bg-purple-50 text-purple-600" },
  { title: "Security", href: "/dashboard/security", icon: Shield, color: "bg-green-50 text-green-600" },
  { title: "Support", href: "/dashboard/support", icon: LifeBuoy, color: "bg-amber-50 text-amber-600" },
];

export default function MobileDashboardNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (href: string, exact: boolean) =>
    exact
      ? pathname === href
      : pathname === href || pathname.startsWith(href + "/");

  const isMoreActive = moreItems.some(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/")
  );

  return (
    <>
      {/* Bottom tab bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="grid h-16 grid-cols-5">
          {primaryTabs.map((tab) => {
            const isMore = tab.href === "#more";
            const active = isMore ? isMoreActive || moreOpen : isActive(tab.href, tab.exact);

            return (
              <button
                key={tab.title}
                onClick={() => {
                  if (isMore) {
                    setMoreOpen((v) => !v);
                  } else {
                    setMoreOpen(false);
                  }
                }}
                className="relative flex flex-col items-center justify-center gap-1 press-active"
                aria-label={tab.title}
              >
                {active && (
                  <span className="absolute top-2 h-8 w-12 rounded-full bg-stb-red-light" />
                )}
                {isMore ? (
                  <Link
                    href="#"
                    onClick={(e) => { e.preventDefault(); setMoreOpen((v) => !v); }}
                    className="relative z-10 flex flex-col items-center gap-1"
                  >
                    <tab.icon
                      className={`relative z-10 h-[22px] w-[22px] transition-all duration-200 ${
                        active ? "text-primary stroke-[2.5]" : "text-[#9CA3AF] stroke-[1.5]"
                      }`}
                    />
                    <span
                      className={`relative z-10 text-[10px] font-semibold leading-none ${
                        active ? "text-primary" : "text-[#9CA3AF]"
                      }`}
                    >
                      {tab.title}
                    </span>
                  </Link>
                ) : (
                  <Link
                    href={tab.href}
                    className="relative z-10 flex flex-col items-center gap-1"
                    onClick={() => setMoreOpen(false)}
                  >
                    <tab.icon
                      className={`h-[22px] w-[22px] transition-all duration-200 ${
                        active ? "text-primary stroke-[2.5]" : "text-[#9CA3AF] stroke-[1.5]"
                      }`}
                    />
                    <span
                      className={`text-[10px] font-semibold leading-none ${
                        active ? "text-primary" : "text-[#9CA3AF]"
                      }`}
                    >
                      {tab.title}
                    </span>
                  </Link>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* "More" slide-up sheet */}
      {moreOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setMoreOpen(false)}
          />

          {/* Sheet */}
          <div
            className="fixed bottom-16 left-0 right-0 z-50 rounded-t-3xl bg-white px-4 pb-4 pt-3 shadow-2xl animate-slide-up md:hidden"
            style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}
          >
            {/* Handle */}
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />

            {/* Close */}
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-bold text-foreground">More Options</span>
              <button
                onClick={() => setMoreOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground press-active"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* 2x2 grid of secondary nav items */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {moreItems.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className={`flex items-center gap-3 rounded-2xl border p-3.5 transition-all press-active ${
                      active
                        ? "border-primary/30 bg-stb-red-light"
                        : "border-border bg-muted/30 hover:border-border"
                    }`}
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.color}`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <span className={`text-sm font-semibold ${active ? "text-primary" : "text-foreground"}`}>
                      {item.title}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Divider */}
            <div className="mb-3 border-t border-border" />

            {/* Back to store + Sign out */}
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                onClick={() => setMoreOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted press-active"
              >
                <Store className="h-4.5 w-4.5" />
                Back to Store
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive hover:bg-red-50 press-active"
              >
                <LogOut className="h-4.5 w-4.5" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
