export interface Category {
  id: string;
  name: string;
  image: string;
  slug: string;
}

export const categories: Category[] = [
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
    name: "Printers & Scanners",
    image: "https://images.pexels.com/photos/3394653/pexels-photo-3394653.jpeg?w=400&h=300&fit=crop",
    slug: "printers-scanners",
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
    name: "Cables & Connectors",
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

export const navCategories = [
  "Desktop",
  "Laptop",
  "Storage",
  "Display",
  "Peripherals",
  "Printers & Scanners",
  "Security",
  "Networking",
  "Software",
  "Cables",
  "Telecom",
];
