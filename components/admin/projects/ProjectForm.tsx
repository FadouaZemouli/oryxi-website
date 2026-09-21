"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createProjectAction,
  updateProjectAction,
  updateProjectMediaAction,
} from "@/lib/admin/projects/actions";
import { emptyProjectFormState } from "@/lib/admin/projects/form";
import { slugifyProjectTitle, parseGallery } from "@/lib/admin/projects/helpers";
import {
  parseProjectDetailsInput,
  parseQcddYear,
} from "@/lib/admin/projects/details";
import { uploadPendingProjectMedia } from "@/lib/admin/projects/media";
import { createClient } from "@/lib/supabase/client";
import type { AdminProject, ProjectClientOption } from "@/lib/admin/projects/types";
import {
  ProjectMediaFields,
  type ProjectMediaFieldsHandle,
} from "@/components/admin/projects/ProjectMediaFields";
import { ProjectDetailsEditor } from "@/components/admin/projects/ProjectDetailsEditor";

type ProjectFormProps = {
  project?: AdminProject;
  clientOptions?: ProjectClientOption[];
  notice?: string | null;
  variant?: "page" | "modal";
  formId?: string;
  hideActions?: boolean;
  onCancel?: () => void;
  onCreated?: () => void;
  onSaved?: () => void;
  onPendingChange?: (pending: boolean) => void;
};

export function ProjectForm({
  project,
  clientOptions = [],
  notice = null,
  variant = "page",
  formId,
  hideActions = false,
  onCancel,
  onCreated,
  onSaved,
  onPendingChange,
}: ProjectFormProps) {
  const router = useRouter();
  const isEdit = Boolean(project);
  const isModal = variant === "modal";
  const mediaRef = useRef<ProjectMediaFieldsHandle>(null);
  const [titleEn, setTitleEn] = useState(project?.title_en ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [slugLocked, setSlugLocked] = useState(Boolean(project?.slug));
  const [error, setError] = useState<string | null>(
    notice === "media"
      ? "Project saved, but images could not be uploaded. Add them here."
      : null,
  );
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [mediaBusy, setMediaBusy] = useState(false);
  const [published, setPublished] = useState(project?.published ?? false);
  const [clientId, setClientId] = useState(project?.client_id ?? "");

  const saving = pending || mediaBusy;

  const clientChoices = (() => {
    if (
      project?.client_id &&
      !clientOptions.some((client) => client.id === project.client_id)
    ) {
      return [
        {
          id: project.client_id,
          name: project.client_name?.trim() || "Assigned client",
          status: "inactive" as const,
        },
        ...clientOptions,
      ];
    }
    return clientOptions;
  })();

  useEffect(() => {
    onPendingChange?.(saving);
  }, [saving, onPendingChange]);

  function handleTitleEnChange(value: string) {
    setTitleEn(value);
    if (!slugLocked) {
      setSlug(slugifyProjectTitle(value));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const media = mediaRef.current;
    const persistedCover = media?.persistedCoverUrl() ?? "";
    const persistedGallery = media?.persistedGalleryUrls() ?? [];
    const qcddYear = parseQcddYear(formData.get("qcdd_year"));
    const projectDetails = parseProjectDetailsInput(formData.get("project_details"));

    if (!qcddYear.ok) {
      setError(qcddYear.error);
      setPending(false);
      return;
    }

    if (!projectDetails.ok) {
      setError(projectDetails.error);
      setPending(false);
      return;
    }

    try {
      if (project) {
        formData.set("cover_image_url", persistedCover);
        formData.set("gallery", persistedGallery.join("\n"));
        const result = await updateProjectAction(
          project.id,
          emptyProjectFormState,
          formData,
        );
        if (result.error) {
          setError(result.error);
          return;
        }

        onSaved?.();
        router.replace("/admin/projects?notice=saved");
        router.refresh();
        return;
      }

      formData.set("cover_image_url", "");
      formData.set("gallery", "");
      const created = await createProjectAction(emptyProjectFormState, formData);
      if (created.error || !created.id) {
        setError(created.error ?? "Unable to save this project. Please try again.");
        return;
      }

      const pendingCover = media?.pendingCoverFile() ?? null;
      const pendingGallery = media?.pendingGalleryFiles() ?? [];

      if (pendingCover || pendingGallery.length > 0) {
        const uploaded = await uploadPendingProjectMedia(
          createClient(),
          created.id,
          pendingCover,
          pendingGallery,
        );

        if (uploaded.coverUrl || uploaded.galleryUrls.length > 0) {
          const mediaResult = await updateProjectMediaAction(
            created.id,
            uploaded.coverUrl,
            uploaded.galleryUrls,
          );

          if (mediaResult.error || uploaded.error) {
            onCreated?.();
            router.replace(`/admin/projects/${created.id}/edit?notice=media`);
            router.refresh();
            return;
          }
        } else if (uploaded.error) {
          onCreated?.();
          router.replace(`/admin/projects/${created.id}/edit?notice=media`);
          router.refresh();
          return;
        }
      }

      onCreated?.();
      router.replace("/admin/projects?notice=created");
      router.refresh();
    } catch {
      setError("Unable to save this project. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      id={formId}
      className={
        isModal
          ? "oms-admin-project-form oms-admin-project-form-modal"
          : "oms-admin-project-form"
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

      <section className="oms-admin-form-section" aria-labelledby="oms-project-info-heading">
        <h2 id="oms-project-info-heading">Project Information</h2>
        <div className="oms-admin-form-grid">
          <div className="oms-admin-field">
            <label className="oms-admin-label" htmlFor="title_en">
              Title (English)
            </label>
            <input
              id="title_en"
              className="oms-admin-input"
              name="title_en"
              value={titleEn}
              onChange={(event) => handleTitleEnChange(event.target.value)}
              required
            />
          </div>
          <div className="oms-admin-field">
            <label className="oms-admin-label" htmlFor="title_ar">
              Title (Arabic)
            </label>
            <input
              id="title_ar"
              className="oms-admin-input"
              name="title_ar"
              dir="rtl"
              defaultValue={project?.title_ar ?? ""}
              required
            />
          </div>
          <div className="oms-admin-field">
            <label className="oms-admin-label" htmlFor="slug">
              Slug
            </label>
            <input
              id="slug"
              className="oms-admin-input"
              name="slug"
              value={slug}
              onChange={(event) => {
                setSlugLocked(true);
                setSlug(event.target.value);
              }}
              placeholder="doha-fire-protection-upgrade"
            />
            <p className="oms-admin-field-hint">
              Generated from the English title until you edit it.
            </p>
          </div>
          <div className="oms-admin-field">
            <label className="oms-admin-label" htmlFor="project_status">
              Status
            </label>
            <select
              id="project_status"
              className="oms-admin-input"
              name="project_status"
              defaultValue={project?.project_status ?? "ongoing"}
            >
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="oms-admin-field">
            <label className="oms-admin-label" htmlFor="client_id">
              Client
            </label>
            <select
              id="client_id"
              className="oms-admin-input"
              name="client_id"
              value={clientId}
              onChange={(event) => setClientId(event.target.value)}
              aria-describedby={
                clientChoices.length === 0
                  ? "oms-project-client-hint"
                  : undefined
              }
            >
              <option value="">No client assigned</option>
              {clientChoices.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
            {clientChoices.length === 0 ? (
              <p id="oms-project-client-hint" className="oms-admin-field-hint">
                Add clients from the Clients section.
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="oms-admin-form-section" aria-labelledby="oms-project-location-heading">
        <h2 id="oms-project-location-heading">Location</h2>
        <div className="oms-admin-form-grid">
          <div className="oms-admin-field">
            <label className="oms-admin-label" htmlFor="location_en">
              Location (English)
            </label>
            <input
              id="location_en"
              className="oms-admin-input"
              name="location_en"
              defaultValue={project?.location_en ?? ""}
            />
          </div>
          <div className="oms-admin-field">
            <label className="oms-admin-label" htmlFor="location_ar">
              Location (Arabic)
            </label>
            <input
              id="location_ar"
              className="oms-admin-input"
              name="location_ar"
              dir="rtl"
              defaultValue={project?.location_ar ?? ""}
            />
          </div>
        </div>
      </section>

      <section className="oms-admin-form-section" aria-labelledby="oms-project-scope-heading">
        <h2 id="oms-project-scope-heading">Content / Scope</h2>
        <div className="oms-admin-form-grid">
          <div className="oms-admin-field">
            <label className="oms-admin-label" htmlFor="scope_en">
              Scope (English)
            </label>
            <textarea
              id="scope_en"
              className="oms-admin-input oms-admin-textarea"
              name="scope_en"
              rows={6}
              defaultValue={project?.scope_en ?? ""}
            />
          </div>
          <div className="oms-admin-field">
            <label className="oms-admin-label" htmlFor="scope_ar">
              Scope (Arabic)
            </label>
            <textarea
              id="scope_ar"
              className="oms-admin-input oms-admin-textarea"
              name="scope_ar"
              dir="rtl"
              rows={6}
              defaultValue={project?.scope_ar ?? ""}
            />
          </div>
        </div>
      </section>

      <section className="oms-admin-form-section" aria-labelledby="oms-project-details-heading">
        <h2 id="oms-project-details-heading">Project Details</h2>
        <p className="oms-admin-field-hint">
          Optional structured information such as project locations, stations or systems.
        </p>
        <ProjectDetailsEditor initialDetails={project?.project_details ?? []} />
      </section>

      <section className="oms-admin-form-section" aria-labelledby="oms-project-media-heading">
        <h2 id="oms-project-media-heading">Media</h2>
        <ProjectMediaFields
          ref={mediaRef}
          projectId={project?.id ?? null}
          initialCoverUrl={project?.cover_image_url ?? null}
          initialGalleryUrls={project ? parseGallery(project.gallery) : []}
          disabled={saving}
          onBusyChange={setMediaBusy}
        />
      </section>

      <section className="oms-admin-form-section" aria-labelledby="oms-project-website-heading">
        <h2 id="oms-project-website-heading">Website Settings</h2>
        <div className="oms-admin-settings-grid">
          <div className="oms-admin-settings-card">
            <h3 id="oms-project-visibility-heading">Website Visibility</h3>
            <div className="oms-admin-visibility">
              <label className="oms-admin-switch-control" htmlFor="published">
                <input
                  id="published"
                  className="oms-admin-sr-only"
                  name="published"
                  type="checkbox"
                  checked={published}
                  onChange={(event) => setPublished(event.target.checked)}
                  aria-describedby="oms-project-visibility-hint"
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
              <p id="oms-project-visibility-hint" className="oms-admin-field-hint">
                {published
                  ? "This project can be displayed on the public OMS website."
                  : "This project is saved in the admin panel but hidden from the public website."}
              </p>
            </div>
          </div>

          <div className="oms-admin-settings-card">
            <h3 id="oms-project-order-heading">Project Order</h3>
            <div className="oms-admin-order-control">
              <span className="oms-admin-order-handle" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </span>
              <input
                id="sort_order"
                className="oms-admin-input oms-admin-order-input"
                name="sort_order"
                type="number"
                step="1"
                defaultValue={project?.sort_order ?? 0}
                aria-labelledby="oms-project-order-heading"
                aria-describedby="oms-project-order-hint"
              />
            </div>
            <p id="oms-project-order-hint" className="oms-admin-field-hint">
              Lower numbers appear first. You can also reorder projects from the Projects page.
            </p>
          </div>

          <div className="oms-admin-settings-card">
            <h3 id="oms-project-qcdd-heading">QCDD Certificate Year</h3>
            <input
              id="qcdd_year"
              className="oms-admin-input"
              name="qcdd_year"
              defaultValue={project?.qcdd_year ?? ""}
              placeholder="2026 or 2024–2025"
              autoComplete="off"
              aria-labelledby="oms-project-qcdd-heading"
              aria-describedby="oms-project-qcdd-hint"
            />
            <p id="oms-project-qcdd-hint" className="oms-admin-field-hint">
              Optional. Leave blank if this project has no QCDD certificate year.
            </p>
          </div>
        </div>
      </section>

      {hideActions || isModal ? null : (
        <div className="oms-admin-form-actions">
          <button className="oms-admin-submit" type="submit" disabled={saving}>
            {pending ? "Saving…" : isEdit ? "Save Project" : "Create Project"}
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
            <Link className="oms-admin-aux-link" href="/admin/projects">
              Cancel
            </Link>
          )}
        </div>
      )}
    </form>
  );
}
