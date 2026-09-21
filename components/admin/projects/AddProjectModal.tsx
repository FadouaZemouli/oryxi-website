"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ProjectForm } from "@/components/admin/projects/ProjectForm";
import type { ProjectClientOption } from "@/lib/admin/projects/types";

const FORM_ID = "oms-admin-add-project-form";

type AddProjectModalProps = {
  open: boolean;
  onClose: () => void;
  clientOptions: ProjectClientOption[];
};

export function AddProjectModal({
  open,
  onClose,
  clientOptions,
}: AddProjectModalProps) {
  const titleId = useId();
  const subtitleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const busyRef = useRef(false);
  const onCloseRef = useRef(onClose);
  const [busy, setBusy] = useState(false);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    busyRef.current = busy;
  }, [busy]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setFormKey((current) => current + 1);
    setBusy(false);
    busyRef.current = false;

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
  }, [open]);

  if (!open) {
    return null;
  }

  function requestClose() {
    if (busyRef.current || busy) {
      return;
    }

    onClose();
  }

  return (
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
                Add New Project
              </h2>
              <p
                id={subtitleId}
                className="oms-admin-add-project-modal-subtitle"
              >
                Create a new OMS project and manage its website content.
              </p>
            </div>
            <button
              ref={closeRef}
              type="button"
              className="oms-admin-add-project-modal-close"
              aria-label="Close add project dialog"
              onClick={requestClose}
              disabled={busy}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
        </header>

        <div ref={bodyRef} className="oms-admin-add-project-modal-body">
          <ProjectForm
            key={formKey}
            variant="modal"
            formId={FORM_ID}
            hideActions
            clientOptions={clientOptions}
            onPendingChange={setBusy}
            onCreated={onClose}
            onCancel={requestClose}
          />
        </div>

        <footer className="oms-admin-add-project-modal-footer">
          <button
            type="button"
            className="oms-admin-add-project-modal-cancel"
            onClick={requestClose}
            disabled={busy}
          >
            Cancel
          </button>
          <button
            type="submit"
            form={FORM_ID}
            className="oms-admin-submit oms-admin-add-project-modal-submit"
            disabled={busy}
          >
            {busy ? "Creating…" : "Create Project"}
          </button>
        </footer>
      </div>
    </div>
  );
}
