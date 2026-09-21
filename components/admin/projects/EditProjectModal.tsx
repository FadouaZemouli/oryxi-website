"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ProjectForm } from "@/components/admin/projects/ProjectForm";
import { markProjectCompletedAction } from "@/lib/admin/projects/actions";
import type { AdminProject } from "@/lib/admin/projects/types";

const FORM_ID = "oms-admin-edit-project-form";

type EditProjectModalProps = {
  project: AdminProject | null;
  open: boolean;
  onClose: () => void;
};

function CheckIcon() {
  return (
    <svg
      className="oms-admin-edit-project-mark-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M9.55 17.6 4.9 12.95l1.4-1.4 3.25 3.25 7.15-7.15 1.4 1.4L9.55 17.6Z"
      />
    </svg>
  );
}

export function EditProjectModal({
  project,
  open,
  onClose,
}: EditProjectModalProps) {
  const router = useRouter();
  const titleId = useId();
  const subtitleId = useId();
  const confirmTitleId = useId();
  const confirmMessageId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const confirmDialogRef = useRef<HTMLDialogElement>(null);
  const confirmCancelRef = useRef<HTMLButtonElement>(null);
  const busyRef = useRef(false);
  const confirmOpenRef = useRef(false);
  const onCloseRef = useRef(onClose);
  const [busy, setBusy] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [markPending, startMarkTransition] = useTransition();

  const projectName = project?.title_en?.trim() || "Untitled project";
  const showMarkCompleted = project?.project_status === "ongoing";

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    busyRef.current = busy || markPending;
  }, [busy, markPending]);

  useEffect(() => {
    confirmOpenRef.current = confirmOpen;
  }, [confirmOpen]);

  useEffect(() => {
    if (!open || !project) {
      setConfirmOpen(false);
      setConfirmError(null);
      return;
    }

    setFormKey((current) => current + 1);
    setBusy(false);
    busyRef.current = false;
    setConfirmOpen(false);
    setConfirmError(null);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function resetBodyScroll() {
      if (bodyRef.current) {
        bodyRef.current.scrollTop = 0;
      }
    }

    resetBodyScroll();

    const frame = window.requestAnimationFrame(() => {
      resetBodyScroll();
      closeRef.current?.focus();
    });

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") {
        return;
      }

      if (confirmOpenRef.current) {
        return;
      }

      if (busyRef.current) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      onCloseRef.current();
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, project?.id]);

  useEffect(() => {
    const node = confirmDialogRef.current;
    if (!node) {
      return;
    }

    if (confirmOpen) {
      if (!node.open) {
        node.showModal();
        confirmCancelRef.current?.focus();
      }
      return;
    }

    if (node.open) {
      node.close();
    }
  }, [confirmOpen]);

  if (!open || !project) {
    return null;
  }

  function requestClose() {
    if (busyRef.current || busy || markPending || confirmOpen) {
      return;
    }

    onClose();
  }

  function closeConfirm() {
    if (markPending) {
      return;
    }

    setConfirmOpen(false);
    setConfirmError(null);
  }

  function handleMarkCompleted() {
    if (markPending || busy || !project) {
      return;
    }

    startMarkTransition(async () => {
      setConfirmError(null);
      const result = await markProjectCompletedAction(project.id);
      if (result.error) {
        setConfirmError(result.error);
        return;
      }

      setConfirmOpen(false);
      onClose();
      router.replace("/admin/projects?notice=completed");
      router.refresh();
    });
  }

  return (
    <>
      <div
        className="oms-admin-add-project-overlay"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            requestClose();
          }
        }}
      >
        <div
          className="oms-admin-add-project-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={subtitleId}
        >
          <header className="oms-admin-add-project-modal-header">
            <div
              className="oms-admin-add-project-modal-header-bg"
              aria-hidden="true"
            />
            <div className="oms-admin-add-project-modal-header-content">
              <div className="oms-admin-add-project-modal-heading">
                <h2 id={titleId} className="oms-admin-add-project-modal-title">
                  Edit Project
                </h2>
                <p
                  id={subtitleId}
                  className="oms-admin-add-project-modal-subtitle"
                >
                  {projectName}
                </p>
              </div>
              <button
                ref={closeRef}
                type="button"
                className="oms-admin-add-project-modal-close"
                aria-label="Close edit project dialog"
                onClick={requestClose}
                disabled={busy || markPending}
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
          </header>

          <div ref={bodyRef} className="oms-admin-add-project-modal-body">
            <ProjectForm
              key={formKey}
              project={project}
              variant="modal"
              formId={FORM_ID}
              hideActions
              onPendingChange={setBusy}
              onSaved={onClose}
              onCancel={requestClose}
            />
          </div>

          <footer className="oms-admin-add-project-modal-footer">
            {showMarkCompleted ? (
              <>
                <button
                  type="button"
                  className="oms-admin-edit-project-mark-completed"
                  onClick={() => {
                    setConfirmError(null);
                    setConfirmOpen(true);
                  }}
                  disabled={busy || markPending}
                >
                  <CheckIcon />
                  Mark as Completed
                </button>
                <div className="oms-admin-edit-project-footer-actions">
                  <button
                    type="button"
                    className="oms-admin-add-project-modal-cancel"
                    onClick={requestClose}
                    disabled={busy || markPending}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form={FORM_ID}
                    className="oms-admin-submit oms-admin-add-project-modal-submit"
                    disabled={busy || markPending}
                  >
                    {busy ? "Saving…" : "Save Project"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="oms-admin-add-project-modal-cancel"
                  onClick={requestClose}
                  disabled={busy || markPending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form={FORM_ID}
                  className="oms-admin-submit oms-admin-add-project-modal-submit"
                  disabled={busy || markPending}
                >
                  {busy ? "Saving…" : "Save Project"}
                </button>
              </>
            )}
          </footer>
        </div>
      </div>

      <dialog
        ref={confirmDialogRef}
        className="oms-admin-confirm"
        aria-labelledby={confirmTitleId}
        aria-describedby={confirmMessageId}
        aria-modal="true"
        onClose={() => {
          setConfirmOpen(false);
          setConfirmError(null);
        }}
        onCancel={(event) => {
          if (markPending) {
            event.preventDefault();
            return;
          }

          setConfirmOpen(false);
          setConfirmError(null);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeConfirm();
          }
        }}
      >
        <div className="oms-admin-confirm-card">
          <div className="oms-admin-confirm-icon" aria-hidden="true">
            <CheckIcon />
          </div>
          <h2 id={confirmTitleId} className="oms-admin-confirm-title">
            Mark Project as Completed?
          </h2>
          <p id={confirmMessageId} className="oms-admin-confirm-copy">
            <strong className="oms-admin-confirm-name">“{projectName}”</strong>{" "}
            will be moved from Ongoing to Completed.
          </p>
          {confirmError ? (
            <p className="oms-admin-error" role="alert">
              {confirmError}
            </p>
          ) : null}
          <div className="oms-admin-confirm-actions">
            <button
              ref={confirmCancelRef}
              className="oms-admin-confirm-cancel"
              type="button"
              onClick={closeConfirm}
              disabled={markPending}
            >
              Cancel
            </button>
            <button
              className="oms-admin-confirm-delete"
              type="button"
              onClick={handleMarkCompleted}
              disabled={markPending}
            >
              {markPending ? "Updating…" : "Mark as Completed"}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
