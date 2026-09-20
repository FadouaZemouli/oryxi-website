"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ClientForm } from "@/components/admin/clients/ClientForm";
import type {
  AdminClient,
  ClientLinkedProject,
} from "@/lib/admin/clients/types";

const ADD_FORM_ID = "oms-admin-add-client-form";
const EDIT_FORM_ID = "oms-admin-edit-client-form";

type ClientModalProps = {
  mode: "add" | "edit";
  open: boolean;
  onClose: () => void;
  client?: AdminClient | null;
  linkedProjects?: ClientLinkedProject[];
  defaultSortOrder?: number;
};

export function ClientModal({
  mode,
  open,
  onClose,
  client = null,
  linkedProjects = [],
  defaultSortOrder = 1,
}: ClientModalProps) {
  const titleId = useId();
  const subtitleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const busyRef = useRef(false);
  const onCloseRef = useRef(onClose);
  const [busy, setBusy] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const isEdit = mode === "edit";
  const formId = isEdit ? EDIT_FORM_ID : ADD_FORM_ID;

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

  if (isEdit && !client) {
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
      className="oms-admin-client-modal-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          requestClose();
        }
      }}
    >
      <div
        className="oms-admin-client-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={subtitleId}
      >
        <header className="oms-admin-client-modal-header">
          <div
            className="oms-admin-client-modal-header-bg"
            aria-hidden="true"
          />
          <div className="oms-admin-client-modal-header-content">
            <div className="oms-admin-client-modal-heading">
              <h2 id={titleId} className="oms-admin-client-modal-title">
                {isEdit ? "Edit Client" : "Add New Client"}
              </h2>
              <p id={subtitleId} className="oms-admin-client-modal-subtitle">
                {isEdit
                  ? "Update client details, contacts, and website settings."
                  : "Create a new OMS client and manage contact details."}
              </p>
            </div>
            <button
              ref={closeRef}
              type="button"
              className="oms-admin-client-modal-close"
              aria-label={
                isEdit ? "Close edit client dialog" : "Close add client dialog"
              }
              onClick={requestClose}
              disabled={busy}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
        </header>

        <div ref={bodyRef} className="oms-admin-client-modal-body">
          <ClientForm
            key={formKey}
            variant="modal"
            formId={formId}
            hideActions
            client={client ?? undefined}
            linkedProjects={isEdit ? linkedProjects : []}
            defaultSortOrder={defaultSortOrder}
            onPendingChange={setBusy}
            onSaved={onClose}
            onCancel={requestClose}
          />
        </div>

        <footer className="oms-admin-client-modal-footer">
          <button
            type="button"
            className="oms-admin-client-modal-cancel"
            onClick={requestClose}
            disabled={busy}
          >
            Cancel
          </button>
          <button
            type="submit"
            form={formId}
            className="oms-admin-submit oms-admin-client-modal-submit"
            disabled={busy}
          >
            {busy
              ? isEdit
                ? "Saving…"
                : "Creating…"
              : isEdit
                ? "Save Changes"
                : "Create Client"}
          </button>
        </footer>
      </div>
    </div>
  );
}
