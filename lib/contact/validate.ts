import {
  isContactInquiryTypeId,
  type ContactInquiryTypeId,
} from "@/lib/contact/inquiry-types";

export type ContactMessageValues = {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  inquiryType: string;
  message: string;
};

export type ContactMessageFieldErrors = Partial<
  Record<"fullName" | "email" | "inquiryType" | "message", string>
>;

export type ContactMessageErrorCopy = {
  fullName: string;
  email: string;
  emailInvalid: string;
  inquiryType: string;
  message: string;
};

export type ContactEnquiryPayload = {
  fullName: string;
  companyName: string | null;
  email: string;
  phone: string | null;
  inquiryType: ContactInquiryTypeId;
  message: string;
};

export const CONTACT_FIELD_LIMITS = {
  fullName: 120,
  companyName: 160,
  email: 254,
  phone: 40,
  message: 5000,
} as const;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readTrimmed(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function validateContactMessage(
  values: ContactMessageValues,
  messages: ContactMessageErrorCopy,
): ContactMessageFieldErrors {
  const errors: ContactMessageFieldErrors = {};

  if (!values.fullName.trim()) {
    errors.fullName = messages.fullName;
  }

  const email = values.email.trim();
  if (!email) {
    errors.email = messages.email;
  } else if (!emailPattern.test(email)) {
    errors.email = messages.emailInvalid;
  }

  if (!values.inquiryType || !isContactInquiryTypeId(values.inquiryType)) {
    errors.inquiryType = messages.inquiryType;
  }

  if (!values.message.trim()) {
    errors.message = messages.message;
  }

  return errors;
}

export function hasContactMessageErrors(
  errors: ContactMessageFieldErrors,
): boolean {
  return Object.keys(errors).length > 0;
}

export function parseContactEnquiryInput(input: {
  fullName?: unknown;
  companyName?: unknown;
  email?: unknown;
  phone?: unknown;
  inquiryType?: unknown;
  message?: unknown;
  companyWebsite?: unknown;
}): { honeypot: true } | { ok: false } | { ok: true; payload: ContactEnquiryPayload } {
  if (readTrimmed(input.companyWebsite)) {
    return { honeypot: true };
  }

  const fullName = readTrimmed(input.fullName);
  const companyName = readTrimmed(input.companyName);
  const email = readTrimmed(input.email);
  const phone = readTrimmed(input.phone);
  const inquiryType = readTrimmed(input.inquiryType);
  const message = readTrimmed(input.message);

  if (
    !fullName ||
    fullName.length > CONTACT_FIELD_LIMITS.fullName ||
    companyName.length > CONTACT_FIELD_LIMITS.companyName ||
    !email ||
    email.length > CONTACT_FIELD_LIMITS.email ||
    !emailPattern.test(email) ||
    phone.length > CONTACT_FIELD_LIMITS.phone ||
    !isContactInquiryTypeId(inquiryType) ||
    !message ||
    message.length > CONTACT_FIELD_LIMITS.message
  ) {
    return { ok: false };
  }

  return {
    ok: true,
    payload: {
      fullName,
      companyName: companyName || null,
      email,
      phone: phone || null,
      inquiryType,
      message,
    },
  };
}
