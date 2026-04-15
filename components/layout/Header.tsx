"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  Search,
  Heart,
  ShoppingCart,
  Menu,
  LogIn,
  UserPlus,
  X,
  User,
  LogOut,
  Settings,
  Package,
  ChevronDown,
  ArrowRight,
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
  const [showSearch, setShowSearch] = useState(false);

  const isAdmin = session?.user?.role === "admin" || session?.user?.role === "super_admin";

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Announcement Bar */}
      <div className="bg-foreground text-background">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-2">
          <p className="body-sm flex items-center gap-2 text-center">
            <span className="hidden sm:inline">Free shipping on orders over ₹5,000</span>
            <span className="sm:hidden">Free shipping over ₹5,000</span>
            <ArrowRight className="h-3 w-3" />
          </p>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b border-border bg-card/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:gap-8">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="h-10 w-10 lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              }
            />
            <SheetContent side="left" className="w-[320px] p-0">
              <SheetHeader className="border-b border-border p-6">
                <SheetTitle className="font-serif text-2xl tracking-tight">
                  Menu
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col p-4">
                {navCategories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    className="flex items-center justify-between rounded-lg px-4 py-3 text-foreground transition-colors hover:bg-muted"
                  >
                    <span className="body-md font-medium">{cat.name}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </nav>
              <div className="border-t border-border p-4">
                <div className="flex flex-col gap-2">
                  <Link href="/b2b">
                    <Button variant="outline" className="w-full justify-start">
                      B2B Portal
                    </Button>
                  </Link>
                  <Link href="/b2c">
                    <Button variant="outline" className="w-full justify-start">
                      B2C Shop
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground">
              <span className="font-serif text-lg text-background">S</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-serif text-xl tracking-tight">Sabka Tech Bazar</h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navCategories.slice(0, 7).map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="body-sm px-3 py-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10"
              onClick={() => setShowSearch(!showSearch)}
            >
              {showSearch ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>

            {/* Wishlist */}
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="relative h-10 w-10">
                <Heart className="h-5 w-5" />
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground">
                  0
                </span>
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative h-10 w-10">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground">
                  0
                </span>
              </Button>
            </Link>

            {/* User Menu */}
            {status === "loading" ? (
              <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
            ) : session ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <User className="h-5 w-5" />
                </Button>
                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-border bg-card p-2 shadow-xl">
                      <div className="border-b border-border px-3 pb-3 pt-2">
                        <p className="heading-sm">{session.user?.name}</p>
                        <p className="body-sm text-muted-foreground">{session.user?.email}</p>
                      </div>
                      <div className="py-2">
                        <Link
                          href="/account"
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-colors hover:bg-muted"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="h-4 w-4" />
                          <span className="body-sm">My Account</span>
                        </Link>
                        <Link
                          href="/account/orders"
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-colors hover:bg-muted"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Package className="h-4 w-4" />
                          <span className="body-sm">My Orders</span>
                        </Link>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-colors hover:bg-muted"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Settings className="h-4 w-4" />
                            <span className="body-sm">Admin Panel</span>
                          </Link>
                        )}
                      </div>
                      <div className="border-t border-border pt-2">
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            signOut({ callbackUrl: "/" });
                          }}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-destructive transition-colors hover:bg-destructive/10"
                        >
                          <LogOut className="h-4 w-4" />
                          <span className="body-sm">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm" className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar (Expandable) */}
        {showSearch && (
          <div className="border-t border-border bg-card px-4 py-4">
            <div className="mx-auto max-w-2xl">
              <form action="/search" method="GET" className="relative">
                <Input
                  type="text"
                  name="q"
                  placeholder="Search for products, brands, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 rounded-full border-border bg-muted pl-5 pr-12 text-base focus-visible:ring-foreground"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-14 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-1.5 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
