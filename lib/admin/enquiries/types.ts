import {
  CONTACT_INQUIRY_TYPE_LABELS_EN,
  isContactInquiryTypeId,
} from "@/lib/contact/inquiry-types";

export const ENQUIRY_STATUSES = ["new", "in_progress", "closed"] as const;

export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export type AdminEnquiry = {
  id: string;
  full_name: string;
  company_name: string | null;
  email: string;
  phone: string | null;
  inquiry_type: string;
  message: string;
  status: EnquiryStatus;
  created_at: string | null;
  updated_at: string | null;
};

export const ENQUIRY_SELECT =
  "id, full_name, company_name, email, phone, inquiry_type, message, status, created_at, updated_at";

export const ENQUIRY_STATUS_LABELS: Record<EnquiryStatus, string> = {
  new: "New",
  in_progress: "In Progress",
  closed: "Closed",
};

export function isEnquiryStatus(value: string): value is EnquiryStatus {
  return (ENQUIRY_STATUSES as readonly string[]).includes(value);
}

export function asEnquiryStatus(value: unknown): EnquiryStatus {
  if (typeof value === "string" && isEnquiryStatus(value)) {
    return value;
  }

  return "new";
}

export function enquiryServiceLabel(inquiryType: string) {
  if (inquiryType === "qcdd") {
    return "QCDD Services";
  }

  if (isContactInquiryTypeId(inquiryType)) {
    return CONTACT_INQUIRY_TYPE_LABELS_EN[inquiryType];
  }

  return inquiryType.trim() || "—";
}
