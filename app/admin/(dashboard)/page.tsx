import type { Metadata } from "next";
import { DashboardOverview } from "@/components/admin/DashboardOverview";
import { getDashboardData } from "@/lib/admin/dashboard-data";
import { requireAdmin } from "@/lib/admin/require-admin";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function AdminDashboardPage() {
  const user = await requireAdmin();
  const { counts, recentEnquiries } = await getDashboardData();
  const welcomeName = user.email?.split("@")[0] || "administrator";

  return (
    <DashboardOverview
      welcomeName={welcomeName}
      counts={counts}
      recentEnquiries={recentEnquiries}
    />
  );
}
