"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  MessageSquare,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  User,
  ChevronRight,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Ticket {
  _id: string;
  ticketNumber: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  user: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  order?: {
    _id: string;
    orderNumber: string;
  };
  messages: { _id: string }[];
  lastReplyAt?: string;
  lastReplyBy?: string;
  createdAt: string;
}

interface AdminUser {
  _id: string;
  name: string;
  email: string;
}

interface TicketsClientProps {
  tickets: Ticket[];
  total: number;
  page: number;
  totalPages: number;
  counts: {
    all: number;
    open: number;
    in_progress: number;
    waiting_customer: number;
    resolved: number;
    closed: number;
  };
  adminUsers: AdminUser[];
  currentUserId: string;
  currentFilters: {
    status: string;
    priority?: string;
    category?: string;
    assignedTo?: string;
    search?: string;
  };
}

const statusConfig = {
  open: { label: "Open", icon: MessageSquare, color: "text-stb-warning bg-stb-warning/10" },
  in_progress: { label: "In Progress", icon: Clock, color: "text-primary bg-primary/10" },
  waiting_customer: { label: "Waiting", icon: AlertTriangle, color: "text-chart-4 bg-chart-4/10" },
  resolved: { label: "Resolved", icon: CheckCircle2, color: "text-stb-success bg-stb-success/10" },
  closed: { label: "Closed", icon: XCircle, color: "text-muted-foreground bg-muted" },
};

const priorityConfig = {
  low: { label: "Low", color: "bg-muted text-muted-foreground" },
  medium: { label: "Medium", color: "bg-primary/10 text-primary" },
  high: { label: "High", color: "bg-stb-warning/10 text-stb-warning" },
  urgent: { label: "Urgent", color: "bg-destructive/10 text-destructive" },
};

const categoryLabels: Record<string, string> = {
  order: "Order",
  product: "Product",
  payment: "Payment",
  shipping: "Shipping",
  return: "Return",
  technical: "Technical",
  other: "Other",
};

export default function TicketsClient({
  tickets,
  total,
  page,
  totalPages,
  counts,
  currentFilters,
}: TicketsClientProps) {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);

  const buildUrl = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged = { ...currentFilters, ...updates };

    Object.entries(merged).forEach(([key, value]) => {
      if (value && value !== "all") {
        params.set(key, value);
      }
    });

    return `/admin/tickets?${params.toString()}`;
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return then.toLocaleDateString();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="heading-xl">Support Tickets</h1>
        <p className="body-md mt-1 text-muted-foreground">
          Manage customer support requests ({total} tickets)
        </p>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-4">
        {(["all", "open", "in_progress", "waiting_customer", "resolved", "closed"] as const).map((status) => {
          const isActive = currentFilters.status === status;
          const count = counts[status];
          const config = status === "all" ? null : statusConfig[status];

          return (
            <Link key={status} href={buildUrl({ status, page: undefined })}>
              <Button
                variant={isActive ? "default" : "outline"}
                size="sm"
                className="gap-2"
              >
                {config && <config.icon className="h-4 w-4" />}
                {status === "all" ? "All" : config?.label}
                <span className="rounded-full bg-background/20 px-1.5 py-0.5 text-xs">
                  {count}
                </span>
              </Button>
            </Link>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
        <form className="relative flex-1" action="/admin/tickets" method="GET">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            name="search"
            placeholder="Search by ticket number or subject..."
            defaultValue={currentFilters.search}
            className="h-10 pl-10"
          />
          {currentFilters.status && <input type="hidden" name="status" value={currentFilters.status} />}
        </form>

        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="flex flex-wrap gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Priority</label>
            <select
              className="rounded-md border border-border bg-background px-3 py-1.5 text-sm"
              value={currentFilters.priority || ""}
              onChange={(e) => router.push(buildUrl({ priority: e.target.value || undefined, page: undefined }))}
            >
              <option value="">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Category</label>
            <select
              className="rounded-md border border-border bg-background px-3 py-1.5 text-sm"
              value={currentFilters.category || ""}
              onChange={(e) => router.push(buildUrl({ category: e.target.value || undefined, page: undefined }))}
            >
              <option value="">All Categories</option>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Assigned To</label>
            <select
              className="rounded-md border border-border bg-background px-3 py-1.5 text-sm"
              value={currentFilters.assignedTo || ""}
              onChange={(e) => router.push(buildUrl({ assignedTo: e.target.value || undefined, page: undefined }))}
            >
              <option value="">All</option>
              <option value="me">Assigned to Me</option>
              <option value="unassigned">Unassigned</option>
            </select>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin/tickets")}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Tickets List */}
      <div className="flex flex-col gap-3">
        {tickets.length > 0 ? (
          tickets.map((ticket) => {
            const statusConf = statusConfig[ticket.status as keyof typeof statusConfig];
            const priorityConf = priorityConfig[ticket.priority as keyof typeof priorityConfig];
            const StatusIcon = statusConf.icon;

            return (
              <Link
                key={ticket._id}
                href={`/admin/tickets/${ticket._id}`}
                className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/30 hover:bg-muted/30"
              >
                {/* Status Icon */}
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${statusConf.color}`}>
                  <StatusIcon className="h-5 w-5" />
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">
                      {ticket.ticketNumber}
                    </span>
                    <Badge variant="secondary" className={priorityConf.color}>
                      {priorityConf.label}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {categoryLabels[ticket.category]}
                    </Badge>
                  </div>
                  <h3 className="mt-1 truncate font-medium text-foreground">
                    {ticket.subject}
                  </h3>
                  <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {ticket.user.name}
                    </span>
                    {ticket.order && (
                      <span className="text-xs">
                        Order: {ticket.order.orderNumber}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {ticket.messages.length}
                    </span>
                  </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {formatTimeAgo(ticket.createdAt)}
                    </p>
                    {ticket.lastReplyAt && (
                      <p className="text-xs text-muted-foreground">
                        Last reply: {formatTimeAgo(ticket.lastReplyAt)} by{" "}
                        {ticket.lastReplyBy === "admin" ? "Admin" : "Customer"}
                      </p>
                    )}
                  </div>

                  {ticket.assignedTo ? (
                    <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-primary/10">
                      {ticket.assignedTo.avatar ? (
                        <img
                          src={ticket.assignedTo.avatar}
                          alt={ticket.assignedTo.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-medium text-primary">
                          {ticket.assignedTo.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <User className="h-4 w-4" />
                    </div>
                  )}

                  <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })
        ) : (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">No tickets found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
          <p className="body-sm text-muted-foreground">
            Page {page} of {totalPages} ({total} tickets)
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={buildUrl({ page: String(page - 1) })}>
                <Button variant="outline" size="sm">Previous</Button>
              </Link>
            )}
            {page < totalPages && (
              <Link href={buildUrl({ page: String(page + 1) })}>
                <Button variant="outline" size="sm">Next</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
