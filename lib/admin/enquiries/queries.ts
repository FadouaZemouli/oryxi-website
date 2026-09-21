import { createClient } from "@/lib/supabase/server";
import {
  logSafeSupabaseError,
  toSafeSupabaseError,
} from "@/lib/admin/projects/log-error";
import {
  ENQUIRY_SELECT,
  asEnquiryStatus,
  type AdminEnquiry,
  type EnquiryStatus,
} from "@/lib/admin/enquiries/types";

export type EnquiryListFilters = {
  q?: string;
  status?: "all" | EnquiryStatus;
};

export type EnquiryQueryError = {
  message: string;
  code: string | null;
  details: string | null;
  hint: string | null;
};

export type EnquiryCounts = {
  total: number;
  new: number;
  in_progress: number;
  closed: number;
};

function asCount(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function sanitizeSearch(value: string) {
  return value.replace(/[%_,.()]/g, " ").trim();
}

function asEnquiry(row: Record<string, unknown>): AdminEnquiry | null {
  const id = typeof row.id === "string" ? row.id : "";
  if (!id) {
    return null;
  }

  const email = typeof row.email === "string" ? row.email.trim() : "";
  if (!email) {
    return null;
  }

  const fullName =
    typeof row.full_name === "string" ? row.full_name.trim() : "";
  const message = typeof row.message === "string" ? row.message : "";
  const inquiryType =
    typeof row.inquiry_type === "string" ? row.inquiry_type.trim() : "";

  return {
    id,
    full_name: fullName || "—",
    company_name:
      typeof row.company_name === "string" && row.company_name.trim()
        ? row.company_name.trim()
        : null,
    email,
    phone:
      typeof row.phone === "string" && row.phone.trim()
        ? row.phone.trim()
        : null,
    inquiry_type: inquiryType || "other",
    message,
    status: asEnquiryStatus(row.status),
    created_at: typeof row.created_at === "string" ? row.created_at : null,
    updated_at: typeof row.updated_at === "string" ? row.updated_at : null,
  };
}

export async function listAdminEnquiries(filters: EnquiryListFilters = {}) {
  const supabase = await createClient();
  let query = supabase
    .from("contact_enquiries")
    .select(ENQUIRY_SELECT)
    .order("created_at", { ascending: false })
    .order("id", { ascending: false });

  if (
    filters.status === "new" ||
    filters.status === "in_progress" ||
    filters.status === "closed"
  ) {
    query = query.eq("status", filters.status);
  }

  const search = sanitizeSearch(filters.q ?? "");
  if (search) {
    query = query.or(
      [
        `full_name.ilike.%${search}%`,
        `company_name.ilike.%${search}%`,
        `email.ilike.%${search}%`,
        `phone.ilike.%${search}%`,
        `inquiry_type.ilike.%${search}%`,
        `message.ilike.%${search}%`,
      ].join(","),
    );
  }

  const { data, error } = await query;

  if (error) {
    const safeError = toSafeSupabaseError(error);
    logSafeSupabaseError("OMS admin enquiries list query failed", safeError);
    return { enquiries: [] as AdminEnquiry[], error: safeError };
  }

  const enquiries = (data ?? [])
    .map((row) => asEnquiry((row ?? {}) as Record<string, unknown>))
    .filter((row): row is AdminEnquiry => Boolean(row));

  return { enquiries, error: null };
}

export async function getAdminEnquiryCounts(): Promise<EnquiryCounts> {
  const supabase = await createClient();
  const [total, neu, inProgress, closed] = await Promise.all([
    supabase
      .from("contact_enquiries")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("contact_enquiries")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
    supabase
      .from("contact_enquiries")
      .select("id", { count: "exact", head: true })
      .eq("status", "in_progress"),
    supabase
      .from("contact_enquiries")
      .select("id", { count: "exact", head: true })
      .eq("status", "closed"),
  ]);

  if (total.error) {
    logSafeSupabaseError(
      "OMS admin enquiries total count failed",
      toSafeSupabaseError(total.error),
    );
  }
  if (neu.error) {
    logSafeSupabaseError(
      "OMS admin enquiries new count failed",
      toSafeSupabaseError(neu.error),
    );
  }
  if (inProgress.error) {
    logSafeSupabaseError(
      "OMS admin enquiries in_progress count failed",
      toSafeSupabaseError(inProgress.error),
    );
  }
  if (closed.error) {
    logSafeSupabaseError(
      "OMS admin enquiries closed count failed",
      toSafeSupabaseError(closed.error),
    );
  }

  return {
    total: asCount(total.count),
    new: asCount(neu.count),
    in_progress: asCount(inProgress.count),
    closed: asCount(closed.count),
  };
}
