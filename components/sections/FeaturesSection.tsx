import { BadgeCheck, ShieldCheck, Truck } from "lucide-react";

const highlights = [
  { icon: Truck, title: "Fastest Delivery", detail: "& Doorstep Service" },
  { icon: ShieldCheck, title: "Secure Payments", detail: "& GST Invoicing" },
  { icon: BadgeCheck, title: "100% Genuine", detail: "Products & Warranty" },
];

export default function FeaturesSection() {
  return (
    <section className="mx-auto mt-10 max-w-[1440px] px-4 md:mt-14 md:px-8" aria-label="Why shop with us">
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 md:px-10">
        {highlights.map(({ icon: Icon, title, detail }) => (
          <li
            key={title}
            className="relative flex items-center gap-4 bg-white px-6 py-5"
          >
            <span className="pointer-events-none absolute left-0 top-0 h-3/5 w-1/5 border-l border-t border-rd-red" aria-hidden="true" />
            <span className="pointer-events-none absolute bottom-0 right-0 h-3/5 w-2/3 border-b border-r border-rd-navy" aria-hidden="true" />
            <Icon className="h-10 w-10 shrink-0 text-rd-text" strokeWidth={1.5} aria-hidden="true" />
            <p className="text-lg font-extrabold uppercase leading-tight tracking-tight text-rd-text md:text-xl">
              {title}
              <span className="block">{detail}</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
