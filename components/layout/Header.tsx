"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isAdmin = session?.user?.role === "admin" || session?.user?.role === "super_admin";

  return (
    <header className="sticky top-0 z-50 w-full bg-card shadow-sm">
      {/* Top Bar */}
      <div className="bg-stb-navy text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5">
          <div className="flex items-center gap-4">
            <Link
              href="/b2b"
              className="body-sm flex items-center gap-1.5 text-white/80 transition-colors hover:text-white"
            >
              <Phone className="h-3.5 w-3.5" />
              B2B
            </Link>
            <Link
              href="/b2c"
              className="body-sm flex items-center gap-1.5 text-white/80 transition-colors hover:text-white"
            >
              <Phone className="h-3.5 w-3.5" />
              B2C
            </Link>
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
                    <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg bg-card py-1 shadow-lg">
                      <Link
                        href="/account"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="h-4 w-4" />
                        My Account
                      </Link>
                      <Link
                        href="/account/orders"
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
                  className="body-sm flex items-center gap-1.5 text-white/80 transition-colors hover:text-white"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:gap-8">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            }
          />
          <SheetContent side="left" className="w-[300px] p-0">
            <SheetHeader className="border-b p-4">
              <SheetTitle className="heading-md text-primary">
                Sabka Tech Bazar
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col p-2">
              {navCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="body-md rounded-lg px-4 py-2.5 text-foreground transition-colors hover:bg-muted"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <span className="font-heading text-lg font-bold text-white">S</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="font-heading text-xl font-bold text-primary">STB</h1>
            <p className="body-sm -mt-0.5 text-muted-foreground">Technologies</p>
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
            className="h-11 rounded-full border-border bg-muted pl-5 pr-12 focus-visible:ring-primary"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-12 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <Button
            type="submit"
            size="icon"
            className="absolute right-1 h-9 w-9 rounded-full bg-primary hover:bg-stb-primary-dark"
          >
            <Search className="h-4 w-4 text-white" />
          </Button>
        </form>

        {/* Action Icons */}
        <div className="flex items-center gap-1">
          <Link href="/wishlist">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-foreground"
            >
              <Heart className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                0
              </span>
            </Button>
          </Link>
          <Link href="/cart">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-foreground"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                0
              </span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl overflow-x-auto px-4">
          <nav className="flex items-center gap-1 py-2">
            {navCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="label-uppercase shrink-0 rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
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
