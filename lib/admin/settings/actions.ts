"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/require-admin";
import {
  logSafeSupabaseError,
  toSafeSupabaseError,
} from "@/lib/admin/projects/log-error";
import { getSettingRow } from "@/lib/admin/settings/queries";
import type {
  CompanyInformationValue,
  ContactNotificationsValue,
} from "@/lib/admin/settings/types";

export type SettingsActionResult = {
  error: string | null;
  success: string | null;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HTTP_URL_PATTERN = /^https?:\/\/.+/i;

const MAX = {
  company_name: 120,
  official_email: 254,
  phone: 40,
  location: 160,
  website_url: 300,
  enquiry_email: 254,
  contact_number: 40,
} as const;

const GENERIC_SAVE_ERROR =
  "Settings could not be saved. Please try again.";
const AMBIGUOUS_KEY_ERROR =
  "Settings could not be saved because duplicate keys were found.";

function asTrimmedString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(value: string) {
  return EMAIL_PATTERN.test(value) && value.length <= MAX.official_email;
}

function isValidHttpUrl(value: string) {
  if (!HTTP_URL_PATTERN.test(value) || value.length > MAX.website_url) {
    return false;
  }
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function withinMax(value: string, max: number) {
  return value.length > 0 && value.length <= max;
}

function refreshSettingsViews() {
  revalidatePath("/admin/settings");
}

async function upsertSettingByKey(
  key: "company_information" | "contact_notifications",
  value: CompanyInformationValue | ContactNotificationsValue,
): Promise<{ error: string | null }> {
  const existing = await getSettingRow(key);

  if (existing.ambiguous) {
    return { error: AMBIGUOUS_KEY_ERROR };
  }

  if (existing.error) {
    const safeError = toSafeSupabaseError({ message: existing.error });
    logSafeSupabaseError("OMS admin settings load before save failed", safeError);
    return { error: GENERIC_SAVE_ERROR };
  }

  const supabase = await createClient();

  if (existing.row) {
    const { error } = await supabase
      .from("site_settings")
      .update({
        value,
        is_public: false,
      })
      .eq("id", existing.row.id)
      .eq("setting_key", key);

    if (error) {
      const safeError = toSafeSupabaseError(error);
      logSafeSupabaseError("OMS admin settings update failed", safeError);
      return { error: GENERIC_SAVE_ERROR };
    }

    return { error: null };
  }

  const { error } = await supabase.from("site_settings").insert({
    setting_key: key,
    value,
    is_public: false,
  });

  if (error) {
    const safeError = toSafeSupabaseError(error);
    logSafeSupabaseError("OMS admin settings insert failed", safeError);
    return { error: GENERIC_SAVE_ERROR };
  }

  return { error: null };
}

function parseCompanyInformation(
  formData: FormData,
): { value: CompanyInformationValue } | { error: string } {
  const value: CompanyInformationValue = {
    company_name: asTrimmedString(formData.get("company_name")),
    official_email: asTrimmedString(formData.get("official_email")),
    phone: asTrimmedString(formData.get("phone")),
    location: asTrimmedString(formData.get("location")),
    website_url: asTrimmedString(formData.get("website_url")),
  };

  if (!withinMax(value.company_name, MAX.company_name)) {
    return { error: "Enter a company name (max 120 characters)." };
  }
  if (!isValidEmail(value.official_email)) {
    return { error: "Enter a valid official email address." };
  }
  if (!withinMax(value.phone, MAX.phone)) {
    return { error: "Enter a phone number (max 40 characters)." };
  }
  if (!withinMax(value.location, MAX.location)) {
    return { error: "Enter a location (max 160 characters)." };
  }
  if (!isValidHttpUrl(value.website_url)) {
    return { error: "Enter a valid website URL starting with http:// or https://." };
  }

  return { value };
}

function parseContactNotifications(
  formData: FormData,
): { value: ContactNotificationsValue } | { error: string } {
  const value: ContactNotificationsValue = {
    enquiry_email: asTrimmedString(formData.get("enquiry_email")),
    contact_number: asTrimmedString(formData.get("contact_number")),
  };

  if (!isValidEmail(value.enquiry_email)) {
    return { error: "Enter a valid enquiry notification email." };
  }
  if (!withinMax(value.contact_number, MAX.contact_number)) {
    return { error: "Enter a contact number (max 40 characters)." };
  }

  return { value };
}

export async function saveCompanyInformationAction(
  formData: FormData,
): Promise<SettingsActionResult> {
  await requireAdmin();

  const parsed = parseCompanyInformation(formData);
  if ("error" in parsed) {
    return { error: parsed.error, success: null };
  }

  const result = await upsertSettingByKey(
    "company_information",
    parsed.value,
  );

  if (result.error) {
    return { error: result.error, success: null };
  }

  refreshSettingsViews();
  return {
    error: null,
    success: "Company information saved.",
  };
}

export async function saveContactNotificationsAction(
  formData: FormData,
): Promise<SettingsActionResult> {
  await requireAdmin();

  const parsed = parseContactNotifications(formData);
  if ("error" in parsed) {
    return { error: parsed.error, success: null };
  }

  const result = await upsertSettingByKey(
    "contact_notifications",
    parsed.value,
  );

  if (result.error) {
    return { error: result.error, success: null };
  }

  refreshSettingsViews();
  return {
    error: null,
    success: "Contact and notification settings saved.",
  };
}
