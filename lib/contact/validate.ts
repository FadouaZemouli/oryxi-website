import { isContactInquiryTypeId } from "@/lib/contact/inquiry-types";

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

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
