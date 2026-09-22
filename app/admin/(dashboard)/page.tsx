import type { Metadata } from "next";
import { DashboardOverview } from "@/components/admin/DashboardOverview";
import { adminIdentityFromUser } from "@/lib/admin/admin-identity";
import { getDashboardData } from "@/lib/admin/dashboard-data";
import { requireAdmin } from "@/lib/admin/require-admin";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function AdminDashboardPage() {
  const user = await requireAdmin();
  const { counts, recentProjects, recentEnquiries } = await getDashboardData();

  return (
    <DashboardOverview
      identity={adminIdentityFromUser(user)}
      counts={counts}
      recentProjects={recentProjects}
      recentEnquiries={recentEnquiries}
    />
  );
}
