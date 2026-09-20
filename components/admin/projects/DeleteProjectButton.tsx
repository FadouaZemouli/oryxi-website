"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { deleteProjectAction } from "@/lib/admin/projects/actions";

function DeleteIcon() {
  return (
    <svg
      className="oms-admin-confirm-icon-svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M9 3h6a1 1 0 0 1 1 1v1h4v2H4V5h4V4a1 1 0 0 1 1-1Zm1 2v0h4V5h-4ZM6 9h12l-.7 11.1A2 2 0 0 1 15.3 22H8.7a2 2 0 0 1-2-1.9L6 9Zm4 2v8h2v-8h-2Zm4 0v8h2v-8h-2Z"
      />
    </svg>
  );
}

export function DeleteProjectButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const projectName = title.trim() || "this project";
  const titleId = useId();
  const messageId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const wasOpenRef = useRef(false);

  useEffect(() => {
    const node = dialogRef.current;
    if (!node) {
      return;
    }

    if (open) {
      wasOpenRef.current = true;
      if (!node.open) {
        node.showModal();
        cancelRef.current?.focus();
      }
      return;
    }

    if (node.open) {
      node.close();
    }

    if (wasOpenRef.current) {
      wasOpenRef.current = false;
      triggerRef.current?.focus();
    }
  }, [open]);

  function closeModal() {
    if (pending) {
      return;
    }

    setOpen(false);
  }

  return (
    <>
      <button
        ref={triggerRef}
        className="oms-admin-table-action oms-admin-table-action-danger"
        type="button"
        onClick={() => setOpen(true)}
      >
        Delete
      </button>

      <dialog
        ref={dialogRef}
        className="oms-admin-confirm"
        aria-labelledby={titleId}
        aria-describedby={messageId}
        aria-modal="true"
        onClose={() => setOpen(false)}
        onCancel={(event) => {
          if (pending) {
            event.preventDefault();
            return;
          }

          setOpen(false);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeModal();
          }
        }}
      >
        <form
          className="oms-admin-confirm-card"
          action={(formData) => {
            if (pending) {
              return;
            }

            startTransition(async () => {
              await deleteProjectAction(formData);
            });
          }}
        >
          <input type="hidden" name="id" value={id} />
          <div className="oms-admin-confirm-icon" aria-hidden="true">
            <DeleteIcon />
          </div>
          <h2 id={titleId} className="oms-admin-confirm-title">
            Delete project?
          </h2>
          <p id={messageId} className="oms-admin-confirm-copy">
            You&apos;re about to permanently delete{" "}
            <strong className="oms-admin-confirm-name">“{projectName}”</strong>.
            This action cannot be undone.
          </p>
          <div className="oms-admin-confirm-actions">
            <button
              ref={cancelRef}
              className="oms-admin-confirm-cancel"
              type="button"
              onClick={closeModal}
              disabled={pending}
            >
              Cancel
            </button>
            <button
              className="oms-admin-confirm-delete"
              type="submit"
              disabled={pending}
            >
              {pending ? "Deleting…" : "Delete Project"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
