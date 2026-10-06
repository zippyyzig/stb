import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Brand {
  id: string;
  name: string;
  logo: string;
  slug: string;
}

interface BrandStripProps {
  brands: Brand[];
}

export default function BrandStrip({ brands }: BrandStripProps) {
  if (brands.length === 0) return null;

  return (
    <section className="mx-auto mt-8 max-w-[1440px] px-4 md:mt-10 md:px-8" aria-labelledby="brands-title">
      <div className="rounded-2xl bg-white px-4 py-4 md:px-10 md:py-6">
        <div className="mb-3 flex items-center justify-between md:mb-4">
          <h2 id="brands-title" className="text-lg font-bold text-rd-text md:text-2xl">
            Top Brands
          </h2>
          <Link href="/brands" className="flex items-center gap-1 text-sm font-semibold text-rd-navy hover:underline">
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <ul className="scrollbar-hide flex gap-3 overflow-x-auto pb-1 md:grid md:grid-cols-6 md:gap-4 md:overflow-visible lg:grid-cols-8">
          {brands.slice(0, 16).map((brand) => (
            <li key={brand.id} className="shrink-0 md:shrink">
              <Link
                href={`/brand/${brand.slug}`}
                className="flex h-16 w-28 items-center justify-center rounded-lg border border-[#E4E4E4] bg-white p-3 transition-shadow hover:shadow-md md:h-20 md:w-full"
                aria-label={brand.name}
              >
                <div className="relative h-full w-full">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    fill
                    sizes="140px"
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
