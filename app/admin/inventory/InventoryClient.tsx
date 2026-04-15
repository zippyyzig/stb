"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Loader2,
  X,
  Plus,
  Minus,
  RefreshCw,
  Boxes,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Product {
  _id: string;
  name: string;
  sku: string;
  images?: string[];
  stock: number;
  minOrderQty: number;
  priceB2C: number;
  category?: { name: string };
  brand?: string;
}

interface Stats {
  totalProducts: number;
  totalStock: number;
  outOfStock: number;
  lowStock: number;
  totalValue: number;
}

interface InventoryClientProps {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  stats: Stats;
  currentFilter?: string;
}

export default function InventoryClient({
  products,
  total,
  page,
  totalPages,
  stats,
  currentFilter,
}: InventoryClientProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [stockForm, setStockForm] = useState({
    type: "stock_in" as string,
    quantity: 0,
    reason: "",
  });

  const openStockModal = (product: Product) => {
    setSelectedProduct(product);
    setStockForm({ type: "stock_in", quantity: 0, reason: "" });
    setError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setError(null);
  };

  const handleStockUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct._id,
          type: stockForm.type,
          quantity: stockForm.quantity,
          reason: stockForm.reason,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update stock");
      }

      closeModal();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return (
        <Badge variant="destructive" className="gap-1">
          <X className="h-3 w-3" />
          Out of Stock
        </Badge>
      );
    }
    if (stock <= 10) {
      return (
        <Badge variant="secondary" className="gap-1 bg-stb-warning/10 text-stb-warning">
          <AlertTriangle className="h-3 w-3" />
          Low Stock ({stock})
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="gap-1 bg-stb-success/10 text-stb-success">
        In Stock ({stock})
      </Badge>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="heading-xl">Inventory Management</h1>
        <p className="body-md mt-1 text-muted-foreground">
          Track and manage your product inventory
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Boxes className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Products</p>
              <p className="text-2xl font-bold">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stb-success/10">
              <Package className="h-5 w-5 text-stb-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Stock</p>
              <p className="text-2xl font-bold">{stats.totalStock.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stb-warning/10">
              <AlertTriangle className="h-5 w-5 text-stb-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Low Stock</p>
              <p className="text-2xl font-bold">{stats.lowStock}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <X className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Out of Stock</p>
              <p className="text-2xl font-bold">{stats.outOfStock}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
        <form className="relative flex-1" action="/admin/inventory" method="GET">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            name="search"
            placeholder="Search by name or SKU..."
            className="h-10 pl-10"
          />
        </form>

        <div className="flex gap-2">
          <Link href="/admin/inventory">
            <Button variant={!currentFilter ? "default" : "outline"} size="sm">
              All
            </Button>
          </Link>
          <Link href="/admin/inventory?filter=out-of-stock">
            <Button
              variant={currentFilter === "out-of-stock" ? "default" : "outline"}
              size="sm"
              className="gap-1"
            >
              <X className="h-3.5 w-3.5" />
              Out of Stock
            </Button>
          </Link>
          <Link href="/admin/inventory?filter=low-stock">
            <Button
              variant={currentFilter === "low-stock" ? "default" : "outline"}
              size="sm"
              className="gap-1"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              Low Stock
            </Button>
          </Link>
          <Link href="/admin/inventory?filter=in-stock">
            <Button
              variant={currentFilter === "in-stock" ? "default" : "outline"}
              size="sm"
            >
              In Stock
            </Button>
          </Link>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
                  SKU
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
                  Category
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase text-muted-foreground">
                  Current Stock
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-muted-foreground">
                  Value
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                          {product.images?.[0] ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="h-full w-full object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Package className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground line-clamp-1">
                            {product.name}
                          </p>
                          {product.brand && (
                            <p className="text-xs text-muted-foreground">
                              {product.brand}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-sm text-muted-foreground">
                      {product.sku}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {product.category?.name || "-"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-lg font-semibold">{product.stock}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {getStockBadge(product.stock)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {"\u20B9"}{(product.stock * product.priceB2C).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1"
                          onClick={() => openStockModal(product)}
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          Update
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <p className="text-muted-foreground">No products found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <p className="body-sm text-muted-foreground">
              Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, total)} of {total}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/admin/inventory?page=${page - 1}${currentFilter ? `&filter=${currentFilter}` : ""}`}
                  className="rounded-md border border-border px-3 py-1 text-sm hover:bg-muted"
                >
                  Previous
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/admin/inventory?page=${page + 1}${currentFilter ? `&filter=${currentFilter}` : ""}`}
                  className="rounded-md border border-border px-3 py-1 text-sm hover:bg-muted"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Stock Update Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-xl">
            <h2 className="heading-lg mb-2">Update Stock</h2>
            <p className="body-sm mb-4 text-muted-foreground">
              {selectedProduct.name} (Current: {selectedProduct.stock})
            </p>

            {error && (
              <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <form onSubmit={handleStockUpdate} className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Change Type
                </label>
                <select
                  value={stockForm.type}
                  onChange={(e) =>
                    setStockForm({ ...stockForm, type: e.target.value })
                  }
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                >
                  <option value="stock_in">Stock In (Add)</option>
                  <option value="stock_out">Stock Out (Remove)</option>
                  <option value="adjustment">Set Exact Amount</option>
                  <option value="damaged">Damaged</option>
                  <option value="expired">Expired</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  {stockForm.type === "adjustment" ? "New Stock Amount" : "Quantity"}
                </label>
                <div className="flex items-center gap-2">
                  {stockForm.type !== "adjustment" && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setStockForm({
                          ...stockForm,
                          quantity: Math.max(0, stockForm.quantity - 1),
                        })
                      }
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                  <Input
                    type="number"
                    min="0"
                    value={stockForm.quantity}
                    onChange={(e) =>
                      setStockForm({
                        ...stockForm,
                        quantity: parseInt(e.target.value) || 0,
                      })
                    }
                    className="text-center"
                  />
                  {stockForm.type !== "adjustment" && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setStockForm({
                          ...stockForm,
                          quantity: stockForm.quantity + 1,
                        })
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {stockForm.type !== "adjustment" && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    New stock will be:{" "}
                    {stockForm.type === "stock_in"
                      ? selectedProduct.stock + stockForm.quantity
                      : Math.max(0, selectedProduct.stock - stockForm.quantity)}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Reason (Optional)
                </label>
                <Input
                  type="text"
                  value={stockForm.reason}
                  onChange={(e) =>
                    setStockForm({ ...stockForm, reason: e.target.value })
                  }
                  placeholder="e.g., New shipment arrived"
                />
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
                  Update Stock
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
