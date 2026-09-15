import { createClient } from "@/lib/supabase/server";

export type DashboardCounts = {
  ongoingProjects: number;
  completedProjects: number;
  clients: number;
  newEnquiries: number;
};

export type RecentEnquiry = {
  id: string;
  title: string;
  detail: string;
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

function mapEnquiry(row: Record<string, unknown>, index: number): RecentEnquiry {
  const idValue = row.id;
  const id = typeof idValue === "string" ? idValue : `enquiry-${index}`;
  const title =
    pickString(row, ["full_name", "fullName", "name", "company_name", "companyName"]) ||
    "New enquiry";
  const email = pickString(row, ["email"]);
  const inquiryType = pickString(row, ["inquiry_type", "inquiryType"]);
  const detail = [inquiryType, email].filter(Boolean).join(" · ");
  const createdAt = pickString(row, ["created_at", "createdAt"]) || null;

  return { id, title, detail, createdAt };
}

export async function getDashboardData(): Promise<{
  counts: DashboardCounts;
  recentEnquiries: RecentEnquiry[];
}> {
  const supabase = await createClient();

  const [ongoing, completed, clients, enquiries, recent] = await Promise.all([
    supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("project_status", "ongoing"),
    supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("project_status", "completed"),
    supabase.from("clients").select("id", { count: "exact", head: true }),
    supabase
      .from("contact_enquiries")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
    supabase
      .from("contact_enquiries")
      .select("*")
      .eq("status", "new")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const recentEnquiries = Array.isArray(recent.data)
    ? recent.data.map((row, index) =>
        mapEnquiry((row ?? {}) as Record<string, unknown>, index),
      )
    : [];

  return {
    counts: {
      ongoingProjects: asCount(ongoing.count),
      completedProjects: asCount(completed.count),
      clients: asCount(clients.count),
      newEnquiries: asCount(enquiries.count),
    },
    recentEnquiries,
  };
}
