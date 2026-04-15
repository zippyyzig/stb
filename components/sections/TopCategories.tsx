import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Category {
  id: string;
  name: string;
  image: string;
  slug: string;
  productCount: number;
}

const categories: Category[] = [
  {
    id: "desktop",
    name: "Desktop",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&h=400&fit=crop",
    slug: "desktop",
    productCount: 124,
  },
  {
    id: "laptop",
    name: "Laptop",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
    slug: "laptop",
    productCount: 89,
  },
  {
    id: "storage",
    name: "Storage",
    image: "https://images.unsplash.com/photo-1653179767378-98bb414f9bfd?w=400&h=400&fit=crop",
    slug: "storage",
    productCount: 156,
  },
  {
    id: "display",
    name: "Display",
    image: "https://images.unsplash.com/photo-1572476359541-2a41ec8405e5?w=400&h=400&fit=crop",
    slug: "display",
    productCount: 67,
  },
  {
    id: "peripherals",
    name: "Peripherals",
    image: "https://images.unsplash.com/photo-1662758392656-0e5d4b0f53fb?w=400&h=400&fit=crop",
    slug: "peripherals",
    productCount: 234,
  },
  {
    id: "printers",
    name: "Printers",
    image: "https://images.pexels.com/photos/3394653/pexels-photo-3394653.jpeg?w=400&h=400&fit=crop",
    slug: "printers",
    productCount: 45,
  },
  {
    id: "security",
    name: "Security",
    image: "https://images.unsplash.com/photo-1576088137266-a6cba01057ed?w=400&h=400&fit=crop",
    slug: "security",
    productCount: 178,
  },
  {
    id: "networking",
    name: "Networking",
    image: "https://images.unsplash.com/photo-1544985562-128e7b377a21?w=400&h=400&fit=crop",
    slug: "networking",
    productCount: 92,
  },
];

export default function TopCategories() {
  return (
    <section className="border-y border-border bg-muted/30 py-16">
      <div className="mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="label-uppercase mb-2 block text-muted-foreground">Browse by</span>
            <h2 className="heading-xl">Top Categories</h2>
          </div>
          <Link
            href="/categories"
            className="body-sm group flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            View all categories
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-card transition-all hover:shadow-lg"
            >
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden bg-muted">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
              </div>
              
              {/* Content Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3 className="heading-md text-white">{category.name}</h3>
                <p className="body-sm text-white/70">{category.productCount} products</p>
              </div>

              {/* Hover Arrow */}
              <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-card opacity-0 shadow-lg transition-all group-hover:opacity-100">
                <ArrowRight className="h-4 w-4 text-foreground" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
