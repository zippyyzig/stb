"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Building2,
  Check,
  X,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Brand {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
  isActive: boolean;
  sortOrder: number;
  productsCount: number;
}

interface BrandsClientProps {
  brands: Brand[];
  isSuperAdmin: boolean;
}

export default function BrandsClient({
  brands: initialBrands,
  isSuperAdmin,
}: BrandsClientProps) {
  const router = useRouter();
  const [brands, setBrands] = useState(initialBrands);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: "",
    website: "",
    isActive: true,
    sortOrder: 0,
  });

  const filteredBrands = brands.filter(
    (brand) =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brand.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (brand?: Brand) => {
    if (brand) {
      setEditingBrand(brand);
      setFormData({
        name: brand.name,
        description: brand.description || "",
        logo: brand.logo || "",
        website: brand.website || "",
        isActive: brand.isActive,
        sortOrder: brand.sortOrder,
      });
    } else {
      setEditingBrand(null);
      setFormData({
        name: "",
        description: "",
        logo: "",
        website: "",
        isActive: true,
        sortOrder: brands.length,
      });
    }
    setError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBrand(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const url = editingBrand
        ? `/api/admin/brands/${editingBrand._id}`
        : "/api/admin/brands";

      const response = await fetch(url, {
        method: editingBrand ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save brand");
      }

      closeModal();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (brand: Brand) => {
    if (!confirm(`Are you sure you want to delete "${brand.name}"?`)) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/brands/${brand._id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete brand");
      }

      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete brand");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStatus = async (brand: Brand) => {
    try {
      const response = await fetch(`/api/admin/brands/${brand._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !brand.isActive }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-xl">Brands</h1>
          <p className="body-md mt-1 text-muted-foreground">
            Manage product brands ({brands.length} total)
          </p>
        </div>
        <Button className="gap-2" onClick={() => openModal()}>
          <Plus className="h-4 w-4" />
          Add Brand
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search brands..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-10 pl-10"
        />
      </div>

      {/* Brands Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredBrands.length > 0 ? (
          filteredBrands.map((brand) => (
            <div
              key={brand._id}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Logo */}
              <div className="mb-3 flex h-16 items-center justify-center rounded-lg bg-muted">
                {brand.logo ? (
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={80}
                    height={40}
                    className="max-h-10 w-auto object-contain"
                    unoptimized
                  />
                ) : (
                  <Building2 className="h-8 w-8 text-muted-foreground" />
                )}
              </div>

              {/* Info */}
              <div className="mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{brand.name}</h3>
                  {brand.website && (
                    <a
                      href={brand.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {brand.description || "No description"}
                </p>
              </div>

              {/* Stats */}
              <div className="mb-3 flex items-center gap-3">
                <Badge variant="secondary" className="text-xs">
                  {brand.productsCount} products
                </Badge>
                <button
                  onClick={() => toggleStatus(brand)}
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition-colors ${
                    brand.isActive
                      ? "bg-stb-success/10 text-stb-success"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {brand.isActive ? (
                    <>
                      <Check className="h-3 w-3" /> Active
                    </>
                  ) : (
                    <>
                      <X className="h-3 w-3" /> Inactive
                    </>
                  )}
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1"
                  onClick={() => openModal(brand)}
                >
                  <Edit className="h-3.5 w-3.5" />
                  Edit
                </Button>
                {isSuperAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(brand)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center">
            <p className="text-muted-foreground">No brands found</p>
            <Button variant="link" onClick={() => openModal()}>
              Add your first brand
            </Button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-card p-6 shadow-xl">
            <h2 className="heading-lg mb-4">
              {editingBrand ? "Edit Brand" : "Add Brand"}
            </h2>

            {error && (
              <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Name</label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  placeholder="Brand name"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="h-20 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  placeholder="Brand description"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Logo URL</label>
                <Input
                  type="url"
                  value={formData.logo}
                  onChange={(e) =>
                    setFormData({ ...formData, logo: e.target.value })
                  }
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Website
                  </label>
                  <Input
                    type="url"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Sort Order
                  </label>
                  <Input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sortOrder: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-border"
                />
                <label htmlFor="isActive" className="text-sm">
                  Active
                </label>
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingBrand ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
