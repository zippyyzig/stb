import Image from "next/image";
import Link from "next/link";

interface CategoryTile {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount?: number;
}

interface CategoryTileGridProps {
  title: string;
  categories: CategoryTile[];
}

export default function CategoryTileGrid({ title, categories }: CategoryTileGridProps) {
  const tiles = categories.slice(0, 8);
  if (tiles.length === 0) return null;

  return (
    <section className="mx-auto mt-8 max-w-[1440px] px-4 md:mt-10 md:px-8" aria-labelledby="category-grid-title">
      <div className="md:px-10">
        <h2 id="category-grid-title" className="mb-3 text-lg font-bold text-rd-text md:mb-4 md:text-2xl">
          {title}
        </h2>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {tiles.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group flex flex-col items-center rounded-xl bg-rd-cyan px-3 pb-4 pt-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-transform hover:-translate-y-0.5 md:px-5"
            >
              <h3 className="line-clamp-1 text-center text-sm font-bold text-rd-text md:text-lg">{cat.name}</h3>
              <div className="relative mt-3 flex aspect-square w-full max-w-[220px] items-center justify-center rounded-full bg-rd-cyan-deep/60 p-3">
                <div className="relative h-full w-full overflow-hidden rounded-full">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 40vw, 220px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized
                  />
                </div>
              </div>
              <div className="mt-4 h-px w-4/5 bg-rd-text/60" />
              <p className="mt-2 text-xs text-rd-text md:text-base">
                {cat.productCount && cat.productCount > 0 ? (
                  <>
                    <span className="font-bold">{cat.productCount}+</span> products
                  </>
                ) : (
                  <span className="font-semibold">Shop now</span>
                )}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
