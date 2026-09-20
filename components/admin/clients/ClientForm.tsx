"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createClientAction,
  updateClientAction,
  updateClientLogoAction,
} from "@/lib/admin/clients/actions";
import { emptyClientFormState } from "@/lib/admin/clients/form";
import { uploadPendingClientLogo } from "@/lib/admin/clients/media";
import { createClient } from "@/lib/supabase/client";
import type {
  AdminClient,
  ClientLinkedProject,
} from "@/lib/admin/clients/types";
import {
  ClientLogoField,
  type ClientLogoFieldHandle,
} from "@/components/admin/clients/ClientLogoField";

type ClientFormProps = {
  client?: AdminClient;
  linkedProjects?: ClientLinkedProject[];
  defaultSortOrder?: number;
  notice?: string | null;
  variant?: "page" | "modal";
  formId?: string;
  hideActions?: boolean;
  onCancel?: () => void;
  onSaved?: () => void;
  onPendingChange?: (pending: boolean) => void;
};

export function ClientForm({
  client,
  linkedProjects = [],
  defaultSortOrder = 1,
  notice = null,
  variant = "page",
  formId,
  hideActions = false,
  onCancel,
  onSaved,
  onPendingChange,
}: ClientFormProps) {
  const router = useRouter();
  const isEdit = Boolean(client);
  const isModal = variant === "modal";
  const logoRef = useRef<ClientLogoFieldHandle>(null);
  const [error, setError] = useState<string | null>(
    notice === "media"
      ? "Client saved, but the logo could not be uploaded. Add it here."
      : null,
  );
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [mediaBusy, setMediaBusy] = useState(false);
  const [published, setPublished] = useState(client?.published ?? false);
  const [status, setStatus] = useState(client?.status ?? "active");

  const saving = pending || mediaBusy;

  useEffect(() => {
    onPendingChange?.(saving);
  }, [saving, onPendingChange]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const logo = logoRef.current;
    const persistedLogo = logo?.persistedLogoUrl() ?? "";

    try {
      if (client) {
        formData.set("logo_url", persistedLogo);
        const result = await updateClientAction(
          client.id,
          emptyClientFormState,
          formData,
        );
        if (result.error) {
          setError(result.error);
          return;
        }

        onSaved?.();
        router.replace("/admin/clients?notice=updated");
        router.refresh();
        return;
      }

      formData.set("logo_url", "");
      const created = await createClientAction(emptyClientFormState, formData);
      if (created.error || !created.id) {
        setError(created.error ?? "Unable to save this client. Please try again.");
        return;
      }

      const pendingLogo = logo?.pendingLogoFile() ?? null;
      if (pendingLogo) {
        const uploaded = await uploadPendingClientLogo(
          createClient(),
          created.id,
          pendingLogo,
        );

        if (uploaded.url) {
          const mediaResult = await updateClientLogoAction(
            created.id,
            uploaded.url,
          );
          if (mediaResult.error || uploaded.error) {
            onSaved?.();
            router.replace(`/admin/clients/${created.id}/edit?notice=media`);
            router.refresh();
            return;
          }
        } else if (uploaded.error) {
          onSaved?.();
          router.replace(`/admin/clients/${created.id}/edit?notice=media`);
          router.refresh();
          return;
        }
      }

      onSaved?.();
      router.replace("/admin/clients?notice=created");
      router.refresh();
    } catch {
      setError("Unable to save this client. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      id={formId}
      className={
        isModal
          ? "oms-admin-client-form oms-admin-client-form-modal"
          : "oms-admin-client-form"
      }
      onSubmit={handleSubmit}
      noValidate
    >
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

      <section
        className="oms-admin-form-section"
        aria-labelledby="oms-client-company-heading"
      >
        <h2 id="oms-client-company-heading">Company Information</h2>
        <div className="oms-admin-form-grid">
          <div className="oms-admin-field">
            <label className="oms-admin-label" htmlFor="name">
              Company Name
            </label>
            <input
              id="name"
              className="oms-admin-input"
              name="name"
              defaultValue={client?.name ?? ""}
              required
              autoComplete="organization"
            />
          </div>
          <div className="oms-admin-field">
            <label className="oms-admin-label" htmlFor="website_url">
              Website
            </label>
            <input
              id="website_url"
              className="oms-admin-input"
              name="website_url"
              type="url"
              inputMode="url"
              placeholder="https://example.com"
              defaultValue={client?.website_url ?? ""}
              autoComplete="url"
            />
          </div>
          <div className="oms-admin-field oms-admin-field-span">
            <ClientLogoField
              ref={logoRef}
              clientId={client?.id ?? null}
              initialLogoUrl={client?.logo_url ?? null}
              disabled={saving}
              onBusyChange={setMediaBusy}
            />
          </div>
        </div>
      </section>

      <section
        className="oms-admin-form-section"
        aria-labelledby="oms-client-contact-heading"
      >
        <h2 id="oms-client-contact-heading">Contact Information</h2>
        <div className="oms-admin-form-grid">
          <div className="oms-admin-field">
            <label className="oms-admin-label" htmlFor="contact_person">
              Contact Person
            </label>
            <input
              id="contact_person"
              className="oms-admin-input"
              name="contact_person"
              defaultValue={client?.contact_person ?? ""}
              autoComplete="name"
            />
          </div>
          <div className="oms-admin-field">
            <label className="oms-admin-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="oms-admin-input"
              name="email"
              type="email"
              inputMode="email"
              defaultValue={client?.email ?? ""}
              autoComplete="email"
            />
          </div>
          <div className="oms-admin-field">
            <label className="oms-admin-label" htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              className="oms-admin-input"
              name="phone"
              type="tel"
              inputMode="tel"
              defaultValue={client?.phone ?? ""}
              autoComplete="tel"
            />
          </div>
        </div>
      </section>

      <section
        className="oms-admin-form-section"
        aria-labelledby="oms-client-settings-heading"
      >
        <h2 id="oms-client-settings-heading">Client Settings</h2>
        <div className="oms-admin-settings-grid oms-admin-client-settings-grid">
          <div className="oms-admin-settings-card">
            <h3 id="oms-client-status-heading">Status</h3>
            <select
              id="status"
              className="oms-admin-input"
              name="status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value === "inactive" ? "inactive" : "active")
              }
              aria-labelledby="oms-client-status-heading"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <p className="oms-admin-field-hint">
              Active clients are available for project relationships.
            </p>
          </div>

          <div className="oms-admin-settings-card">
            <h3 id="oms-client-visibility-heading">Website Visibility</h3>
            <div className="oms-admin-visibility">
              <label className="oms-admin-switch-control" htmlFor="published">
                <input
                  id="published"
                  className="oms-admin-sr-only"
                  name="published"
                  type="checkbox"
                  checked={published}
                  onChange={(event) => setPublished(event.target.checked)}
                  aria-describedby="oms-client-visibility-hint"
                />
                <span
                  className={
                    published
                      ? "oms-admin-switch oms-admin-switch-published"
                      : "oms-admin-switch"
                  }
                  aria-hidden="true"
                >
                  <span className="oms-admin-switch-thumb" />
                </span>
                <span
                  className={
                    published
                      ? "oms-admin-visibility-state oms-admin-visibility-state-on"
                      : "oms-admin-visibility-state"
                  }
                >
                  {published ? "Published" : "Draft"}
                </span>
              </label>
              <p id="oms-client-visibility-hint" className="oms-admin-field-hint">
                {published
                  ? "This client can be shown on the public OMS website."
                  : "This client is saved in admin but hidden from the public website."}
              </p>
            </div>
          </div>

          <div className="oms-admin-settings-card">
            <h3 id="oms-client-order-heading">Sort Order</h3>
            <input
              id="sort_order"
              className="oms-admin-input oms-admin-order-input"
              name="sort_order"
              type="number"
              step="1"
              defaultValue={client?.sort_order ?? defaultSortOrder}
              aria-labelledby="oms-client-order-heading"
              aria-describedby="oms-client-order-hint"
            />
            <p id="oms-client-order-hint" className="oms-admin-field-hint">
              Lower numbers appear first in client listings.
            </p>
          </div>
        </div>
      </section>

      <section
        className="oms-admin-form-section"
        aria-labelledby="oms-client-notes-heading"
      >
        <h2 id="oms-client-notes-heading">Internal Notes</h2>
        <div className="oms-admin-field">
          <label className="oms-admin-label" htmlFor="notes">
            Notes
          </label>
          <textarea
            id="notes"
            className="oms-admin-input oms-admin-textarea"
            name="notes"
            rows={4}
            defaultValue={client?.notes ?? ""}
            aria-describedby="oms-client-notes-hint"
          />
          <p id="oms-client-notes-hint" className="oms-admin-field-hint">
            Internal only — not displayed on the public website.
          </p>
        </div>
      </section>

      {isEdit ? (
        <section
          className="oms-admin-form-section oms-admin-client-linked-projects"
          aria-labelledby="oms-client-linked-heading"
        >
          <h2 id="oms-client-linked-heading">Linked Projects</h2>
          {linkedProjects.length === 0 ? (
            <p className="oms-admin-empty">
              No projects are linked to this client yet.
            </p>
          ) : (
            <ul className="oms-admin-client-linked-list">
              {linkedProjects.map((project) => (
                <li key={project.id} className="oms-admin-client-linked-item">
                  <div>
                    <p className="oms-admin-client-linked-title">
                      {project.title_en.trim() || "Untitled project"}
                    </p>
                    <p className="oms-admin-client-meta">
                      {project.project_status === "completed"
                        ? "Completed"
                        : "Ongoing"}
                      {" · "}
                      {project.published ? "Published" : "Draft"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      {hideActions || isModal ? null : (
        <div className="oms-admin-form-actions">
          <button className="oms-admin-submit" type="submit" disabled={saving}>
            {pending ? "Saving…" : isEdit ? "Save Changes" : "Create Client"}
          </button>
          {onCancel ? (
            <button
              className="oms-admin-aux-link"
              type="button"
              onClick={onCancel}
              disabled={saving}
            >
              Cancel
            </button>
          ) : (
            <Link className="oms-admin-aux-link" href="/admin/clients">
              Cancel
            </Link>
          )}
        </div>
      )}
    </form>
  );
}
