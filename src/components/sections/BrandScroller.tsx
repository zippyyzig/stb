const brands = [
  { name: "TP-Link", color: "#1E88E5" },
  { name: "D-Link", color: "#C62828" },
  { name: "Netgear", color: "#0D47A1" },
  { name: "Cisco", color: "#00509E" },
  { name: "Hikvision", color: "#E53935" },
  { name: "CP Plus", color: "#1565C0" },
  { name: "Dahua", color: "#D32F2F" },
  { name: "Seagate", color: "#1A5276" },
  { name: "Western Digital", color: "#2980B9" },
  { name: "Logitech", color: "#333" },
  { name: "HP", color: "#0096D6" },
  { name: "Canon", color: "#CC0000" },
  { name: "Epson", color: "#0070C0" },
  { name: "Intel", color: "#0071C5" },
  { name: "AMD", color: "#ED1C24" },
  { name: "Samsung", color: "#1428A0" },
  { name: "Kingston", color: "#DF1121" },
  { name: "Quick Heal", color: "#C0392B" },
  { name: "Kaspersky", color: "#006D5B" },
  { name: "Norton", color: "#FFAD00" },
];

export default function BrandScroller() {
  // Duplicate for seamless loop
  const duplicated = [...brands, ...brands];

  return (
    <section className="border-t border-border bg-card py-8">
      <div className="mx-auto mb-6 max-w-7xl px-4">
        <div className="flex items-center gap-4">
          <h2 className="heading-lg">Our Trusted Brands</h2>
          <div className="h-1 w-16 rounded-full bg-primary" />
        </div>
      </div>

      <div className="relative overflow-hidden">
        {/* Fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-card to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-card to-transparent" />

        <div className="brand-track flex w-max gap-3">
          {duplicated.map((brand, i) => (
            <a
              key={`${brand.name}-${i}`}
              href="#"
              className="group flex shrink-0 items-center gap-2 rounded-full border border-border bg-muted px-5 py-2.5 shadow-xs transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white hover:shadow-md"
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: brand.color }}
              />
              <span className="body-sm font-semibold text-foreground group-hover:text-primary">
                {brand.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
