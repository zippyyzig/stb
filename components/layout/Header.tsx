"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart, useWishlist } from "@/components/providers/CartWishlistProvider";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  Heart,
  ShoppingCart,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  Package,
  ChevronDown,
  Home,
  Grid3X3,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navCategories = [
  { name: "Desktop", slug: "desktop" },
  { name: "Laptop", slug: "laptop" },
  { name: "Storage", slug: "storage" },
  { name: "Display", slug: "display" },
  { name: "Peripherals", slug: "peripherals" },
  { name: "Printers", slug: "printers" },
  { name: "Security", slug: "security" },
  { name: "Networking", slug: "networking" },
  { name: "Software", slug: "software" },
  { name: "Cables", slug: "cables" },
];

const mobileNavItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Categories", href: "/products", icon: Grid3X3 },
  { name: "Wishlist", href: "/wishlist", icon: Heart },
  { name: "Cart", href: "/cart", icon: ShoppingCart },
  { name: "Account", href: "/dashboard", icon: User },
];

export default function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const isAdmin = session?.user?.role === "admin" || session?.user?.role === "super_admin";

  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.user &&
      !session.user.isOnboardingComplete &&
      typeof window !== "undefined" &&
      !window.location.pathname.startsWith("/auth/")
    ) {
      router.push("/auth/onboarding");
    }
  }, [status, session, router]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-border">
        {/* Top info bar - visible on desktop only */}
        <div className="hidden bg-stb-dark text-white md:block">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5">
            <p className="text-xs text-white/70">
              Free shipping on orders above ₹5,000 &nbsp;|&nbsp; GST verified B2B pricing available
            </p>
            <div className="flex items-center gap-4">
              {status === "loading" ? null : session ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-1.5 text-xs text-white/80 transition-colors hover:text-white"
                  >
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                      {session.user?.name?.[0]?.toUpperCase()}
                    </div>
                    {session.user?.name?.split(" ")[0]}
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  {showUserMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                      <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl bg-white py-1.5 shadow-xl border border-border">
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="h-4 w-4 text-primary" />
                          My Account
                        </Link>
                        <Link
                          href="/dashboard/orders"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Package className="h-4 w-4 text-primary" />
                          My Orders
                        </Link>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Settings className="h-4 w-4 text-primary" />
                            Admin Panel
                          </Link>
                        )}
                        <hr className="my-1 border-border" />
                        <button
                          onClick={() => { setShowUserMenu(false); signOut({ callbackUrl: "/" }); }}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-secondary"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/auth/login" className="text-xs text-white/70 hover:text-white transition-colors">
                    Login
                  </Link>
                  <Link href="/auth/register" className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-stb-red-dark">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-3 py-2.5 md:px-4 md:py-3 md:gap-6">
          {/* Mobile Menu Drawer */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 rounded-lg md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="border-b border-border bg-stb-dark p-4">
                <SheetTitle className="flex items-center gap-3 text-white">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                    <span className="font-heading text-lg font-bold text-white">S</span>
                  </div>
                  <div>
                    <div className="text-base font-bold tracking-wide">STB</div>
                    <div className="text-[10px] text-primary font-semibold">TECHNOLOGIES</div>
                  </div>
                </SheetTitle>
              </SheetHeader>

              {/* Auth state in drawer */}
              {session ? (
                <div className="border-b border-border bg-secondary/50 px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                      {session.user?.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{session.user?.name}</p>
                      <p className="text-[11px] text-muted-foreground">{session.user?.email}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border-b border-border px-4 py-3 flex gap-2">
                  <Link href="/auth/login" className="flex-1 rounded-lg border border-border py-2 text-center text-sm font-medium text-foreground hover:bg-secondary">
                    Login
                  </Link>
                  <Link href="/auth/register" className="flex-1 rounded-lg bg-primary py-2 text-center text-sm font-medium text-white hover:bg-stb-red-dark">
                    Register
                  </Link>
                </div>
              )}

              <nav className="flex flex-col p-2 overflow-y-auto">
                <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Categories</p>
                {navCategories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    className="rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-secondary hover:text-primary"
                  >
                    {cat.name}
                  </Link>
                ))}
                {session && (
                  <>
                    <p className="mt-3 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Account</p>
                    <Link href="/dashboard" className="rounded-lg px-3 py-2.5 text-sm text-foreground hover:bg-secondary">My Account</Link>
                    <Link href="/dashboard/orders" className="rounded-lg px-3 py-2.5 text-sm text-foreground hover:bg-secondary">My Orders</Link>
                    {isAdmin && (
                      <Link href="/admin" className="rounded-lg px-3 py-2.5 text-sm text-foreground hover:bg-secondary">Admin Panel</Link>
                    )}
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="rounded-lg px-3 py-2.5 text-left text-sm text-destructive hover:bg-secondary"
                    >
                      Logout
                    </button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-sm md:h-10 md:w-10">
              <span className="font-heading text-lg font-bold text-white md:text-xl">S</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-heading text-xl font-bold tracking-tight text-foreground leading-none">STB</h1>
              <p className="text-[10px] font-semibold text-primary tracking-wider leading-none mt-0.5">TECHNOLOGIES</p>
            </div>
          </Link>

          {/* Search - Desktop */}
          <form action="/search" method="GET" className="relative hidden flex-1 items-center md:flex">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                name="q"
                placeholder="Search products, brands and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-xl border border-border bg-secondary pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </form>

          {/* Mobile Search Toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors hover:bg-primary hover:text-white md:hidden"
          >
            {searchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
          </button>

          {/* Action Icons */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Wishlist - desktop only */}
            <Link href="/wishlist" className="hidden md:block">
              <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-lg text-muted-foreground hover:bg-stb-red-light hover:text-primary">
                <Heart className="h-4.5 w-4.5" />
                {wishlistCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-lg text-muted-foreground hover:bg-stb-red-light hover:text-primary">
                <ShoppingCart className="h-4.5 w-4.5" />
                {cartCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* User avatar - desktop only */}
            {session && (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white transition-colors hover:bg-stb-red-dark"
                >
                  {session.user?.name?.[0]?.toUpperCase()}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Expandable Search */}
        {searchOpen && (
          <div className="border-t border-border bg-white px-3 py-2 md:hidden">
            <form action="/search" method="GET" className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                name="q"
                placeholder="Search products..."
                autoFocus
                className="h-9 w-full rounded-lg border border-border bg-secondary pl-9 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </form>
          </div>
        )}

        {/* Desktop Category Nav */}
        <div className="hidden border-t border-border bg-white md:block">
          <div className="mx-auto max-w-7xl overflow-x-auto px-4">
            <nav className="flex items-center gap-0.5 py-1.5">
              <Link
                href="/products"
                className="shrink-0 rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-stb-red-dark"
              >
                All Products
              </Link>
              {navCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white pb-safe md:hidden">
        <div className="grid grid-cols-5">
          {mobileNavItems.map((item) => {
            const isActive = pathname === item.href;
            const isCart = item.href === "/cart";
            const isWishlist = item.href === "/wishlist";
            const count = isCart ? cartCount : isWishlist ? wishlistCount : 0;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-0.5 py-2 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="relative">
                  <item.icon className={`h-5 w-5 ${isActive ? "stroke-[2.5px]" : "stroke-[1.75px]"}`} />
                  {count > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white">
                      {count > 9 ? "9+" : count}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-medium ${isActive ? "text-primary" : ""}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Spacer for mobile bottom nav */}
      <div className="h-14 md:hidden" />
    </>
  );
}
