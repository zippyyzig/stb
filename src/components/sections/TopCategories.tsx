import { categories } from "@/data/categories";

export default function TopCategories() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      {/* Section Header */}
      <div className="mb-8 flex items-center gap-4">
        <h2 className="heading-lg">Top Categories</h2>
        <div className="h-1 w-16 rounded-full bg-primary" />
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {categories.map((category) => (
          <a
            key={category.id}
            href="#"
            className="group flex flex-col items-center gap-3 rounded-xl bg-card p-4 shadow-xs transition-all hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl bg-stb-sky p-2 transition-transform group-hover:scale-105">
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover rounded-lg"
              />
            </div>
            <span className="heading-sm text-center text-sm text-foreground">
              {category.name}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
