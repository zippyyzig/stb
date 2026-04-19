"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCallback } from "react";

export default function ShippingFilters({
  search,
  status,
}: {
  search?: string;
  status?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/admin/shipping?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
      <form
        className="relative flex-1"
        action="/admin/shipping"
        method="GET"
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const input = form.elements.namedItem("search") as HTMLInputElement;
          updateFilter("search", input.value);
        }}
      >
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          name="search"
          placeholder="Search by name, state, city, or pincode..."
          defaultValue={search}
          className="h-10 pl-10"
        />
        {status && <input type="hidden" name="status" value={status} />}
      </form>

      <select
        value={status ?? ""}
        onChange={(e) => updateFilter("status", e.target.value)}
        className="h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>
  );
}
