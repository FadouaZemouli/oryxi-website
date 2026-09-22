"use client";

import { useState, type FormEvent } from "react";
import { saveCompanyInformationAction } from "@/lib/admin/settings/actions";
import type { CompanyInformationValue } from "@/lib/admin/settings/types";

type CompanyInformationFormProps = {
  initialValues: CompanyInformationValue;
};

export function CompanyInformationForm({
  initialValues,
}: CompanyInformationFormProps) {
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function updateField<K extends keyof CompanyInformationValue>(
    key: K,
    next: CompanyInformationValue[K],
  ) {
    setValues((current) => ({ ...current, [key]: next }));
    setError(null);
    setSuccess(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);

    try {
      const result = await saveCompanyInformationAction(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      setSuccess(result.success ?? "Company information saved.");
    } catch {
      setError("Settings could not be saved. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      className="oms-admin-setting-form"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="oms-admin-setting-fields">
        <div className="oms-admin-setting-field">
          <label
            className="oms-admin-label"
            htmlFor="oms-admin-setting-company-name"
          >
            Company Name
          </label>
          <input
            id="oms-admin-setting-company-name"
            className="oms-admin-input"
            name="company_name"
            type="text"
            value={values.company_name}
            onChange={(event) => updateField("company_name", event.target.value)}
            maxLength={120}
            required
            disabled={pending}
            autoComplete="organization"
          />
        </div>

        <div className="oms-admin-setting-field">
          <label
            className="oms-admin-label"
            htmlFor="oms-admin-setting-official-email"
          >
            Official Email
          </label>
          <input
            id="oms-admin-setting-official-email"
            className="oms-admin-input"
            name="official_email"
            type="email"
            value={values.official_email}
            onChange={(event) =>
              updateField("official_email", event.target.value)
            }
            maxLength={254}
            required
            disabled={pending}
            autoComplete="email"
          />
        </div>

        <div className="oms-admin-setting-field">
          <label
            className="oms-admin-label"
            htmlFor="oms-admin-setting-phone"
          >
            Phone
          </label>
          <input
            id="oms-admin-setting-phone"
            className="oms-admin-input"
            name="phone"
            type="tel"
            value={values.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            maxLength={40}
            required
            disabled={pending}
            autoComplete="tel"
          />
        </div>

        <div className="oms-admin-setting-field">
          <label
            className="oms-admin-label"
            htmlFor="oms-admin-setting-location"
          >
            Location
          </label>
          <input
            id="oms-admin-setting-location"
            className="oms-admin-input"
            name="location"
            type="text"
            value={values.location}
            onChange={(event) => updateField("location", event.target.value)}
            maxLength={160}
            required
            disabled={pending}
            autoComplete="address-level2"
          />
        </div>

        <div className="oms-admin-setting-field oms-admin-setting-field-full">
          <label
            className="oms-admin-label"
            htmlFor="oms-admin-setting-website-url"
          >
            Website URL
          </label>
          <input
            id="oms-admin-setting-website-url"
            className="oms-admin-input"
            name="website_url"
            type="url"
            value={values.website_url}
            onChange={(event) =>
              updateField("website_url", event.target.value)
            }
            maxLength={300}
            required
            disabled={pending}
            autoComplete="url"
          />
        </div>
      </div>

      <p className="oms-admin-setting-note">
        Changes saved here do not currently update the public website.
      </p>

      {error ? (
        <p className="oms-admin-error" role="alert">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="oms-admin-success" role="status">
          {success}
        </p>
      ) : null}

      <div className="oms-admin-setting-actions">
        <button
          className="oms-admin-submit oms-admin-setting-save"
          type="submit"
          disabled={pending}
        >
          {pending ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
