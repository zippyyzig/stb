"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CustomerFiltersProps {
  search?: string;
  status?: string;
}

export default function CustomerFilters({ search, status }: CustomerFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const q = (data.get("search") as string) || "";
    const params = new URLSearchParams(searchParams.toString());
    if (q) {
      params.set("search", q);
    } else {
      params.delete("search");
    }
    params.delete("page");
    router.push(`/admin/customers?${params.toString()}`);
  }

  function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      params.set("status", e.target.value);
    } else {
      params.delete("status");
    }
    params.delete("page");
    router.push(`/admin/customers?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
      <form className="relative flex-1" onSubmit={handleSearch}>
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          name="search"
          placeholder="Search by name, email, or phone..."
          defaultValue={search ?? ""}
          className="h-10 pl-10"
        />
      </form>

      <select
        defaultValue={status ?? ""}
        onChange={handleStatusChange}
        className="h-10 rounded-md border border-border bg-background px-3 text-sm"
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>
  );
}
