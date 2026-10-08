"use client";

import { useRef } from "react";
import { ChevronRight } from "lucide-react";

export default function ScrollRow({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className="relative">
      <div
        ref={ref}
        className="scrollbar-hide flex snap-x snap-proximity gap-2 overflow-x-auto md:gap-3"
      >
        {children}
      </div>
      <button
        type="button"
        onClick={() => ref.current?.scrollBy({ left: 480, behavior: "smooth" })}
        aria-label="Scroll right"
        className="absolute right-1 top-1/3 hidden h-12 w-9 items-center justify-center rounded-l-md bg-white text-fk-ink shadow-md md:flex"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
