import Image from "next/image";
import Link from "next/link";

export interface DealTile {
  id: string;
  title: string;
  href: string;
  image: string;
  startingPrice?: number;
  maxDiscount?: number;
}

interface SpecialDealsProps {
  deals: DealTile[];
}

export default function SpecialDeals({ deals }: SpecialDealsProps) {
  if (deals.length === 0) return null;

  return (
    <section className="mx-auto mt-4 max-w-[1440px] px-4 md:mt-6 md:px-8" aria-labelledby="special-deals-title">
      <div className="rounded-2xl bg-white px-3 py-4 md:px-10 md:py-6">
        <h2 id="special-deals-title" className="mb-3 text-lg font-bold text-rd-text md:mb-4 md:text-2xl">
          Special Deals
        </h2>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
          {deals.slice(0, 4).map((deal) => (
            <Link
              key={deal.id}
              href={deal.href}
              className="group block rounded-xl bg-[linear-gradient(to_bottom,var(--rd-sky)_50%,var(--rd-red)_50%)] p-[3px] transition-transform hover:-translate-y-0.5"
            >
              <div className="flex h-full flex-col rounded-[9px] bg-white px-2.5 pb-3 pt-3 md:px-4 md:pb-4 md:pt-4">
                <h3 className="line-clamp-1 text-center text-sm font-bold text-rd-text md:text-lg">{deal.title}</h3>
                <div className="mx-auto mt-1.5 h-px w-12 bg-rd-text/70" />
                {deal.startingPrice ? (
                  <p className="mt-1.5 text-center text-[10px] font-medium uppercase tracking-wide text-rd-text md:text-xs">
                    Starting from{" "}
                    <span className="text-sm font-bold md:text-lg">
                      ₹{deal.startingPrice.toLocaleString("en-IN")}
                    </span>
                    *
                  </p>
                ) : (
                  <p className="mt-1.5 text-center text-[10px] font-medium uppercase tracking-wide text-rd-text md:text-xs">
                    Explore the range
                  </p>
                )}

                <div className="mt-2 flex flex-1 items-center justify-center rounded-lg bg-[#E3F4FC] p-3 md:mt-3">
                  <div className="relative aspect-square w-4/5">
                    <Image
                      src={deal.image}
                      alt={deal.title}
                      fill
                      sizes="(max-width: 768px) 40vw, 240px"
                      className="object-contain transition-transform duration-300 group-hover:scale-105"
                      unoptimized
                    />
                  </div>
                </div>

                <p className="mt-2.5 text-center text-xs text-rd-text md:mt-3 md:text-base">
                  {deal.maxDiscount && deal.maxDiscount > 0 ? (
                    <>
                      Up to <span className="font-bold">{deal.maxDiscount}% off</span>*
                    </>
                  ) : (
                    <span className="font-semibold">Shop now</span>
                  )}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
