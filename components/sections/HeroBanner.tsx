import BannerCarousel, { type BannerItem } from "./BannerCarousel";

interface HeroBannerProps {
  banners?: BannerItem[];
}

// Default slider images — Desktop 1500×450 · Mobile 450×300
const DEFAULT_SLIDES: BannerItem[] = [
  {
    id: "display-banner",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Display%20Banner%201500x450.jpg-qH4BlgbMdr3xa4HXaH5iA5zYvxZqPW.jpeg",
    alt: "Experience Crystal-Clear Displays and Immersive Visuals",
    href: "/category/display",
  },
  {
    id: "laptops-banner",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Laptops%20Banner%201500x450-Recovered.jpg-QMLDAo6rpXnIS4BkiMXvkpOD2QUV0m.jpeg",
    alt: "Power Meets Performance - Next-Gen laptops for Work, Gaming & Creativity",
    href: "/category/laptop",
  },
  {
    id: "storage-banner",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/storage%20Banner%201500x450.jpg-EtvfDlF2RiTTXenqrp4LgEW9Gc5P9K.jpeg",
    alt: "Protect your Digital world with ultra-fast SSDs and high-capacity storage",
    href: "/category/storage",
  },
];

export default function HeroBanner({ banners }: HeroBannerProps) {
  const slides = banners && banners.length > 0 ? banners : DEFAULT_SLIDES;

  return (
    <BannerCarousel
      banners={slides}
      label="Featured promotions"
      desktopRatio="10 / 3"
      mobileRatio="3 / 2"
      priorityFirst
      className="pt-3 md:pt-4"
    />
  );
}
