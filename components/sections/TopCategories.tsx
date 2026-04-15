import Image from "next/image";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  image: string;
  slug: string;
}

const categories: Category[] = [
  {
    id: "desktop",
    name: "Desktop",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&h=300&fit=crop",
    slug: "desktop",
  },
  {
    id: "laptop",
    name: "Laptop",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
    slug: "laptop",
  },
  {
    id: "storage",
    name: "Storage",
    image: "https://images.unsplash.com/photo-1653179767378-98bb414f9bfd?w=400&h=300&fit=crop",
    slug: "storage",
  },
  {
    id: "display",
    name: "Display",
    image: "https://images.unsplash.com/photo-1572476359541-2a41ec8405e5?w=400&h=300&fit=crop",
    slug: "display",
  },
  {
    id: "peripherals",
    name: "Peripherals",
    image: "https://images.unsplash.com/photo-1662758392656-0e5d4b0f53fb?w=400&h=300&fit=crop",
    slug: "peripherals",
  },
  {
    id: "printers",
    name: "Printers",
    image: "https://images.pexels.com/photos/3394653/pexels-photo-3394653.jpeg?w=400&h=300&fit=crop",
    slug: "printers",
  },
  {
    id: "security",
    name: "Security",
    image: "https://images.unsplash.com/photo-1576088137266-a6cba01057ed?w=400&h=300&fit=crop",
    slug: "security",
  },
  {
    id: "networking",
    name: "Networking",
    image: "https://images.unsplash.com/photo-1544985562-128e7b377a21?w=400&h=300&fit=crop",
    slug: "networking",
  },
  {
    id: "software",
    name: "Software",
    image: "https://images.unsplash.com/photo-1585247226801-bc613c441316?w=400&h=300&fit=crop",
    slug: "software",
  },
  {
    id: "cables",
    name: "Cables",
    image: "https://images.unsplash.com/photo-1544985562-128e7b377a21?w=400&h=300&fit=crop",
    slug: "cables",
  },
  {
    id: "audio",
    name: "Audio",
    image: "https://images.pexels.com/photos/3394653/pexels-photo-3394653.jpeg?w=400&h=300&fit=crop",
    slug: "audio",
  },
  {
    id: "telecom",
    name: "Telecom",
    image: "https://images.unsplash.com/photo-1726033589589-c4628bbba368?w=400&h=300&fit=crop",
    slug: "telecom",
  },
];

export default function TopCategories() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      {/* Section Header */}
      <div className="mb-8 flex items-center gap-4">
        <h2 className="heading-lg">Top Categories</h2>
        <div className="h-1 w-16 rounded-full bg-primary" />
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="group flex flex-col items-center gap-3 rounded-xl bg-card p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl bg-stb-sky p-2 transition-transform group-hover:scale-105">
              <Image
                src={category.image}
                alt={category.name}
                width={96}
                height={96}
                className="h-full w-full rounded-lg object-cover"
                unoptimized
              />
            </div>
            <span className="heading-sm text-center text-sm text-foreground">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
