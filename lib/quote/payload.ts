import type {
  QuoteAttachmentMeta,
  QuoteRequestPayload,
  QuoteRequestValues,
} from "@/lib/quote/types";
import { isQuoteServiceOptionId } from "@/lib/quote/service-options";

export function buildQuoteRequestPayload(
  values: QuoteRequestValues,
  attachment: File | null,
): QuoteRequestPayload | null {
  if (!values.consent || !isQuoteServiceOptionId(values.service)) {
    return null;
  }

  const attachmentMeta: QuoteAttachmentMeta | null = attachment
    ? {
        name: attachment.name,
        type: attachment.type,
        size: attachment.size,
      }
    : null;

  return {
    fullName: values.fullName.trim(),
    companyName: values.companyName.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    service: values.service,
    projectName: values.projectName.trim(),
    location: values.location.trim(),
    preferredContactMethod: values.preferredContactMethod || null,
    message: values.message.trim(),
    consent: true,
    attachment: attachmentMeta,
  };
}
