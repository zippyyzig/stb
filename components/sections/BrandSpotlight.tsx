import Image from "next/image";
import Link from "next/link";

interface Brand {
  id: string;
  name: string;
  logo: string;
  slug: string;
}

export default function BrandSpotlight({ brands }: { brands: Brand[] }) {
  if (brands.length === 0) return null;

  return (
    <section aria-labelledby="brand-spotlight-title" className="mx-auto mt-6 max-w-[1200px] px-3 md:mt-8 md:px-4">
      <h2 id="brand-spotlight-title" className="mb-3 text-lg font-bold text-fk-ink md:text-2xl">
        Brands in Spotlight
      </h2>
      <ul className="grid grid-cols-3 gap-2.5 md:grid-cols-6 md:gap-4">
        {brands.slice(0, 6).map((brand) => (
          <li key={brand.id}>
            <Link href={`/brand/${brand.slug}`} className="block overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/10">
              <div className="relative aspect-square bg-white">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  sizes="(min-width: 768px) 180px, 30vw"
                  className="object-contain p-3"
                  unoptimized
                />
              </div>
              <p className="bg-[#6B3FEA] px-1 py-1.5 text-center text-[11px] font-bold text-white md:text-sm">
                Shop now
              </p>
            </Link>
            <p className="mt-1.5 truncate text-center text-xs text-fk-ink/80 md:text-sm">{brand.name}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
