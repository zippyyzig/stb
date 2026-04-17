"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  GripVertical,
  Trash2,
  Save,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Loader2,
  Search,
  X,
  Package,
} from "lucide-react";

interface Product {
  _id: string;
  name: string;
  images: string[];
  priceB2C: number;
  brand?: string;
  stock: number;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface HomepageSection {
  id: string;
  categoryId: string;
  categoryName: string;
  title: string;
  slug: string;
  enabled: boolean;
  sortOrder: number;
  productIds: string[];
  products: Product[];
  subcategories: string[];
  expanded: boolean;
}

export default function HomepageSettingsPage() {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [activeSearchSection, setActiveSearchSection] = useState<string | null>(null);

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [settingsRes, categoriesRes] = await Promise.all([
        fetch("/api/admin/homepage"),
        fetch("/api/admin/categories"),
      ]);

      const settingsData = await settingsRes.json();
      const categoriesData = await categoriesRes.json();

      if (categoriesData.categories) {
        setCategories(categoriesData.categories);
      }

      if (settingsData.sections) {
        setSections(
          settingsData.sections.map((s: HomepageSection) => ({
            ...s,
            expanded: false,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Search products
  const searchProducts = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const res = await fetch(
        `/api/admin/products?search=${encodeURIComponent(query)}&limit=10`
      );
      const data = await res.json();
      setSearchResults(data.products || []);
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchProducts(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchProducts]);

  // Add new section
  const addSection = () => {
    const newSection: HomepageSection = {
      id: `section-${Date.now()}`,
      categoryId: "",
      categoryName: "",
      title: "New Section",
      slug: "new-section",
      enabled: true,
      sortOrder: sections.length,
      productIds: [],
      products: [],
      subcategories: [],
      expanded: true,
    };
    setSections([...sections, newSection]);
  };

  // Update section
  const updateSection = (id: string, updates: Partial<HomepageSection>) => {
    setSections(
      sections.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  // Delete section
  const deleteSection = (id: string) => {
    setSections(sections.filter((s) => s.id !== id));
  };

  // Move section up/down
  const moveSection = (id: string, direction: "up" | "down") => {
    const index = sections.findIndex((s) => s.id === id);
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === sections.length - 1)
    ) {
      return;
    }

    const newSections = [...sections];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    [newSections[index], newSections[newIndex]] = [
      newSections[newIndex],
      newSections[index],
    ];

    // Update sort orders
    newSections.forEach((s, i) => {
      s.sortOrder = i;
    });

    setSections(newSections);
  };

  // Add product to section
  const addProductToSection = (sectionId: string, product: Product) => {
    setSections(
      sections.map((s) => {
        if (s.id === sectionId) {
          // Check if already exists
          if (s.productIds.includes(product._id)) {
            return s;
          }
          return {
            ...s,
            productIds: [...s.productIds, product._id],
            products: [...s.products, product],
          };
        }
        return s;
      })
    );
    setSearchQuery("");
    setSearchResults([]);
    setActiveSearchSection(null);
  };

  // Remove product from section
  const removeProductFromSection = (sectionId: string, productId: string) => {
    setSections(
      sections.map((s) => {
        if (s.id === sectionId) {
          return {
            ...s,
            productIds: s.productIds.filter((id) => id !== productId),
            products: s.products.filter((p) => p._id !== productId),
          };
        }
        return s;
      })
    );
  };

  // Handle category change
  const handleCategoryChange = (sectionId: string, categoryId: string) => {
    const category = categories.find((c) => c._id === categoryId);
    if (category) {
      updateSection(sectionId, {
        categoryId,
        categoryName: category.name,
        title: category.name,
        slug: category.slug,
      });
    }
  };

  // Save settings
  const saveSettings = async () => {
    setSaving(true);
    try {
      const payload = sections.map((s) => ({
        categoryId: s.categoryId,
        title: s.title,
        slug: s.slug,
        enabled: s.enabled,
        sortOrder: s.sortOrder,
        productIds: s.productIds,
        subcategories: s.subcategories,
      }));

      const res = await fetch("/api/admin/homepage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections: payload }),
      });

      if (res.ok) {
        alert("Homepage settings saved successfully!");
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="heading-xl">Homepage Settings</h1>
          <p className="body-md mt-1 text-muted-foreground">
            Customize the product sections displayed on your homepage
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={addSection}>
            <Plus className="mr-2 h-4 w-4" />
            Add Section
          </Button>
          <Button onClick={saveSettings} disabled={saving}>
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-4">
        {sections.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground" />
              <h3 className="heading-md mt-4 text-muted-foreground">
                No sections configured
              </h3>
              <p className="body-sm mt-1 text-muted-foreground">
                Click &quot;Add Section&quot; to create your first homepage section
              </p>
              <Button className="mt-4" onClick={addSection}>
                <Plus className="mr-2 h-4 w-4" />
                Add Section
              </Button>
            </CardContent>
          </Card>
        ) : (
          sections.map((section, index) => (
            <Card key={section.id} className="overflow-hidden">
              {/* Section Header */}
              <div
                className={`flex items-center gap-3 border-b p-4 ${
                  section.enabled ? "bg-card" : "bg-muted/50"
                }`}
              >
                <GripVertical className="h-5 w-5 cursor-grab text-muted-foreground" />

                {/* Move buttons */}
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => moveSection(section.id, "up")}
                    disabled={index === 0}
                    className="rounded p-0.5 hover:bg-muted disabled:opacity-30"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => moveSection(section.id, "down")}
                    disabled={index === sections.length - 1}
                    className="rounded p-0.5 hover:bg-muted disabled:opacity-30"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>

                {/* Section info */}
                <div className="flex-1">
                  <Input
                    value={section.title}
                    onChange={(e) =>
                      updateSection(section.id, { title: e.target.value })
                    }
                    className="h-8 w-64 font-semibold"
                  />
                </div>

                {/* Badge for product count */}
                <span className="rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  {section.productIds.length} Products
                </span>

                {/* Toggle visibility */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    updateSection(section.id, { enabled: !section.enabled })
                  }
                  className={section.enabled ? "" : "text-muted-foreground"}
                >
                  {section.enabled ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </Button>

                {/* Delete */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteSection(section.id)}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

                {/* Expand/Collapse */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    updateSection(section.id, { expanded: !section.expanded })
                  }
                >
                  {section.expanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Section Content */}
              {section.expanded && (
                <CardContent className="p-4">
                  {/* Category Selection */}
                  <div className="mb-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="body-sm mb-1.5 block font-medium">
                        Category
                      </label>
                      <select
                        value={section.categoryId}
                        onChange={(e) =>
                          handleCategoryChange(section.id, e.target.value)
                        }
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="body-sm mb-1.5 block font-medium">
                        Subcategories (comma-separated)
                      </label>
                      <Input
                        value={section.subcategories.join(", ")}
                        onChange={(e) =>
                          updateSection(section.id, {
                            subcategories: e.target.value
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean),
                          })
                        }
                        placeholder="e.g., Routers, Switches, Access Points"
                      />
                    </div>
                  </div>

                  {/* Product Search */}
                  <div className="mb-4">
                    <label className="body-sm mb-1.5 block font-medium">
                      Add Products
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={
                          activeSearchSection === section.id ? searchQuery : ""
                        }
                        onChange={(e) => {
                          setActiveSearchSection(section.id);
                          setSearchQuery(e.target.value);
                        }}
                        onFocus={() => setActiveSearchSection(section.id)}
                        placeholder="Search products to add..."
                        className="pl-10"
                      />
                      {activeSearchSection === section.id && searchQuery && (
                        <button
                          onClick={() => {
                            setSearchQuery("");
                            setSearchResults([]);
                            setActiveSearchSection(null);
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                        </button>
                      )}
                    </div>

                    {/* Search Results */}
                    {activeSearchSection === section.id &&
                      searchQuery &&
                      (searchLoading ? (
                        <div className="mt-2 rounded-lg border bg-card p-4">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      ) : searchResults.length > 0 ? (
                        <div className="mt-2 max-h-60 overflow-y-auto rounded-lg border bg-card">
                          {searchResults.map((product) => (
                            <button
                              key={product._id}
                              onClick={() =>
                                addProductToSection(section.id, product)
                              }
                              disabled={section.productIds.includes(
                                product._id
                              )}
                              className="flex w-full items-center gap-3 border-b px-4 py-3 text-left hover:bg-muted disabled:opacity-50"
                            >
                              <div className="h-10 w-10 rounded bg-muted">
                                {product.images?.[0] && (
                                  <img
                                    src={product.images[0]}
                                    alt=""
                                    className="h-full w-full rounded object-cover"
                                  />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  {product.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {product.brand} | Rs {product.priceB2C}
                                </p>
                              </div>
                              {section.productIds.includes(product._id) ? (
                                <span className="text-xs text-muted-foreground">
                                  Added
                                </span>
                              ) : (
                                <Plus className="h-4 w-4 text-primary" />
                              )}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-2 rounded-lg border bg-card p-4 text-sm text-muted-foreground">
                          No products found
                        </div>
                      ))}
                  </div>

                  {/* Selected Products */}
                  <div>
                    <label className="body-sm mb-1.5 block font-medium">
                      Selected Products ({section.products.length})
                    </label>
                    {section.products.length === 0 ? (
                      <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                        No products selected. Search above to add products, or
                        leave empty to show products from the selected category.
                      </div>
                    ) : (
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {section.products.map((product) => (
                          <div
                            key={product._id}
                            className="flex items-center gap-3 rounded-lg border bg-muted/30 p-2"
                          >
                            <div className="h-10 w-10 shrink-0 rounded bg-muted">
                              {product.images?.[0] && (
                                <img
                                  src={product.images[0]}
                                  alt=""
                                  className="h-full w-full rounded object-cover"
                                />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium">
                                {product.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Rs {product.priceB2C}
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                removeProductFromSection(section.id, product._id)
                              }
                              className="rounded p-1 hover:bg-destructive/10"
                            >
                              <X className="h-4 w-4 text-destructive" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Save button fixed at bottom */}
      {sections.length > 0 && (
        <div className="sticky bottom-6 mt-6 flex justify-end">
          <Button
            onClick={saveSettings}
            disabled={saving}
            size="lg"
            className="shadow-lg"
          >
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save All Changes
          </Button>
        </div>
      )}
    </div>
  );
}
