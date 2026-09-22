export const SETTINGS_KEYS = [
  "company_information",
  "contact_notifications",
] as const;

export type SettingsKey = (typeof SETTINGS_KEYS)[number];

export type CompanyInformationValue = {
  company_name: string;
  official_email: string;
  phone: string;
  location: string;
  website_url: string;
};

export type ContactNotificationsValue = {
  enquiry_email: string;
  contact_number: string;
};

export type SettingsValuesByKey = {
  company_information: CompanyInformationValue;
  contact_notifications: ContactNotificationsValue;
};

export type SiteSettingRow<K extends SettingsKey = SettingsKey> = {
  id: string;
  setting_key: K;
  value: SettingsValuesByKey[K];
  is_public: boolean;
  created_at: string | null;
  updated_at: string | null;
};

/** Display defaults from existing OMS app sources - never auto-inserted. */
export const COMPANY_INFORMATION_DEFAULTS: CompanyInformationValue = {
  company_name: "Oryxi Maintenance Services",
  official_email: "marketing@oms.com.qa",
  phone: "+974 4039 7445",
  location: "Doha, Qatar",
  website_url: "https://www.oms.com.qa",
};

export const CONTACT_NOTIFICATIONS_DEFAULTS: ContactNotificationsValue = {
  enquiry_email: "marketing@oms.com.qa",
  contact_number: "+974 4039 7445",
};

export const SETTINGS_DEFAULTS: SettingsValuesByKey = {
  company_information: COMPANY_INFORMATION_DEFAULTS,
  contact_notifications: CONTACT_NOTIFICATIONS_DEFAULTS,
};

export function isSettingsKey(value: string): value is SettingsKey {
  return (SETTINGS_KEYS as readonly string[]).includes(value);
}
