import { isQuoteServiceOptionId } from "@/lib/quote/service-options";
import type {
  QuoteErrorMessages,
  QuoteFieldErrors,
  QuoteRequestValues,
} from "@/lib/quote/types";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateQuoteRequest(
  values: QuoteRequestValues,
  messages: QuoteErrorMessages,
): QuoteFieldErrors {
  const errors: QuoteFieldErrors = {};

  if (!values.fullName.trim()) {
    errors.fullName = messages.fullName;
  }

  const email = values.email.trim();
  if (!email) {
    errors.email = messages.email;
  } else if (!emailPattern.test(email)) {
    errors.email = messages.emailInvalid;
  }

  if (!values.phone.trim()) {
    errors.phone = messages.phone;
  }

  if (!values.service || !isQuoteServiceOptionId(values.service)) {
    errors.service = messages.service;
  }

  if (!values.message.trim()) {
    errors.message = messages.message;
  }

  if (!values.consent) {
    errors.consent = messages.consent;
  }

  return errors;
}

export function hasQuoteFieldErrors(errors: QuoteFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
