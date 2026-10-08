import Link from "next/link";
import { Handshake, Heart, Headset, LayoutGrid, Package, Recycle, ShoppingCart, Store } from "lucide-react";

const SHORTCUTS = [
  { name: "My Orders", href: "/dashboard/orders", Icon: Package },
  { name: "Wishlist", href: "/wishlist", Icon: Heart },
  { name: "Cart", href: "/cart", Icon: ShoppingCart },
  { name: "Support", href: "/support", Icon: Headset },
  { name: "Refurbished", href: "/category/refurbished-laptops", Icon: Recycle },
  { name: "All Brands", href: "/brands", Icon: Store },
  { name: "Categories", href: "/categories", Icon: LayoutGrid },
  { name: "Dealer Sign-up", href: "/auth/register?type=dealer", Icon: Handshake },
];

export default function ShortcutRow() {
  return (
    <nav aria-label="Quick links" className="mx-auto mt-5 max-w-[1200px] px-3 md:mt-8 md:px-4">
      <ul className="scrollbar-hide flex gap-4 overflow-x-auto pb-2 md:justify-between md:gap-6">
        {SHORTCUTS.map(({ name, href, Icon }) => (
          <li key={name} className="shrink-0">
            <Link href={href} className="flex w-[64px] flex-col items-center gap-1.5 md:w-[84px]">
              <span className="relative flex h-14 w-14 items-center justify-center">
                <span aria-hidden="true" className="absolute inset-x-1 bottom-0 h-5 rounded-full bg-[#FFC9DD]" />
                <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-fk-yellow text-fk-ink shadow-sm md:h-12 md:w-12">
                  <Icon className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
                </span>
              </span>
              <span className="text-center text-[11px] font-semibold leading-tight text-fk-ink md:text-xs">{name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
