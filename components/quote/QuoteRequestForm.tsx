"use client";

import { useId, useState, type FormEvent } from "react";
import { CheckboxField } from "@/components/forms/CheckboxField";
import { FileField } from "@/components/forms/FileField";
import { FormField } from "@/components/forms/FormField";
import { FormSection } from "@/components/forms/FormSection";
import { RadioGroup } from "@/components/forms/RadioGroup";
import { SelectField } from "@/components/forms/SelectField";
import { TextArea } from "@/components/forms/TextArea";
import { TextInput } from "@/components/forms/TextInput";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { buildQuoteRequestPayload } from "@/lib/quote/payload";
import { quoteServiceOptionIds } from "@/lib/quote/service-options";
import type {
  PreferredContactMethod,
  QuoteFieldErrors,
  QuoteRequestValues,
} from "@/lib/quote/types";
import {
  hasQuoteFieldErrors,
  validateQuoteRequest,
} from "@/lib/quote/validate";

const ACCEPTED_ATTACHMENT_TYPES = [
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
].join(",");

const initialValues: QuoteRequestValues = {
  fullName: "",
  companyName: "",
  email: "",
  phone: "",
  service: "",
  projectName: "",
  location: "",
  preferredContactMethod: "",
  message: "",
  consent: false,
};

type QuoteRequestFormProps = {
  copy: Dictionary["quote"];
};

export function QuoteRequestForm({ copy }: QuoteRequestFormProps) {
  const formId = useId();
  const [values, setValues] = useState<QuoteRequestValues>(initialValues);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [errors, setErrors] = useState<QuoteFieldErrors>({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  function fieldId(name: string) {
    return `${formId}-${name}`;
  }

  function errorId(name: string) {
    return `${fieldId(name)}-error`;
  }

  function describedBy(name: keyof QuoteFieldErrors, extraId?: string) {
    const ids = [errors[name] ? errorId(name) : null, extraId ?? null].filter(
      Boolean,
    );
    return ids.length ? ids.join(" ") : undefined;
  }

  function updateField<K extends keyof QuoteRequestValues>(
    name: K,
    value: QuoteRequestValues[K],
  ) {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => {
      if (!current[name]) {
        return current;
      }

      const next = { ...current };
      delete next[name];
      return next;
    });
    setStatusMessage(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateQuoteRequest(values, copy.errors);
    setErrors(nextErrors);

    if (hasQuoteFieldErrors(nextErrors)) {
      setStatusMessage(null);
      const firstError = (Object.keys(nextErrors)[0] ?? "") as string;
      document.getElementById(fieldId(firstError))?.focus();
      return;
    }

    // Payload is ready for a future Server Action or API route.
    buildQuoteRequestPayload(values, attachment);
    setStatusMessage(copy.notConnected);
  }

  const serviceOptions = quoteServiceOptionIds.map((id) => ({
    value: id,
    label: copy.services[id],
  }));

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="mt-8 space-y-6"
      aria-describedby={statusMessage ? `${formId}-status` : undefined}
    >
      <FormSection title={copy.contactSection}>
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
            placeholder={copy.placeholders.fullName}
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
            placeholder={copy.placeholders.companyName}
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
            placeholder={copy.placeholders.email}
            required
            invalid={Boolean(errors.email)}
            describedBy={describedBy("email")}
          />
        </FormField>
        <FormField
          id={fieldId("phone")}
          label={copy.phone}
          required
          requiredLabel={copy.required}
          optionalLabel={copy.optional}
          error={errors.phone}
          errorId={errorId("phone")}
        >
          <TextInput
            id={fieldId("phone")}
            name="phone"
            type="tel"
            value={values.phone}
            onChange={(value) => updateField("phone", value)}
            autoComplete="tel"
            placeholder={copy.placeholders.phone}
            required
            invalid={Boolean(errors.phone)}
            describedBy={describedBy("phone")}
          />
        </FormField>
      </FormSection>

      <FormSection title={copy.requestSection}>
        <FormField
          id={fieldId("service")}
          label={copy.service}
          required
          requiredLabel={copy.required}
          optionalLabel={copy.optional}
          error={errors.service}
          errorId={errorId("service")}
        >
          <SelectField
            id={fieldId("service")}
            name="service"
            value={values.service}
            onChange={(value) =>
              updateField(
                "service",
                value as QuoteRequestValues["service"],
              )
            }
            placeholder={copy.selectService}
            options={serviceOptions}
            required
            invalid={Boolean(errors.service)}
            describedBy={describedBy("service")}
          />
        </FormField>
        <FormField
          id={fieldId("projectName")}
          label={copy.projectName}
          requiredLabel={copy.required}
          optionalLabel={copy.optional}
        >
          <TextInput
            id={fieldId("projectName")}
            name="projectName"
            value={values.projectName}
            onChange={(value) => updateField("projectName", value)}
            autoComplete="off"
            placeholder={copy.placeholders.projectName}
          />
        </FormField>
        <FormField
          id={fieldId("location")}
          label={copy.location}
          requiredLabel={copy.required}
          optionalLabel={copy.optional}
        >
          <TextInput
            id={fieldId("location")}
            name="location"
            value={values.location}
            onChange={(value) => updateField("location", value)}
            autoComplete="address-level2"
            placeholder={copy.placeholders.location}
          />
        </FormField>
        <div className="sm:col-span-2">
          <RadioGroup
            name="preferredContactMethod"
            legend={copy.preferredContact}
            value={values.preferredContactMethod}
            onChange={(value) =>
              updateField(
                "preferredContactMethod",
                value as PreferredContactMethod,
              )
            }
            options={[
              { value: "phone", label: copy.contactPhone },
              { value: "email", label: copy.contactEmail },
            ]}
          />
        </div>
      </FormSection>

      <FormSection title={copy.detailsSection}>
        <div className="sm:col-span-2">
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
              placeholder={copy.placeholders.message}
              required
              invalid={Boolean(errors.message)}
              describedBy={describedBy("message")}
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection title={copy.attachmentSection}>
        <div className="sm:col-span-2">
          <FileField
            id={fieldId("attachment")}
            name="attachment"
            label={copy.attachment}
            hint={copy.attachmentHelp}
            hintId={fieldId("attachment-hint")}
            noneLabel={copy.attachmentNone}
            removeLabel={copy.attachmentRemove}
            accept={ACCEPTED_ATTACHMENT_TYPES}
            file={attachment}
            onChange={setAttachment}
          />
        </div>
      </FormSection>

      <FormSection title={copy.consentSection}>
        <div className="sm:col-span-2">
          <CheckboxField
            id={fieldId("consent")}
            name="consent"
            checked={values.consent}
            onChange={(checked) => updateField("consent", checked)}
            label={copy.consent}
            required
            invalid={Boolean(errors.consent)}
            describedBy={describedBy("consent")}
            error={errors.consent}
            errorId={errorId("consent")}
          />
        </div>
      </FormSection>

      {statusMessage ? (
        <p
          id={`${formId}-status`}
          className="border border-oms-gray/70 bg-oms-white px-4 py-3 text-sm text-oms-dark"
          role="status"
        >
          {statusMessage}
        </p>
      ) : null}

      <PrimaryButton type="submit">{copy.submit}</PrimaryButton>
    </form>
  );
}
