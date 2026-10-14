import {
  AppWindow,
  Cable,
  Computer,
  Headphones,
  HardDrive,
  Keyboard,
  Laptop,
  Monitor,
  Plug,
  Printer,
  Recycle,
  Router,
  ShieldCheck,
  Smartphone,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  desktop: Computer,
  laptops: Laptop,
  storage: HardDrive,
  display: Monitor,
  peripherals: Keyboard,
  "printers-scanners": Printer,
  security: ShieldCheck,
  networking: Router,
  software: AppWindow,
  mobility: Smartphone,
  cables: Cable,
  "connectors-converters": Plug,
  accessories: Headphones,
  "refurbished-laptops": Recycle,
};

export function getCategoryIcon(slug: string): LucideIcon {
  return CATEGORY_ICONS[slug] ?? Sparkles;
}
