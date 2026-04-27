import Link from "next/link";
import Image from "next/image";
import { Search, Home, ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <Link href="/" className="mb-8 inline-block">
          <Image
            src="/logo.png"
            alt="Smart Tech Bazaar"
            width={140}
            height={48}
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* 404 Illustration */}
        <div className="mb-6">
          <div className="relative mx-auto h-32 w-32">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-7xl font-bold text-primary/10">404</span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Search className="h-8 w-8 text-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        <h1 className="heading-xl mb-3 text-foreground">Page Not Found</h1>
        <p className="body-md mb-8 text-muted-foreground">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It may
          have been moved, deleted, or never existed.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/" className="gap-2">
              <Home className="h-4 w-4" />
              Go to Homepage
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/products" className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              Browse Products
            </Link>
          </Button>
        </div>

        {/* Quick Links */}
        <div className="mt-10 rounded-xl border border-border bg-card p-5">
          <p className="mb-4 text-sm font-medium text-foreground">
            Looking for something specific?
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              href="/category/desktop"
              className="rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary"
            >
              Desktop
            </Link>
            <Link
              href="/category/laptops"
              className="rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary"
            >
              Laptops
            </Link>
            <Link
              href="/category/networking"
              className="rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary"
            >
              Networking
            </Link>
            <Link
              href="/category/security"
              className="rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary"
            >
              Security
            </Link>
            <Link
              href="/brands"
              className="rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary"
            >
              All Brands
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
