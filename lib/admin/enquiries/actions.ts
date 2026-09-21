"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/require-admin";
import {
  logSafeSupabaseError,
  toSafeSupabaseError,
} from "@/lib/admin/projects/log-error";
import {
  isEnquiryStatus,
  type EnquiryStatus,
} from "@/lib/admin/enquiries/types";

export type UpdateEnquiryStatusResult = {
  error: string | null;
  success: string | null;
  status: EnquiryStatus | null;
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const STATUS_SUCCESS: Record<EnquiryStatus, string> = {
  new: "Enquiry marked as new.",
  in_progress: "Enquiry marked as in progress.",
  closed: "Enquiry closed.",
};

function refreshEnquiryViews() {
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
}

export async function updateEnquiryStatusAction(
  enquiryId: string,
  nextStatus: string,
): Promise<UpdateEnquiryStatusResult> {
  await requireAdmin();

  const id = typeof enquiryId === "string" ? enquiryId.trim() : "";
  if (!id || !UUID_PATTERN.test(id)) {
    return {
      error: "This enquiry could not be found.",
      success: null,
      status: null,
    };
  }

  if (!isEnquiryStatus(nextStatus)) {
    return {
      error: "Select a valid enquiry status.",
      success: null,
      status: null,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_enquiries")
    .update({ status: nextStatus })
    .eq("id", id)
    .select("id, status")
    .maybeSingle();

  if (error) {
    const safeError = toSafeSupabaseError(error);
    logSafeSupabaseError("OMS admin enquiry status update failed", safeError);
    return {
      error: "The enquiry status could not be updated. Please try again.",
      success: null,
      status: null,
    };
  }

  if (!data || typeof data.id !== "string") {
    return {
      error: "This enquiry could not be found.",
      success: null,
      status: null,
    };
  }

  refreshEnquiryViews();

  return {
    error: null,
    success: STATUS_SUCCESS[nextStatus],
    status: nextStatus,
  };
}
