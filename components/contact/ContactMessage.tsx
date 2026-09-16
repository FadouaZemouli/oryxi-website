"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Montserrat } from "next/font/google";
import { ArrowRight } from "lucide-react";
import { FormField } from "@/components/forms/FormField";
import { SelectField } from "@/components/forms/SelectField";
import { TextArea } from "@/components/forms/TextArea";
import { TextInput } from "@/components/forms/TextInput";
import { Container } from "@/components/ui/Container";
import { submitContactEnquiryAction } from "@/lib/contact/actions";
import { contactInquiryTypeIds } from "@/lib/contact/inquiry-types";
import {
  getOmsGoogleMapsEmbedUrl,
  OMS_GOOGLE_MAPS_URL,
} from "@/lib/contact/oms-maps";
import {
  hasContactMessageErrors,
  validateContactMessage,
  type ContactMessageFieldErrors,
  type ContactMessageValues,
} from "@/lib/contact/validate";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

const contactMessageSans = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const initialValues: ContactMessageValues = {
  fullName: "",
  companyName: "",
  email: "",
  phone: "",
  inquiryType: "",
  message: "",
};

type ContactMessageProps = {
  locale: Locale;
  dict: Dictionary;
};

export function ContactMessage({ locale, dict }: ContactMessageProps) {
  const copy = dict.contactPage.message;
  const location = dict.contactPage.location;
  const formId = useId();
  const submittingRef = useRef(false);
  const [values, setValues] = useState<ContactMessageValues>(initialValues);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<ContactMessageFieldErrors>({});
  const [statusKind, setStatusKind] = useState<"success" | "error" | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const mapsArrow = locale === "ar" ? "←" : "→";

  useEffect(() => {
    const scrollToForm = () => {
      if (window.location.hash !== "#contact-form") {
        return;
      }

      const target = document.getElementById("contact-form");
      if (!target) {
        return;
      }

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches;
      target.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
    };

    const frame = window.requestAnimationFrame(scrollToForm);
    window.addEventListener("hashchange", scrollToForm);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", scrollToForm);
    };
  }, []);

  function fieldId(name: string) {
    return `${formId}-${name}`;
  }

  function errorId(name: string) {
    return `${fieldId(name)}-error`;
  }

  function describedBy(name: keyof ContactMessageFieldErrors) {
    return errors[name] ? errorId(name) : undefined;
  }

  function updateField<K extends keyof ContactMessageValues>(
    name: K,
    value: ContactMessageValues[K],
  ) {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => {
      if (!(name in current)) {
        return current;
      }

      const next = { ...current };
      delete next[name as keyof ContactMessageFieldErrors];
      return next;
    });
    setStatusKind(null);
    setStatusMessage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) {
      return;
    }

    const nextErrors = validateContactMessage(values, copy.errors);
    setErrors(nextErrors);

    if (hasContactMessageErrors(nextErrors)) {
      setStatusKind(null);
      setStatusMessage(null);
      const firstError = Object.keys(nextErrors)[0];
      if (firstError) {
        document.getElementById(fieldId(firstError))?.focus();
      }
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);
    setStatusKind(null);
    setStatusMessage(null);

    try {
      const result = await submitContactEnquiryAction({
        ...values,
        companyWebsite: honeypot,
      });

      if (!result.ok) {
        setStatusKind("error");
        setStatusMessage(copy.submitError);
        return;
      }

      setValues(initialValues);
      setHoneypot("");
      setErrors({});
      setStatusKind("success");
      setStatusMessage(copy.success);
    } catch {
      setStatusKind("error");
      setStatusMessage(copy.submitError);
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  const inquiryOptions = contactInquiryTypeIds.map((id) => ({
    value: id,
    label: copy.inquiryTypes[id],
  }));

  return (
    <section
      id="contact-form"
      className={`oms-contact-message ${contactMessageSans.variable}`}
      aria-labelledby="oms-contact-message-heading"
      data-locale={locale}
    >
      <Container className="oms-contact-message-inner">
        <div className="oms-contact-message-grid">
          <div className="oms-contact-message-form-col">
            <p className="oms-contact-message-eyebrow">{copy.eyebrow}</p>
            <h2
              id="oms-contact-message-heading"
              className={`oms-contact-message-title${locale === "ar" ? " oms-contact-message-title-tight" : ""}`}
            >
              <span className="oms-contact-message-title-lead">
                {copy.titleLead}
              </span>
              <span className="oms-contact-message-title-accent">
                {copy.titleAccent}
              </span>
            </h2>
            <p className="oms-contact-message-description">{copy.description}</p>

            <form
              noValidate
              onSubmit={handleSubmit}
              className="oms-contact-message-form"
              aria-busy={submitting}
              aria-describedby={
                statusMessage ? `${formId}-status` : undefined
              }
            >
              <div className="oms-contact-honeypot" aria-hidden="true">
                <label htmlFor={fieldId("companyWebsite")}>Company website</label>
                <input
                  id={fieldId("companyWebsite")}
                  name="companyWebsite"
                  type="text"
                  value={honeypot}
                  onChange={(event) => setHoneypot(event.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="oms-contact-message-fields">
                <FormField
                  id={fieldId("fullName")}
                  label={copy.fullName}
                  required
                  requiredLabel={copy.required}
                  optionalLabel={copy.optional}
                  error={errors.fullName}
                  errorId={errorId("fullName")}
                >
                  <TextInput
                    id={fieldId("fullName")}
                    name="fullName"
                    value={values.fullName}
                    onChange={(value) => updateField("fullName", value)}
                    autoComplete="name"
                    required
                    invalid={Boolean(errors.fullName)}
                    describedBy={describedBy("fullName")}
                  />
                </FormField>

                <FormField
                  id={fieldId("companyName")}
                  label={copy.companyName}
                  requiredLabel={copy.required}
                  optionalLabel={copy.optional}
                >
                  <TextInput
                    id={fieldId("companyName")}
                    name="companyName"
                    value={values.companyName}
                    onChange={(value) => updateField("companyName", value)}
                    autoComplete="organization"
                  />
                </FormField>

                <FormField
                  id={fieldId("email")}
                  label={copy.email}
                  required
                  requiredLabel={copy.required}
                  optionalLabel={copy.optional}
                  error={errors.email}
                  errorId={errorId("email")}
                >
                  <TextInput
                    id={fieldId("email")}
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={(value) => updateField("email", value)}
                    autoComplete="email"
                    required
                    invalid={Boolean(errors.email)}
                    describedBy={describedBy("email")}
                  />
                </FormField>

                <FormField
                  id={fieldId("phone")}
                  label={copy.phone}
                  requiredLabel={copy.required}
                  optionalLabel={copy.optional}
                >
                  <TextInput
                    id={fieldId("phone")}
                    name="phone"
                    type="tel"
                    value={values.phone}
                    onChange={(value) => updateField("phone", value)}
                    autoComplete="tel"
                  />
                </FormField>

                <div className="oms-contact-message-field-full">
                  <FormField
                    id={fieldId("inquiryType")}
                    label={copy.inquiryType}
                    required
                    requiredLabel={copy.required}
                    optionalLabel={copy.optional}
                    error={errors.inquiryType}
                    errorId={errorId("inquiryType")}
                  >
                    <SelectField
                      id={fieldId("inquiryType")}
                      name="inquiryType"
                      value={values.inquiryType}
                      onChange={(value) => updateField("inquiryType", value)}
                      placeholder={copy.selectInquiry}
                      options={inquiryOptions}
                      required
                      invalid={Boolean(errors.inquiryType)}
                      describedBy={describedBy("inquiryType")}
                    />
                  </FormField>
                </div>

                <div className="oms-contact-message-field-full">
                  <FormField
                    id={fieldId("message")}
                    label={copy.message}
                    required
                    requiredLabel={copy.required}
                    optionalLabel={copy.optional}
                    error={errors.message}
                    errorId={errorId("message")}
                  >
                    <TextArea
                      id={fieldId("message")}
                      name="message"
                      value={values.message}
                      onChange={(value) => updateField("message", value)}
                      placeholder={copy.messagePlaceholder}
                      required
                      invalid={Boolean(errors.message)}
                      describedBy={describedBy("message")}
                      rows={7}
                    />
                  </FormField>
                </div>
              </div>

              {statusMessage ? (
                <p
                  id={`${formId}-status`}
                  className={
                    statusKind === "error"
                      ? "oms-contact-message-status oms-contact-message-status-error"
                      : "oms-contact-message-status"
                  }
                  role={statusKind === "error" ? "alert" : "status"}
                >
                  {statusMessage}
                </p>
              ) : null}

              <button
                type="submit"
                className="oms-contact-message-submit"
                disabled={submitting}
              >
                <span>{submitting ? copy.submitting : copy.submit}</span>
                <ArrowRight
                  className="oms-contact-message-submit-arrow"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
                <span className="sr-only">{mapsArrow}</span>
              </button>
            </form>
          </div>

          <aside
            className="oms-contact-location"
            aria-labelledby="oms-contact-location-heading"
          >
            <div className="oms-contact-map-preview">
              <iframe
                className="oms-contact-map-embed"
                src={getOmsGoogleMapsEmbedUrl(locale)}
                title={location.mapEmbedTitle}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <a
                className="oms-contact-map-preview-cta"
                href={OMS_GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${location.mapsCta} ${mapsArrow}`}
              >
                <span>{location.mapsCta}</span>
                <ArrowRight
                  className="oms-contact-map-preview-arrow"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
                <span className="sr-only">{mapsArrow}</span>
              </a>
            </div>

            <p className="oms-contact-message-eyebrow">{location.eyebrow}</p>
            <h2
              id="oms-contact-location-heading"
              className="oms-contact-message-title oms-contact-location-title"
            >
              <span className="oms-contact-message-title-lead">
                {location.titleLead}
              </span>
              <span className="oms-contact-message-title-accent">
                {location.titleAccent}
              </span>
            </h2>
            <p className="oms-contact-message-description">
              {location.description}
            </p>

            <a
              className="oms-contact-location-maps"
              href={OMS_GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${location.mapsCta} ${mapsArrow}`}
            >
              <span>{location.mapsCta}</span>
              <ArrowRight
                className="oms-contact-location-maps-arrow"
                strokeWidth={1.8}
                aria-hidden="true"
              />
              <span className="sr-only">{mapsArrow}</span>
            </a>
          </aside>
        </div>
      </Container>
    </section>
  );
}
