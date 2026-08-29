import type { QuoteServiceOptionId } from "@/lib/quote/service-options";

export type PreferredContactMethod = "phone" | "email";

export type QuoteRequestValues = {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  service: QuoteServiceOptionId | "";
  projectName: string;
  location: string;
  preferredContactMethod: PreferredContactMethod | "";
  message: string;
  consent: boolean;
};

export type QuoteFieldName = keyof QuoteRequestValues;

export type QuoteFieldErrors = Partial<Record<QuoteFieldName, string>>;

export type QuoteAttachmentMeta = {
  name: string;
  type: string;
  size: number;
};

export type QuoteRequestPayload = {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  service: QuoteServiceOptionId;
  projectName: string;
  location: string;
  preferredContactMethod: PreferredContactMethod | null;
  message: string;
  consent: true;
  attachment: QuoteAttachmentMeta | null;
};

export type QuoteErrorMessages = {
  fullName: string;
  email: string;
  emailInvalid: string;
  phone: string;
  service: string;
  message: string;
  consent: string;
};
