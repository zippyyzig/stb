import { useState } from "react";
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
import { navCategories } from "@/data/categories";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 w-full bg-card shadow-xs">
      {/* Top Bar */}
      <div className="bg-stb-navy text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5">
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="body-sm flex items-center gap-1.5 text-white/80 transition-colors hover:text-white"
            >
              <Phone className="h-3.5 w-3.5" />
              B2B
            </a>
            <a
              href="#"
              className="body-sm flex items-center gap-1.5 text-white/80 transition-colors hover:text-white"
            >
              <Phone className="h-3.5 w-3.5" />
              B2C
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="body-sm flex items-center gap-1.5 text-white/80 transition-colors hover:text-white"
            >
              <MapPin className="h-3.5 w-3.5" />
              Location
            </a>
            <a
              href="#"
              className="body-sm flex items-center gap-1.5 text-white/80 transition-colors hover:text-white"
            >
              <LogIn className="h-3.5 w-3.5" />
              Login
            </a>
            <a
              href="#"
              className="body-sm flex items-center gap-1.5 text-white/80 transition-colors hover:text-white"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Register
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:gap-8">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger
            render={<Button variant="ghost" size="icon" className="lg:hidden" />}
          >
            <Menu className="h-6 w-6" />
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] p-0">
            <SheetHeader className="border-b p-4">
              <SheetTitle className="heading-md text-primary">STB</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col p-2">
              {navCategories.map((cat) => (
                <a
                  key={cat}
                  href="#"
                  className="body-md rounded-lg px-4 py-2.5 text-foreground transition-colors hover:bg-muted"
                >
                  {cat}
                </a>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <a href="#" className="flex shrink-0 items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <span className="font-heading text-lg font-bold text-white">S</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="font-heading text-xl font-bold text-primary">STB</h1>
            <p className="body-sm -mt-0.5 text-muted-foreground">Technologies</p>
          </div>
        </a>

        {/* Search */}
        <div className="relative flex flex-1 items-center">
          <Input
            type="text"
            placeholder="Search products, brands and more..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 rounded-full border-border bg-muted pl-5 pr-12 focus-visible:ring-primary"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-12 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <Button
            size="icon"
            className="absolute right-1 h-9 w-9 rounded-full bg-primary hover:bg-stb-primary-dark"
          >
            <Search className="h-4 w-4 text-white" />
          </Button>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="relative text-foreground">
            <Heart className="h-5 w-5" />
            <span className="absolute -top-0.5 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
              0
            </span>
          </Button>
          <Button variant="ghost" size="icon" className="relative text-foreground">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-0.5 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
              0
            </span>
          </Button>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl overflow-x-auto px-4">
          <nav className="flex items-center gap-1 py-2">
            {navCategories.map((cat) => (
              <a
                key={cat}
                href="#"
                className="label-uppercase shrink-0 rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
              >
                {cat}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
