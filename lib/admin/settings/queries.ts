import { createClient } from "@/lib/supabase/server";
import {
  logSafeSupabaseError,
  toSafeSupabaseError,
} from "@/lib/admin/projects/log-error";
import {
  SETTINGS_DEFAULTS,
  isSettingsKey,
  type CompanyInformationValue,
  type ContactNotificationsValue,
  type SettingsKey,
  type SettingsValuesByKey,
  type SiteSettingRow,
} from "@/lib/admin/settings/types";

function asTrimmedString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }
  return value as Record<string, unknown>;
}

function parseCompanyInformation(
  value: unknown,
): CompanyInformationValue {
  const record = asRecord(value);
  return {
    company_name: asTrimmedString(record.company_name),
    official_email: asTrimmedString(record.official_email),
    phone: asTrimmedString(record.phone),
    location: asTrimmedString(record.location),
    website_url: asTrimmedString(record.website_url),
  };
}

function parseContactNotifications(
  value: unknown,
): ContactNotificationsValue {
  const record = asRecord(value);
  return {
    enquiry_email: asTrimmedString(record.enquiry_email),
    contact_number: asTrimmedString(record.contact_number),
  };
}

function parseValue(
  key: SettingsKey,
  value: unknown,
): SettingsValuesByKey[SettingsKey] {
  if (key === "company_information") {
    return parseCompanyInformation(value);
  }
  return parseContactNotifications(value);
}

function mergeWithDefaults<K extends SettingsKey>(
  key: K,
  stored: SettingsValuesByKey[K] | null,
): SettingsValuesByKey[K] {
  const defaults = SETTINGS_DEFAULTS[key];
  if (!stored) {
    return { ...defaults };
  }

  const merged = { ...defaults } as SettingsValuesByKey[K];
  for (const field of Object.keys(defaults) as (keyof SettingsValuesByKey[K])[]) {
    const next = stored[field];
    if (typeof next === "string" && next.trim()) {
      merged[field] = next.trim() as SettingsValuesByKey[K][typeof field];
    }
  }
  return merged;
}

export type LoadedSettings = {
  company: CompanyInformationValue;
  notifications: ContactNotificationsValue;
  companyPersisted: boolean;
  notificationsPersisted: boolean;
  error: string | null;
};

export async function getSettingRow(
  key: SettingsKey,
): Promise<{ row: SiteSettingRow | null; error: string | null; ambiguous: boolean }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("id, setting_key, value, is_public, created_at, updated_at")
    .eq("setting_key", key);

  if (error) {
    const safeError = toSafeSupabaseError(error);
    logSafeSupabaseError(
      `OMS admin settings load failed (key=${key})`,
      safeError,
    );
    return { row: null, error: "load_failed", ambiguous: false };
  }

  // Zero rows is a valid first-run state - not an error.
  const rows = Array.isArray(data) ? data : [];
  if (rows.length === 0) {
    return { row: null, error: null, ambiguous: false };
  }

  if (rows.length > 1) {
    return {
      row: null,
      error: `Multiple site_settings rows found for key "${key}".`,
      ambiguous: true,
    };
  }

  const raw = rows[0] as Record<string, unknown>;
  const id = typeof raw.id === "string" ? raw.id : "";
  const settingKey =
    typeof raw.setting_key === "string" && isSettingsKey(raw.setting_key)
      ? raw.setting_key
      : null;

  if (!id || !settingKey || settingKey !== key) {
    return { row: null, error: "Invalid site_settings row.", ambiguous: false };
  }

  return {
    row: {
      id,
      setting_key: settingKey,
      value: parseValue(settingKey, raw.value) as SettingsValuesByKey[typeof settingKey],
      is_public: raw.is_public === true,
      created_at: typeof raw.created_at === "string" ? raw.created_at : null,
      updated_at: typeof raw.updated_at === "string" ? raw.updated_at : null,
    },
    error: null,
    ambiguous: false,
  };
}

export async function loadAdminSettings(): Promise<LoadedSettings> {
  const [companyResult, notificationsResult] = await Promise.all([
    getSettingRow("company_information"),
    getSettingRow("contact_notifications"),
  ]);

  const errors = [
    companyResult.error,
    notificationsResult.error,
  ].filter(Boolean);

  return {
    company: mergeWithDefaults(
      "company_information",
      companyResult.row?.value as CompanyInformationValue | null,
    ),
    notifications: mergeWithDefaults(
      "contact_notifications",
      notificationsResult.row?.value as ContactNotificationsValue | null,
    ),
    companyPersisted: Boolean(companyResult.row),
    notificationsPersisted: Boolean(notificationsResult.row),
    error: errors.length > 0 ? errors[0] : null,
  };
}
