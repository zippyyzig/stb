import { Truck, FileText, RotateCcw, Users } from "lucide-react";

const promos = [
  {
    icon: Truck,
    title: "Free Shipping",
    desc: "On orders above ₹5,000",
    color: "text-primary",
    bg: "bg-stb-primary-light",
  },
  {
    icon: FileText,
    title: "GST Invoice",
    desc: "Tax-compliant invoices",
    color: "text-stb-success",
    bg: "bg-stb-success/10",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    desc: "7-day hassle-free returns",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Users,
    title: "Bulk Orders",
    desc: "Special dealer pricing",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
];

export default function PromoGrid() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {promos.map(({ icon: Icon, title, desc, color, bg }) => (
          <div
            key={title}
            className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-sm"
          >
            <div className={`shrink-0 rounded-lg ${bg} p-2.5`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div>
              <p className="heading-sm text-sm">{title}</p>
              <p className="body-sm text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
