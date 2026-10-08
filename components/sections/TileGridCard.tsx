import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FK_GRADIENTS, type FkVariant } from "./fk-theme";

export interface TileItem {
  id: string;
  image: string;
  label: string;
  caption: string;
  href: string;
}

interface TileGridCardProps {
  title: string;
  href?: string;
  items: TileItem[];
  variant?: FkVariant;
}

export default function TileGridCard({ title, href, items, variant = "blue" }: TileGridCardProps) {
  if (items.length < 2) return null;

  return (
    <section aria-label={title} className="mx-auto mt-4 max-w-[1200px] px-3 md:mt-6 md:px-4">
      <div className={`relative overflow-hidden rounded-2xl p-3 md:p-4 ${FK_GRADIENTS[variant]}`}>
        <div aria-hidden="true" className="pointer-events-none absolute -left-10 -top-14 h-40 w-40 rounded-full bg-white/10 blur-xl" />

        <div className="relative mb-3 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold leading-tight text-white md:text-2xl">{title}</h2>
          {href && (
            <Link
              href={href}
              aria-label={`View all ${title}`}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-fk-ink shadow-sm md:h-9 md:w-9"
            >
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        <ul className="relative grid grid-cols-2 gap-x-2.5 gap-y-3 rounded-xl bg-white p-2.5 md:grid-cols-4 md:gap-x-3 md:p-3">
          {items.slice(0, 4).map((item) => (
            <li key={item.id}>
              <Link href={item.href} className="block">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-[#F5F5F5]">
                  <Image
                    src={item.image}
                    alt={item.label}
                    fill
                    sizes="(min-width: 768px) 280px, 45vw"
                    className="object-contain p-2"
                    unoptimized
                  />
                </div>
                <p className="mt-1.5 truncate text-xs text-fk-ink/80 md:text-sm">{item.label}</p>
                <p className="truncate text-sm font-bold text-fk-ink md:text-base">{item.caption}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
