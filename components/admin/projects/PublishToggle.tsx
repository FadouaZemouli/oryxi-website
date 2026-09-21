"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { setProjectPublishedAction } from "@/lib/admin/projects/actions";

function PublishIcon() {
  return (
    <svg
      className="oms-admin-confirm-icon-svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 10 10A10.01 10.01 0 0 0 12 2Zm-1 14.59L7.41 13 8.83 11.59 11 13.76l4.59-4.58L17 10.59 11 16.59Z"
      />
    </svg>
  );
}

export function PublishToggle({
  id,
  title,
  published,
}: {
  id: string;
  title: string;
  published: boolean;
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

  const nextPublished = !published;
  const confirmTitle = nextPublished ? "Publish Project?" : "Unpublish Project?";
  const confirmAction = nextPublished ? "Publish Project" : "Unpublish Project";

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
        className="oms-admin-table-action"
        type="button"
        onClick={() => setOpen(true)}
      >
        {published ? "Unpublish" : "Publish"}
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
              await setProjectPublishedAction(formData);
            });
          }}
        >
          <input type="hidden" name="id" value={id} />
          <input
            type="hidden"
            name="published"
            value={nextPublished ? "true" : "false"}
          />
          <div className="oms-admin-confirm-icon" aria-hidden="true">
            <PublishIcon />
          </div>
          <h2 id={titleId} className="oms-admin-confirm-title">
            {confirmTitle}
          </h2>
          <p id={messageId} className="oms-admin-confirm-copy">
            <strong className="oms-admin-confirm-name">
              &ldquo;{projectName}&rdquo;
            </strong>{" "}
            {nextPublished
              ? "will be marked as published."
              : "will be marked as unpublished."}
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
              {pending
                ? nextPublished
                  ? "Publishing…"
                  : "Unpublishing…"
                : confirmAction}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
