import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function FestiveHero() {
  return (
    <section aria-label="Festive offers" className="mx-auto mt-3 max-w-[1200px] px-3 md:mt-5 md:px-4">
      <div className="relative isolate overflow-hidden rounded-2xl bg-fk-plum">
        <Image
          src="/images/festive-banner.png"
          alt=""
          fill
          priority
          sizes="(min-width: 1200px) 1168px, 100vw"
          className="object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1D0A3A]/90 via-[#1D0A3A]/55 to-transparent" />

        <Sparkles
          aria-hidden="true"
          className="fk-float absolute right-6 top-4 h-6 w-6 text-fk-gold md:right-24 md:top-8 md:h-9 md:w-9"
        />
        <Sparkles
          aria-hidden="true"
          className="fk-float absolute right-16 top-16 h-4 w-4 text-white/80 [animation-delay:0.8s] md:right-48 md:top-24 md:h-6 md:w-6"
        />

        <div className="relative flex min-h-[200px] flex-col items-start justify-center gap-2.5 px-5 py-6 md:min-h-[260px] md:gap-4 md:px-12">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-fk-yellow px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-fk-ink md:text-xs">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Festive Tech Fest
          </span>
          <h2 className="max-w-[15ch] text-balance text-[26px] font-extrabold leading-[1.1] text-white md:max-w-[22ch] md:text-5xl">
            Light up your setup this festive season
          </h2>
          <p className="max-w-[28ch] text-xs text-white/85 md:max-w-[44ch] md:text-base">
            Laptops, desktops, storage and more from trusted brands.
          </p>
          <Link
            href="/products"
            className="mt-1 inline-flex items-center gap-2 rounded-lg bg-fk-yellow px-5 py-2.5 text-sm font-bold text-fk-ink shadow-lg transition-transform hover:scale-[1.03] md:px-7 md:py-3"
          >
            Shop now
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
