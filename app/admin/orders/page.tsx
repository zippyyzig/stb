import { Suspense } from "react";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import OrdersClient from "./OrdersClient";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Orders Management | Admin",
  description: "Manage all orders",
};

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session || !["admin", "super_admin"].includes(session.user.role)) {
    redirect("/auth/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold tracking-tight">
          Orders Management
        </h1>
        <p className="text-muted-foreground">
          View and manage all customer orders
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <OrdersClient isSuperAdmin={session.user.role === "super_admin"} />
      </Suspense>
    </div>
  );
}
