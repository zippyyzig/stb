"use client";

import Image from "next/image";
import Link from "next/link";

// Ad banner — Desktop 1500×300 · Mobile 350×150
// Using real uploaded banner: Banner 1500x300 - 1.png
const AD_BANNER = {
  desktop: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Banner%201500x300%20-%201-5NmcGxvD9jw5zErjfu35GlRyNo0rNB.png",
  alt: "Strategic Impact — Canon Printers, Print that commands attention",
  href: "/category/printers",
};

export default function PromoBanner() {
  return (
    <section className="w-full bg-[#F7F8FA] py-3 md:py-5" aria-label="Advertisement banner">
      <div className="mx-auto max-w-[1500px] px-3 md:px-4">
        <Link href={AD_BANNER.href} className="group block w-full overflow-hidden rounded-lg md:rounded-xl shadow-sm">
          {/* Desktop — 1500:300 = 5:1 */}
          <div className="relative hidden md:block" style={{ aspectRatio: "5 / 1" }}>
            <Image
              src={AD_BANNER.desktop}
              alt={AD_BANNER.alt}
              fill
              sizes="100vw"
              className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.01]"
              unoptimized
            />
          </div>
          {/* Mobile — 350:150 = 7:3, same image cropped center */}
          <div className="relative md:hidden" style={{ aspectRatio: "7 / 3" }}>
            <Image
              src={AD_BANNER.desktop}
              alt={AD_BANNER.alt}
              fill
              sizes="100vw"
              className="object-cover object-center"
              unoptimized
            />
          </div>
        </Link>
      </div>
    </section>
  );
}
