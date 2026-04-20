"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart, useWishlist } from "@/components/providers/CartWishlistProvider";
import { useRouter } from "next/navigation";
import {
  Search,
  Heart,
  ShoppingCart,
  Menu,
  MapPin,
  LogIn,
  UserPlus,
  Phone,
  X,
  User,
  LogOut,
  Settings,
  Package,
  ChevronDown,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export default function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isAdmin = session?.user?.role === "admin" || session?.user?.role === "super_admin";

  // Redirect to onboarding if not completed
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
    <header className="sticky top-0 z-50 w-full bg-card shadow-sm">
      {/* Top Bar - Black */}
      <div className="bg-stb-dark text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-white/90">
              <Phone className="h-4 w-4 text-primary" />
              <span className="body-sm font-medium">+91 9876543210</span>
            </div>
            <div className="hidden items-center gap-2 text-white/90 md:flex">
              <Headphones className="h-4 w-4 text-primary" />
              <span className="body-sm">24/7 Support</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/store-locator"
              className="body-sm hidden items-center gap-1.5 text-white/80 transition-colors hover:text-white sm:flex"
            >
              <MapPin className="h-3.5 w-3.5" />
              Location
            </Link>
            {status === "loading" ? (
              <span className="body-sm text-white/60">Loading...</span>
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="body-sm flex items-center gap-1.5 text-white/80 transition-colors hover:text-white"
                >
                  <User className="h-3.5 w-3.5" />
                  {session.user?.name?.split(" ")[0]}
                  <ChevronDown className="h-3 w-3" />
                </button>
                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg bg-card py-1 shadow-lg border border-border">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="h-4 w-4" />
                        My Account
                      </Link>
                      <Link
                        href="/dashboard/orders"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Package className="h-4 w-4" />
                        My Orders
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="h-4 w-4" />
                          Admin Panel
                        </Link>
                      )}
                      <hr className="my-1 border-border" />
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-muted"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="body-sm flex items-center gap-1.5 text-white/80 transition-colors hover:text-white"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="body-sm flex items-center gap-1.5 rounded bg-primary px-3 py-1 text-white transition-colors hover:bg-stb-red-dark"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Header - White with Red accents */}
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 lg:gap-8">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            }
          />
          <SheetContent side="left" className="w-[300px] p-0 bg-stb-dark text-white">
            <SheetHeader className="border-b border-white/10 p-4">
              <SheetTitle className="heading-md text-white">
                STB Technologies
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col p-2">
              {navCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="body-md rounded-lg px-4 py-2.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <span className="font-heading text-2xl font-bold text-white">S</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="font-heading text-2xl font-bold tracking-wide text-stb-dark">STB</h1>
            <p className="body-sm -mt-1 font-medium text-primary">TECHNOLOGIES</p>
          </div>
        </Link>

        {/* Search */}
        <form
          action="/search"
          method="GET"
          className="relative flex flex-1 items-center"
        >
          <Input
            type="text"
            name="q"
            placeholder="Search products, brands and more..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 rounded-lg border-2 border-border bg-muted pl-5 pr-14 focus-visible:border-primary focus-visible:ring-0"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-14 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <Button
            type="submit"
            size="icon"
            className="absolute right-1 h-10 w-10 rounded-md bg-primary hover:bg-stb-red-dark"
          >
            <Search className="h-5 w-5 text-white" />
          </Button>
        </form>

        {/* Action Icons */}
        <div className="flex items-center gap-2">
          <Link href="/wishlist">
            <Button
              variant="ghost"
              size="icon"
              className="relative h-11 w-11 rounded-lg text-foreground hover:bg-stb-red-light hover:text-primary"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white animate-in zoom-in-50 duration-200">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </Button>
          </Link>
          <Link href="/cart">
            <Button
              variant="ghost"
              size="icon"
              className="relative h-11 w-11 rounded-lg text-foreground hover:bg-stb-red-light hover:text-primary"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white animate-in zoom-in-50 duration-200">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>

      {/* Category Navigation - Red background */}
      <div className="bg-primary">
        <div className="mx-auto max-w-7xl overflow-x-auto px-4">
          <nav className="flex items-center gap-1 py-2">
            <Link
              href="/products"
              className="label-uppercase shrink-0 rounded bg-white/20 px-4 py-2 font-semibold text-white transition-colors hover:bg-white/30"
            >
              All Products
            </Link>
            {navCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="label-uppercase shrink-0 rounded px-4 py-2 text-white/90 transition-colors hover:bg-white/20 hover:text-white"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
