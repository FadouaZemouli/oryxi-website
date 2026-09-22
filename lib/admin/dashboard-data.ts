import { createClient } from "@/lib/supabase/server";
import {
  CONTACT_INQUIRY_TYPE_LABELS_EN,
  isContactInquiryTypeId,
} from "@/lib/contact/inquiry-types";
import {
  getAdminProjectCounts,
  listRecentAdminProjects,
} from "@/lib/admin/projects/queries";
import type { AdminProject } from "@/lib/admin/projects/types";
import {
  logSafeSupabaseError,
  toSafeSupabaseError,
} from "@/lib/admin/projects/log-error";

export type DashboardCounts = {
  totalProjects: number;
  ongoingProjects: number;
  completedProjects: number;
  clients: number;
  newEnquiries: number;
};

export type DashboardEnquiry = {
  id: string;
  fullName: string;
  companyName: string;
  serviceLabel: string;
  status: string;
  createdAt: string | null;
};

function asCount(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function pickString(row: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

export function enquiryServiceLabel(inquiryType: string) {
  if (inquiryType === "qcdd") {
    return "QCDD Services";
  }

  if (isContactInquiryTypeId(inquiryType)) {
    return CONTACT_INQUIRY_TYPE_LABELS_EN[inquiryType];
  }

  return inquiryType || "—";
}

function mapEnquiry(
  row: Record<string, unknown>,
  index: number,
): DashboardEnquiry {
  const idValue = row.id;
  const id = typeof idValue === "string" ? idValue : `enquiry-${index}`;

  return {
    id,
    fullName: pickString(row, ["full_name", "fullName", "name"]) || "—",
    companyName: pickString(row, ["company_name", "companyName"]) || "—",
    serviceLabel: enquiryServiceLabel(
      pickString(row, ["inquiry_type", "inquiryType"]),
    ),
    status: pickString(row, ["status"]) || "new",
    createdAt: pickString(row, ["created_at", "createdAt"]) || null,
  };
}

export async function getDashboardData(): Promise<{
  counts: DashboardCounts;
  recentProjects: AdminProject[];
  recentEnquiries: DashboardEnquiry[];
}> {
  const supabase = await createClient();

  const [projectCounts, recentProjectsResult, clients, newEnquiries, recent] =
    await Promise.all([
      getAdminProjectCounts(),
      listRecentAdminProjects(5),
      supabase.from("clients").select("id", { count: "exact", head: true }),
      supabase
        .from("contact_enquiries")
        .select("id", { count: "exact", head: true })
        .eq("status", "new"),
      supabase
        .from("contact_enquiries")
        .select("id, full_name, company_name, inquiry_type, status, created_at")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  if (clients.error) {
    logSafeSupabaseError(
      "OMS admin dashboard clients count failed",
      toSafeSupabaseError(clients.error),
    );
  }

  if (newEnquiries.error) {
    logSafeSupabaseError(
      "OMS admin dashboard new enquiries count failed",
      toSafeSupabaseError(newEnquiries.error),
    );
  }

  if (recent.error) {
    logSafeSupabaseError(
      "OMS admin dashboard recent enquiries query failed",
      toSafeSupabaseError(recent.error),
    );
  }

  const recentEnquiries = Array.isArray(recent.data)
    ? recent.data.map((row, index) =>
        mapEnquiry((row ?? {}) as Record<string, unknown>, index),
      )
    : [];

  return {
    counts: {
      totalProjects: projectCounts.total,
      ongoingProjects: projectCounts.ongoing,
      completedProjects: projectCounts.completed,
      clients: asCount(clients.count),
      newEnquiries: asCount(newEnquiries.count),
    },
    recentProjects: recentProjectsResult.projects,
    recentEnquiries,
  };
}
