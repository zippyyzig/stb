"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface CategoryFiltersProps {
  subcategories: Array<{ _id: string; name: string; slug: string }>;
  brands: string[];
}

export default function CategoryFilters({
  subcategories,
  brands,
}: CategoryFiltersProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState({
    subcategories: true,
    price: true,
    brands: true,
    availability: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand]
    );
  };

  return (
    <div className="rounded-lg bg-card p-4 shadow-sm">
      <h2 className="heading-md mb-4">Filters</h2>

      {/* Subcategories */}
      {subcategories.length > 0 && (
        <>
          <div className="py-3">
            <button
              onClick={() => toggleSection("subcategories")}
              className="flex w-full items-center justify-between"
            >
              <span className="heading-sm text-sm">Subcategories</span>
              {expandedSections.subcategories ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            {expandedSections.subcategories && (
              <div className="mt-3 flex flex-col gap-2">
                {subcategories.map((subcat) => (
                  <label
                    key={subcat._id}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="body-sm">{subcat.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          <Separator />
        </>
      )}

      {/* Price Range */}
      <div className="py-3">
        <button
          onClick={() => toggleSection("price")}
          className="flex w-full items-center justify-between"
        >
          <span className="heading-sm text-sm">Price Range</span>
          {expandedSections.price ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
        {expandedSections.price && (
          <div className="mt-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={priceRange[0] || ""}
                onChange={(e) =>
                  setPriceRange([Number(e.target.value), priceRange[1]])
                }
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
              <span className="text-muted-foreground">-</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange[1] || ""}
                onChange={(e) =>
                  setPriceRange([priceRange[0], Number(e.target.value)])
                }
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                { label: "Under ₹1,000", range: [0, 1000] },
                { label: "₹1,000 - ₹5,000", range: [1000, 5000] },
                { label: "₹5,000 - ₹10,000", range: [5000, 10000] },
                { label: "Above ₹10,000", range: [10000, 100000] },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => setPriceRange(item.range as [number, number])}
                  className="rounded-full border border-border px-3 py-1 text-xs transition-colors hover:border-primary hover:text-primary"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <Separator />

      {/* Brands */}
      {brands.length > 0 && (
        <>
          <div className="py-3">
            <button
              onClick={() => toggleSection("brands")}
              className="flex w-full items-center justify-between"
            >
              <span className="heading-sm text-sm">Brands</span>
              {expandedSections.brands ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            {expandedSections.brands && (
              <div className="mt-3 flex flex-col gap-2">
                {brands.map((brand) => (
                  <label
                    key={brand}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="body-sm">{brand}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          <Separator />
        </>
      )}

      {/* Availability */}
      <div className="py-3">
        <button
          onClick={() => toggleSection("availability")}
          className="flex w-full items-center justify-between"
        >
          <span className="heading-sm text-sm">Availability</span>
          {expandedSections.availability ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
        {expandedSections.availability && (
          <div className="mt-3 flex flex-col gap-2">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="body-sm">In Stock Only</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="body-sm">On Sale</span>
            </label>
          </div>
        )}
      </div>

      {/* Clear Filters */}
      <button className="mt-4 w-full rounded-md border border-border py-2 text-sm text-muted-foreground transition-colors hover:bg-muted">
        Clear All Filters
      </button>
    </div>
  );
}
