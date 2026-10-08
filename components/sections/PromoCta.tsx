import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

interface PromoCtaProps {
  eyebrow: string;
  title: string;
  href: string;
}

export default function PromoCta({ eyebrow, title, href }: PromoCtaProps) {
  return (
    <section aria-label={title} className="mx-auto mt-4 max-w-[1200px] px-3 md:mt-6 md:px-4">
      <Link
        href={href}
        className="relative flex h-[92px] items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-r from-[#3B0F5C] via-[#6D2BD9] to-[#F08A24] px-5 md:h-[150px] md:px-12"
      >
        <Sparkles aria-hidden="true" className="fk-float absolute left-[48%] top-3 h-5 w-5 text-fk-gold md:h-8 md:w-8" />
        <Sparkles aria-hidden="true" className="fk-float absolute bottom-3 left-[30%] h-4 w-4 text-white/70 [animation-delay:1s] md:h-6 md:w-6" />
        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80 md:text-sm">{eyebrow}</p>
          <p className="mt-0.5 text-2xl font-extrabold uppercase leading-none tracking-tight text-fk-yellow md:text-5xl">
            {title}
          </p>
        </div>
        <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-fk-ink md:h-14 md:w-14">
          <ArrowRight className="h-5 w-5 md:h-7 md:w-7" aria-hidden="true" />
        </span>
      </Link>
    </section>
  );
}
