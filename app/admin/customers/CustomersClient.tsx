"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  User,
  Mail,
  Phone,
  ShoppingBag,
  Check,
  X,
  Loader2,
  Eye,
  Trash2,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  isActive: boolean;
  googleId?: string;
  avatar?: string;
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
}

interface CustomersClientProps {
  customers: Customer[];
  total: number;
  page: number;
  totalPages: number;
  isSuperAdmin: boolean;
  currentStatus?: string;
}

export default function CustomersClient({
  customers,
  total,
  page,
  totalPages,
  isSuperAdmin,
  currentStatus,
}: CustomersClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ password: "", confirmPassword: "" });
  const [error, setError] = useState<string | null>(null);

  const toggleStatus = async (customer: Customer) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/customers/${customer._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !customer.isActive }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (customer: Customer) => {
    if (!confirm(`Are you sure you want to delete "${customer.name}"? This action cannot be undone.`)) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/customers/${customer._id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete customer");
      }

      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete customer");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.password !== passwordForm.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (passwordForm.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/customers/${selectedCustomer?._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordForm.password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setIsPasswordModalOpen(false);
      setPasswordForm({ password: "", confirmPassword: "" });
      alert("Password reset successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="heading-xl">Customers</h1>
        <p className="body-md mt-1 text-muted-foreground">
          Manage customer accounts ({total} customers)
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
        <form className="relative flex-1" action="/admin/customers" method="GET">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            name="search"
            placeholder="Search by name, email or phone..."
            className="h-10 pl-10"
          />
          {currentStatus && <input type="hidden" name="status" value={currentStatus} />}
        </form>

        <div className="flex gap-2">
          <Link href="/admin/customers">
            <Button variant={!currentStatus ? "default" : "outline"} size="sm">
              All
            </Button>
          </Link>
          <Link href="/admin/customers?status=active">
            <Button variant={currentStatus === "active" ? "default" : "outline"} size="sm">
              Active
            </Button>
          </Link>
          <Link href="/admin/customers?status=inactive">
            <Button variant={currentStatus === "inactive" ? "default" : "outline"} size="sm">
              Inactive
            </Button>
          </Link>
        </div>
      </div>

      {/* Customers Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
                  Contact
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase text-muted-foreground">
                  Orders
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-muted-foreground">
                  Total Spent
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
                  Joined
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {customers.length > 0 ? (
                customers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary/10">
                          {customer.avatar ? (
                            <img
                              src={customer.avatar}
                              alt={customer.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{customer.name}</p>
                          {customer.googleId && (
                            <Badge variant="secondary" className="mt-0.5 text-xs">
                              Google
                            </Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Mail className="h-3.5 w-3.5" />
                          {customer.email}
                        </span>
                        {customer.phone && (
                          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Phone className="h-3.5 w-3.5" />
                            {customer.phone}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant="secondary" className="gap-1">
                        <ShoppingBag className="h-3 w-3" />
                        {customer.totalOrders}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {"\u20B9"}{customer.totalSpent.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleStatus(customer)}
                        disabled={isLoading}
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium transition-colors ${
                          customer.isActive
                            ? "bg-stb-success/10 text-stb-success hover:bg-stb-success/20"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {customer.isActive ? (
                          <>
                            <Check className="h-3 w-3" /> Active
                          </>
                        ) : (
                          <>
                            <X className="h-3 w-3" /> Inactive
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setIsDetailModalOpen(true);
                          }}
                          className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {isSuperAdmin && !customer.googleId && (
                          <button
                            onClick={() => {
                              setSelectedCustomer(customer);
                              setPasswordForm({ password: "", confirmPassword: "" });
                              setError(null);
                              setIsPasswordModalOpen(true);
                            }}
                            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            title="Reset Password"
                          >
                            <KeyRound className="h-4 w-4" />
                          </button>
                        )}
                        {isSuperAdmin && customer.totalOrders === 0 && (
                          <button
                            onClick={() => handleDelete(customer)}
                            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                            title="Delete Customer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <p className="text-muted-foreground">No customers found</p>
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
                  href={`/admin/customers?page=${page - 1}${currentStatus ? `&status=${currentStatus}` : ""}`}
                  className="rounded-md border border-border px-3 py-1 text-sm hover:bg-muted"
                >
                  Previous
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/admin/customers?page=${page + 1}${currentStatus ? `&status=${currentStatus}` : ""}`}
                  className="rounded-md border border-border px-3 py-1 text-sm hover:bg-muted"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Customer Detail Modal */}
      {isDetailModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-card p-6 shadow-xl">
            <div className="mb-4 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-primary/10">
                {selectedCustomer.avatar ? (
                  <img
                    src={selectedCustomer.avatar}
                    alt={selectedCustomer.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-8 w-8 text-primary" />
                )}
              </div>
              <div>
                <h2 className="heading-lg">{selectedCustomer.name}</h2>
                <p className="text-sm text-muted-foreground">{selectedCustomer.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Total Orders</p>
                <p className="text-xl font-bold">{selectedCustomer.totalOrders}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Total Spent</p>
                <p className="text-xl font-bold">{"\u20B9"}{selectedCustomer.totalSpent.toLocaleString("en-IN")}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="font-medium">{selectedCustomer.phone || "Not provided"}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Joined</p>
                <p className="font-medium">{new Date(selectedCustomer.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {isPasswordModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-xl">
            <h2 className="heading-lg mb-2">Reset Password</h2>
            <p className="body-sm mb-4 text-muted-foreground">
              Reset password for {selectedCustomer.name}
            </p>

            {error && (
              <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <form onSubmit={handlePasswordReset} className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">New Password</label>
                <Input
                  type="password"
                  value={passwordForm.password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
                  required
                  placeholder="Min 6 characters"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Confirm Password</label>
                <Input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  required
                  placeholder="Confirm password"
                />
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsPasswordModalOpen(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Reset Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
