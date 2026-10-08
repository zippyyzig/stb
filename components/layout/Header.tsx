"use client";

import { useState, useEffect } from "react";
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
  ChevronDown,
  ChevronRight,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { NAV_CATEGORIES } from "@/lib/nav-categories";
import FestiveLights from "@/components/sections/FestiveLights";

const moreLinks = [
  { name: "Contact us", href: "/support" },
  { name: "Resource Center", href: "/shipping" },
  { name: "About us", href: "/about" },
  { name: "Dealer registration", href: "/auth/register?type=dealer" },
];

function HoverMenu({ trigger, children }: { trigger: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="group relative">
      {trigger}
      <div className="invisible absolute right-0 top-full z-50 w-60 pt-3 opacity-0 transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
        <div className="overflow-hidden rounded-lg bg-white py-1 text-fk-ink shadow-xl ring-1 ring-black/10">
          {children}
        </div>
      </div>
    </div>
  );
}

function MenuLink({ href, icon: Icon, children }: { href: string; icon?: LucideIcon; children: React.ReactNode }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[#F1F3F6]">
      {Icon && <Icon className="h-4 w-4 text-fk-blue" aria-hidden="true" />}
      {children}
    </Link>
  );
}

export default function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [categorySheetOpen, setCategorySheetOpen] = useState(false);

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

  const countBadge = (count: number) =>
    count > 0 && (
      <span
        className="absolute -right-2.5 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FF6161] px-1 text-[10px] font-bold leading-none text-white"
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

  const logoPill = (
    <Link
      href="/"
      aria-label="Smart Tech Bazaar home"
      className="flex h-9 shrink-0 items-center rounded-lg bg-fk-yellow px-3 ring-1 ring-black/5 md:h-11 md:px-4"
    >
      <Image
        src="/logo.png"
        alt="Smart Tech Bazaar"
        width={120}
        height={38}
        className="h-5 w-auto object-contain md:h-6"
        priority
      />
    </Link>
  );

  const locationLink = (
    <Link href="/shipping" className="flex shrink-0 items-center gap-1 text-xs md:text-sm">
      <MapPin className="h-3.5 w-3.5 fill-fk-ink text-fk-ink md:h-4 md:w-4" aria-hidden="true" />
      <span className="hidden font-semibold text-fk-ink sm:inline">Delivering across India</span>
      <span className="font-semibold text-fk-blue">
        <span className="sm:hidden">Pan-India delivery</span>
        <span className="hidden sm:inline">Check pincode</span>
      </span>
      <ChevronRight className="h-3.5 w-3.5 text-fk-blue" aria-hidden="true" />
    </Link>
  );

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.1)] ${
          pathname.startsWith("/dashboard") ? "hidden md:block" : ""
        }`}
      >
        {/* Festive garland */}
        <div className="bg-[#FFF3C4]">
          <FestiveLights count={22} className="md:hidden" />
          <FestiveLights count={64} className="hidden md:flex" />
        </div>

        <div className="bg-gradient-to-b from-[#FFF3C4] to-white md:bg-none">
          <div className="mx-auto max-w-[1200px] px-3 md:px-4">
            {/* Row 1 — product pills + location */}
            <div className="flex items-center justify-between gap-2 pb-2 pt-2 md:pb-3 md:pt-3">
              <div className="flex items-center gap-2">
                {logoPill}
              </div>
              {locationLink}
            </div>

            {/* Row 2 — search + actions */}
            <div className="flex items-center gap-3 pb-2.5 md:gap-6 md:pb-3">
              <form action="/search" method="GET" role="search" className="flex-1">
                <label htmlFor="header-search" className="sr-only">
                  Search products and brands
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-fk-grey" aria-hidden="true" />
                  <input
                    id="header-search"
                    type="text"
                    name="q"
                    placeholder="Search for Products, Brands and More"
                    className="h-10 w-full rounded-xl border-2 border-fk-blue bg-white pl-10 pr-3 text-sm text-fk-ink placeholder:text-fk-grey focus:outline-none md:h-11 md:max-w-[880px]"
                  />
                </div>
              </form>

              {/* Desktop actions */}
              <div className="hidden items-center gap-7 text-base font-medium text-fk-ink md:flex">
                {status === "loading" ? (
                  <span className="w-20" aria-hidden="true" />
                ) : (
                  <HoverMenu
                    trigger={
                      <Link
                        href={session ? "/dashboard" : "/auth/login"}
                        className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-[#F1F3F6]"
                      >
                        <User className="h-5 w-5" aria-hidden="true" />
                        {session ? firstName : "Login"}
                        <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" aria-hidden="true" />
                      </Link>
                    }
                  >
                    {!session && (
                      <div className="flex items-center justify-between border-b border-black/10 px-4 py-2.5 text-sm">
                        <span>New customer?</span>
                        <Link href="/auth/register" className="font-semibold text-fk-blue">
                          Sign Up
                        </Link>
                      </div>
                    )}
                    <MenuLink href={session ? "/dashboard" : "/auth/login"} icon={User}>
                      My Profile
                    </MenuLink>
                    <MenuLink href="/dashboard/orders" icon={Package}>
                      Orders
                    </MenuLink>
                    <MenuLink href="/wishlist" icon={Heart}>
                      Wishlist{wishlistCount > 0 ? ` (${wishlistCount})` : ""}
                    </MenuLink>
                    {isAdmin && (
                      <MenuLink href="/admin" icon={Settings}>
                        Admin
                      </MenuLink>
                    )}
                    {session && (
                      <button
                        onClick={() => signOutWithNativeCleanup({ callbackUrl: "/" })}
                        className="flex w-full items-center gap-3 border-t border-black/10 px-4 py-2.5 text-sm text-destructive hover:bg-[#F1F3F6]"
                      >
                        <LogOut className="h-4 w-4" aria-hidden="true" />
                        Sign Out
                      </button>
                    )}
                  </HoverMenu>
                )}

                <HoverMenu
                  trigger={
                    <button type="button" className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 hover:bg-[#F1F3F6]">
                      More
                      <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" aria-hidden="true" />
                    </button>
                  }
                >
                  {moreLinks.map((link) => (
                    <MenuLink key={link.name} href={link.href}>
                      {link.name}
                    </MenuLink>
                  ))}
                </HoverMenu>

                <Link
                  href="/cart"
                  aria-label={`Cart${cartCount > 0 ? ` (${cartCount} items)` : ""}`}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-[#F1F3F6]"
                >
                  <span className="relative">
                    <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                    {countBadge(cartCount)}
                  </span>
                  Cart
                </Link>
              </div>

              {/* Mobile actions */}
              <div className="flex items-center gap-4 text-fk-ink md:hidden">
                <Link href="/wishlist" aria-label={`Wishlist${wishlistCount > 0 ? ` (${wishlistCount} items)` : ""}`} className="relative">
                  <Heart className="h-6 w-6" aria-hidden="true" />
                  {countBadge(wishlistCount)}
                </Link>
                <Link
                  href="/cart"
                  aria-label={`Cart${cartCount > 0 ? ` (${cartCount} items)` : ""}`}
                  className="flex items-center gap-1.5 text-sm font-medium"
                >
                  <span className="relative">
                    <ShoppingCart className="h-6 w-6" aria-hidden="true" />
                    {countBadge(cartCount)}
                  </span>
                  Cart
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Category strip */}
        <nav aria-label="Categories" className="border-t border-black/5 bg-white">
          <ul className="scrollbar-hide mx-auto flex max-w-[1200px] overflow-x-auto px-1 md:px-2">
            {[{ slug: "", name: "For You", icon: ShoppingBag }, ...NAV_CATEGORIES.map((cat) => ({ slug: cat.slug, name: cat.name, icon: null as LucideIcon | null, image: cat.image }))].map((item) => {
              const href = item.slug ? `/category/${item.slug}` : "/";
              const isActive = item.slug ? pathname.startsWith(href) : pathname === "/";
              const Icon = item.icon;
              return (
                <li key={item.name} className="shrink-0">
                  <Link
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    className="flex w-[78px] flex-col items-center gap-1 pt-2 md:w-[88px]"
                  >
                    <span
                      className={`relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl md:h-11 md:w-11 ${
                        isActive ? "bg-[#DCE8FF]" : "bg-[#F6F7F9]"
                      }`}
                    >
                      {Icon ? (
                        <Icon className="h-5 w-5 text-fk-blue" aria-hidden="true" />
                      ) : (
                        <Image
                          src={"image" in item ? item.image : ""}
                          alt=""
                          fill
                          sizes="44px"
                          className="object-cover"
                          unoptimized
                        />
                      )}
                    </span>
                    <span
                      className={`w-full truncate px-0.5 text-center text-xs md:text-[13px] ${
                        isActive ? "font-bold text-fk-ink" : "font-medium text-fk-ink/80"
                      }`}
                      title={item.name}
                    >
                      {item.name}
                    </span>
                    <span className={`h-[3px] w-full rounded-t-full ${isActive ? "bg-fk-blue" : "bg-transparent"}`} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      {/* Category drawer — opened from the bottom nav on mobile */}
      <Sheet open={categorySheetOpen} onOpenChange={setCategorySheetOpen}>
        <SheetContent side="left" className="w-[300px] p-0">
          <SheetHeader className="bg-fk-blue p-4">
            <SheetTitle className="text-left text-white">
              <span className="inline-flex h-9 items-center rounded-lg bg-fk-yellow px-3">
                <Image src="/logo.png" alt="Smart Tech Bazaar" width={110} height={36} className="h-5 w-auto object-contain" />
              </span>
            </SheetTitle>
          </SheetHeader>

          {session ? (
            <div className="border-b border-border bg-[#F1F3F6] px-4 py-3">
              <p className="text-sm font-semibold text-fk-ink">{session.user?.name}</p>
              <p className="text-xs text-fk-grey">{session.user?.email}</p>
            </div>
          ) : (
            <div className="flex gap-2 border-b border-border px-4 py-3">
              <SheetClose asChild>
                <Link href="/auth/login" className="flex-1 rounded-lg border border-fk-blue py-2 text-center text-sm font-semibold text-fk-blue">
                  Login
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/auth/register" className="flex-1 rounded-lg bg-fk-blue py-2 text-center text-sm font-semibold text-white">
                  Register
                </Link>
              </SheetClose>
            </div>
          )}

          <nav className="flex-1 overflow-y-auto p-2">
            <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-fk-grey">
              Shop by Category
            </p>
            {NAV_CATEGORIES.map((cat) => (
              <SheetClose asChild key={cat.slug}>
                <Link
                  href={`/category/${cat.slug}`}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-fk-ink hover:bg-[#F1F3F6]"
                >
                  <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-[#F1F3F6]">
                    <Image src={cat.image} alt="" fill sizes="32px" className="object-cover" unoptimized />
                  </span>
                  {cat.name}
                </Link>
              </SheetClose>
            ))}
            {session && (
              <button
                onClick={() => signOutWithNativeCleanup({ callbackUrl: "/" })}
                className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-[#F1F3F6]"
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
                    className={`h-6 w-6 ${isActive ? "fill-fk-blue/15 text-fk-blue" : "text-fk-grey"}`}
                    aria-hidden="true"
                  />
                  {count > 0 && (
                    <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FF6161] px-1 text-[10px] font-bold leading-none text-white">
                      {count > 9 ? "9+" : count}
                    </span>
                  )}
                </span>
                <span className={`text-[11px] font-semibold leading-none ${isActive ? "text-fk-blue" : "text-fk-grey"}`}>
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
            <LayoutGrid className="h-6 w-6 text-fk-grey" aria-hidden="true" />
            <span className="text-[11px] font-semibold leading-none text-fk-grey">Category</span>
          </button>
        </div>
      </nav>
    </>
  );
}
