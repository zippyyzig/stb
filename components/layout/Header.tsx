"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { signOutWithNativeCleanup } from "@/lib/auth-helpers";
import { useCart, useWishlist } from "@/components/providers/CartWishlistProvider";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  LogOut,
  Settings,
  Package,
  Home,
  LayoutGrid,
  Store,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { NAV_CATEGORIES } from "@/lib/nav-categories";

const utilityLinks = [
  { name: "Orders", href: "/dashboard/orders" },
  { name: "Contact us", href: "/support" },
  { name: "Resource Center", href: "/shipping" },
  { name: "Find a store", href: "/about" },
];

export default function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [categorySheetOpen, setCategorySheetOpen] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);

  const isAdmin = session?.user?.role === "admin" || session?.user?.role === "super_admin";
  const firstName = session?.user?.name?.split(" ")[0];

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

  useEffect(() => {
    if (!showUserMenu) return;
    const close = () => setShowUserMenu(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [showUserMenu]);

  const scrollStrip = (direction: 1 | -1) => {
    stripRef.current?.scrollBy({ left: direction * 480, behavior: "smooth" });
  };

  const userMenu = showUserMenu && (
    <div className="absolute right-0 top-full z-50 mt-3 w-48 overflow-hidden rounded-lg bg-white py-1 text-rd-text shadow-xl ring-1 ring-black/5 animate-fade-in">
      <Link href="/dashboard" className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-rd-page">
        <User className="h-4 w-4 text-rd-muted" />
        My Account
      </Link>
      <Link href="/dashboard/orders" className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-rd-page">
        <Package className="h-4 w-4 text-rd-muted" />
        Orders
      </Link>
      {isAdmin && (
        <Link href="/admin" className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-rd-page">
          <Settings className="h-4 w-4 text-rd-muted" />
          Admin
        </Link>
      )}
      <hr className="my-1 border-border" />
      <button
        onClick={() => signOutWithNativeCleanup({ callbackUrl: "/" })}
        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-destructive hover:bg-rd-page"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </button>
    </div>
  );

  const countBadge = (count: number) =>
    count > 0 && (
      <span
        className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold leading-none text-rd-red"
        aria-hidden="true"
      >
        {count > 9 ? "9+" : count}
      </span>
    );

  const mobileNavItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Shop", href: "/products", icon: Store },
    { name: "Orders", href: "/dashboard/orders", icon: Package },
    { name: "Cart", href: "/cart", icon: ShoppingCart },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full ${pathname.startsWith("/dashboard") ? "hidden md:block" : ""}`}
      >
        {/* Red masthead */}
        <div className="bg-rd-red text-white">
          <div className="mx-auto max-w-[1440px] px-4 md:px-8">
            {/* Utility links — desktop */}
            <nav
              aria-label="Utility"
              className="hidden items-center justify-end gap-6 pt-2 text-xs font-medium md:flex"
            >
              {utilityLinks.map((link) => (
                <Link key={link.name} href={link.href} className="transition-opacity hover:opacity-80">
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4 py-3 md:gap-8 md:pb-3 md:pt-1">
              {/* Logo */}
              <Link href="/" className="flex shrink-0 items-center" aria-label="Smart Tech Bazaar home">
                <Image
                  src="/logo.png"
                  alt="Smart Tech Bazaar"
                  width={140}
                  height={44}
                  className="h-8 w-auto object-contain brightness-0 invert md:h-11"
                  priority
                />
              </Link>

              {/* Desktop search */}
              <form action="/search" method="GET" role="search" className="hidden flex-1 md:block md:max-w-[730px]">
                <label htmlFor="header-search" className="sr-only">
                  Search products and brands
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-rd-muted" aria-hidden="true" />
                  <input
                    id="header-search"
                    type="text"
                    name="q"
                    placeholder="Search Products & Brands"
                    className="h-10 w-full rounded-full bg-white pl-11 pr-4 text-sm text-rd-text placeholder:text-rd-muted focus:outline-none focus:ring-2 focus:ring-white/60"
                  />
                </div>
              </form>

              {/* Right actions — desktop */}
              <div className="ml-auto hidden items-center gap-7 text-sm font-semibold md:flex">
                <Link href="/about" className="flex items-center gap-2 text-base font-bold transition-opacity hover:opacity-80">
                  <MapPin className="h-4 w-4 fill-current" aria-hidden="true" />
                  Bangalore
                </Link>
                <Link
                  href="/cart"
                  aria-label={`Cart${cartCount > 0 ? ` (${cartCount} items)` : ""}`}
                  className="relative flex items-center gap-2 transition-opacity hover:opacity-80"
                >
                  <span className="relative">
                    <ShoppingCart className="h-5 w-5 fill-current" aria-hidden="true" />
                    {countBadge(cartCount)}
                  </span>
                  Cart
                </Link>
                <Link
                  href="/wishlist"
                  aria-label={`Wishlist${wishlistCount > 0 ? ` (${wishlistCount} items)` : ""}`}
                  className="flex items-center gap-2 transition-opacity hover:opacity-80"
                >
                  <span className="relative">
                    <Heart className="h-5 w-5 fill-current" aria-hidden="true" />
                    {countBadge(wishlistCount)}
                  </span>
                  Wishlist
                </Link>
                {status === "loading" ? (
                  <span className="w-16" aria-hidden="true" />
                ) : session ? (
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowUserMenu((open) => !open);
                      }}
                      aria-expanded={showUserMenu}
                      aria-haspopup="menu"
                      className="flex items-center gap-2 transition-opacity hover:opacity-80"
                    >
                      <User className="h-5 w-5 fill-current" aria-hidden="true" />
                      {firstName}
                    </button>
                    {userMenu}
                  </div>
                ) : (
                  <Link href="/auth/login" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                    <User className="h-5 w-5 fill-current" aria-hidden="true" />
                    Login
                  </Link>
                )}
              </div>

              {/* Right actions — mobile */}
              <div className="ml-auto flex items-center gap-5 md:hidden">
                <Link href="/cart" aria-label={`Cart${cartCount > 0 ? ` (${cartCount} items)` : ""}`} className="relative">
                  <ShoppingCart className="h-6 w-6 fill-current" aria-hidden="true" />
                  {countBadge(cartCount)}
                </Link>
                <Link href="/wishlist" aria-label={`Wishlist${wishlistCount > 0 ? ` (${wishlistCount} items)` : ""}`} className="relative">
                  <Heart className="h-6 w-6 fill-current" aria-hidden="true" />
                  {countBadge(wishlistCount)}
                </Link>
                <Link href={session ? "/dashboard" : "/auth/login"} aria-label={session ? "My account" : "Login"}>
                  <User className="h-6 w-6 fill-current" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Mobile search */}
            <form action="/search" method="GET" role="search" className="pb-3 md:hidden">
              <label htmlFor="header-search-mobile" className="sr-only">
                Search products and brands
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-rd-muted" aria-hidden="true" />
                <input
                  id="header-search-mobile"
                  type="text"
                  name="q"
                  placeholder="Search Products & Brands"
                  className="h-11 w-full rounded-full bg-white pl-11 pr-4 text-sm text-rd-text placeholder:text-rd-muted focus:outline-none"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Category strip */}
        <div className="border-b border-black/5 bg-white">
          <div className="relative mx-auto max-w-[1440px] md:px-8">
            <button
              type="button"
              onClick={() => scrollStrip(-1)}
              aria-label="Scroll categories left"
              className="absolute left-2 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-rd-text transition-colors hover:bg-rd-page md:flex"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div
              ref={stripRef}
              className="scrollbar-hide flex gap-5 overflow-x-auto px-4 py-2.5 md:gap-8 md:px-12 md:py-3"
            >
              {NAV_CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="group flex shrink-0 flex-col items-center gap-1.5 md:flex-row md:gap-3"
                >
                  <span className="relative h-12 w-12 overflow-hidden rounded-full bg-rd-page ring-1 ring-black/5 md:h-10 md:w-10">
                    <Image
                      src={cat.image}
                      alt=""
                      fill
                      sizes="48px"
                      className="object-cover"
                      unoptimized
                    />
                  </span>
                  <span className="max-w-[84px] text-center text-xs font-medium leading-tight text-rd-text transition-colors group-hover:text-rd-red md:max-w-none md:whitespace-nowrap md:text-left md:text-sm">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
            <button
              type="button"
              onClick={() => scrollStrip(1)}
              aria-label="Scroll categories right"
              className="absolute right-2 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-rd-text transition-colors hover:bg-rd-page md:flex"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Category drawer — opened from the bottom nav on mobile */}
      <Sheet open={categorySheetOpen} onOpenChange={setCategorySheetOpen}>
        <SheetContent side="left" className="w-[300px] p-0">
          <SheetHeader className="bg-rd-red p-4">
            <SheetTitle className="text-left">
              <Image
                src="/logo.png"
                alt="Smart Tech Bazaar"
                width={110}
                height={36}
                className="h-8 w-auto object-contain brightness-0 invert"
              />
            </SheetTitle>
          </SheetHeader>

          {session ? (
            <div className="border-b border-border bg-rd-page px-4 py-3">
              <p className="text-sm font-semibold text-rd-text">{session.user?.name}</p>
              <p className="text-xs text-rd-muted">{session.user?.email}</p>
            </div>
          ) : (
            <div className="flex gap-2 border-b border-border px-4 py-3">
              <SheetClose asChild>
                <Link href="/auth/login" className="flex-1 rounded-full border border-rd-red py-2 text-center text-sm font-semibold text-rd-red">
                  Login
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/auth/register" className="flex-1 rounded-full bg-rd-red py-2 text-center text-sm font-semibold text-white">
                  Register
                </Link>
              </SheetClose>
            </div>
          )}

          <nav className="flex-1 overflow-y-auto p-2">
            <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-rd-muted">
              Shop by Category
            </p>
            {NAV_CATEGORIES.map((cat) => (
              <SheetClose asChild key={cat.slug}>
                <Link
                  href={`/category/${cat.slug}`}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-rd-text hover:bg-rd-page"
                >
                  <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-rd-page">
                    <Image src={cat.image} alt="" fill sizes="32px" className="object-cover" unoptimized />
                  </span>
                  {cat.name}
                </Link>
              </SheetClose>
            ))}
            {session && (
              <button
                onClick={() => signOutWithNativeCleanup({ callbackUrl: "/" })}
                className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-rd-page"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            )}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Mobile bottom navigation */}
      <nav
        aria-label="Primary"
        className={`fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white md:hidden ${
          pathname.startsWith("/dashboard") ? "hidden" : ""
        }`}
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="grid h-16 grid-cols-5">
          {mobileNavItems.map((item) => {
            const isActive = pathname === item.href;
            const count = item.href === "/cart" ? cartCount : 0;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center justify-center gap-1 px-1 press-active"
              >
                <span className="relative">
                  <item.icon
                    className={`h-6 w-6 ${isActive ? "fill-rd-navy/15 text-rd-navy" : "text-rd-muted"}`}
                    aria-hidden="true"
                  />
                  {count > 0 && (
                    <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rd-red px-1 text-[10px] font-bold leading-none text-white">
                      {count > 9 ? "9+" : count}
                    </span>
                  )}
                </span>
                <span className={`text-[11px] font-semibold leading-none ${isActive ? "text-rd-navy" : "text-rd-muted"}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setCategorySheetOpen(true)}
            className="relative flex flex-col items-center justify-center gap-1 px-1 press-active"
          >
            <LayoutGrid className="h-6 w-6 text-rd-muted" aria-hidden="true" />
            <span className="text-[11px] font-semibold leading-none text-rd-muted">Category</span>
          </button>
        </div>
      </nav>
    </>
  );
}
