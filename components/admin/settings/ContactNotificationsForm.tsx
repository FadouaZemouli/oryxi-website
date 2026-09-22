"use client";

import { useState, type FormEvent } from "react";
import { saveContactNotificationsAction } from "@/lib/admin/settings/actions";
import type { ContactNotificationsValue } from "@/lib/admin/settings/types";

type ContactNotificationsFormProps = {
  initialValues: ContactNotificationsValue;
};

export function ContactNotificationsForm({
  initialValues,
}: ContactNotificationsFormProps) {
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function updateField<K extends keyof ContactNotificationsValue>(
    key: K,
    next: ContactNotificationsValue[K],
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
      const result = await saveContactNotificationsAction(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      setSuccess(result.success ?? "Contact and notification settings saved.");
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
            htmlFor="oms-admin-setting-enquiry-email"
          >
            Enquiry Notification Email
          </label>
          <input
            id="oms-admin-setting-enquiry-email"
            className="oms-admin-input"
            name="enquiry_email"
            type="email"
            value={values.enquiry_email}
            onChange={(event) =>
              updateField("enquiry_email", event.target.value)
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
            htmlFor="oms-admin-setting-contact-number"
          >
            Contact Number
          </label>
          <input
            id="oms-admin-setting-contact-number"
            className="oms-admin-input"
            name="contact_number"
            type="tel"
            value={values.contact_number}
            onChange={(event) =>
              updateField("contact_number", event.target.value)
            }
            maxLength={40}
            required
            disabled={pending}
            autoComplete="tel"
          />
        </div>
      </div>

      <p className="oms-admin-setting-note">
        Notification delivery currently continues to use the existing website
        email configuration until integration is enabled.
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
