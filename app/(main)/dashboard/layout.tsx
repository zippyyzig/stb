import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login?callbackUrl=/dashboard");
  }

  if (session.user.role === "admin" || session.user.role === "super_admin") {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      {/* Desktop sidebar — hidden on mobile */}
      <DashboardSidebar />

      {/* Main content column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Desktop header */}
        <div className="hidden md:block">
          <DashboardHeader />
        </div>

        {/* Page content — compact padding on mobile */}
        <main className="flex-1 overflow-y-auto p-3 pb-20 md:p-6 md:pb-6">
          {children}
        </main>
      </div>
    </div>
  );
}
