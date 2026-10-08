import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ScrollRow from "./ScrollRow";
import { FK_GRADIENTS, FK_PILLS, type FkVariant } from "./fk-theme";

export interface DealStripItem {
  id: string;
  image: string;
  title: string;
  label: string;
  href: string;
}

interface DealStripProps {
  title: string;
  href?: string;
  items: DealStripItem[];
  variant?: FkVariant;
}

export default function DealStrip({ title, href, items, variant = "blue" }: DealStripProps) {
  if (items.length === 0) return null;

  return (
    <section aria-label={title} className="mx-auto mt-4 max-w-[1200px] px-3 md:mt-6 md:px-4">
      <div className={`relative overflow-hidden rounded-2xl p-3 md:p-4 ${FK_GRADIENTS[variant]}`}>
        <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-xl" />

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

        <div className="relative">
          <ScrollRow>
            {items.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="w-[104px] shrink-0 snap-start md:w-[158px]"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-t-lg bg-white">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="158px"
                    className="object-contain p-2"
                    unoptimized
                  />
                </div>
                <p className={`truncate rounded-b-lg px-1 py-1.5 text-center text-xs font-bold text-white md:text-sm ${FK_PILLS[variant]}`}>
                  {item.label}
                </p>
                <p className="mt-1.5 truncate px-0.5 text-center text-xs text-white/90 md:text-sm">{item.title}</p>
              </Link>
            ))}
          </ScrollRow>
        </div>
      </div>
    </section>
  );
}
