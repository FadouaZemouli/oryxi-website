"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import {
  deleteClientAction,
  getClientLinkedProjectsAction,
} from "@/lib/admin/clients/actions";
import type { ClientLinkedProject } from "@/lib/admin/clients/types";

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

function projectLabel(project: ClientLinkedProject) {
  return project.title_en.trim() || "Untitled project";
}

export function DeleteClientButton({
  id,
  name,
  projectCount,
  onDeleted,
}: {
  id: string;
  name: string;
  projectCount: number;
  onDeleted?: (message: string) => void;
}) {
  const clientName = name.trim() || "this client";
  const titleId = useId();
  const messageId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [linkedProjects, setLinkedProjects] = useState<ClientLinkedProject[]>(
    [],
  );
  const [loadingLinks, setLoadingLinks] = useState(false);
  const [blockedByServer, setBlockedByServer] = useState(false);
  const wasOpenRef = useRef(false);

  const linkedCount =
    linkedProjects.length > 0
      ? linkedProjects.length
      : Math.max(0, projectCount);
  const isBlocked = blockedByServer || linkedCount > 0;

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

  useEffect(() => {
    if (!open || projectCount <= 0) {
      return;
    }

    let cancelled = false;
    setLoadingLinks(true);

    void getClientLinkedProjectsAction(id).then((projects) => {
      if (cancelled) {
        return;
      }
      setLinkedProjects(projects);
      setLoadingLinks(false);
    });

    return () => {
      cancelled = true;
    };
  }, [open, id, projectCount]);

  function closeModal() {
    if (pending) {
      return;
    }

    setOpen(false);
    setError(null);
    setLinkedProjects([]);
    setLoadingLinks(false);
    setBlockedByServer(false);
  }

  function openModal() {
    setError(null);
    setLinkedProjects([]);
    setBlockedByServer(false);
    setLoadingLinks(projectCount > 0);
    setOpen(true);
  }

  function confirmDelete() {
    if (pending || isBlocked) {
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await deleteClientAction(id);
      if (result.error) {
        setError(result.error);
        if (/linked/i.test(result.error)) {
          setBlockedByServer(true);
          const projects = await getClientLinkedProjectsAction(id);
          setLinkedProjects(projects);
        }
        return;
      }

      const message = result.success ?? "Client deleted.";
      setOpen(false);
      setError(null);
      setLinkedProjects([]);
      setBlockedByServer(false);
      onDeleted?.(message);
    });
  }

  return (
    <>
      <button
        ref={triggerRef}
        className="oms-admin-table-action oms-admin-table-action-danger"
        type="button"
        role="menuitem"
        onClick={openModal}
      >
        Delete
      </button>

      <dialog
        ref={dialogRef}
        className="oms-admin-confirm"
        aria-labelledby={titleId}
        aria-describedby={messageId}
        aria-modal="true"
        onClose={() => {
          setOpen(false);
          setError(null);
          setLinkedProjects([]);
          setLoadingLinks(false);
          setBlockedByServer(false);
        }}
        onCancel={(event) => {
          if (pending) {
            event.preventDefault();
            return;
          }

          setOpen(false);
          setError(null);
          setLinkedProjects([]);
          setLoadingLinks(false);
          setBlockedByServer(false);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeModal();
          }
        }}
      >
        <div className="oms-admin-confirm-card">
          <div className="oms-admin-confirm-icon" aria-hidden="true">
            <DeleteIcon />
          </div>
          <h2 id={titleId} className="oms-admin-confirm-title">
            {isBlocked ? "Client Cannot Be Deleted" : "Delete Client?"}
          </h2>
          <div id={messageId} className="oms-admin-confirm-copy">
            {isBlocked ? (
              <>
                <p>
                  <strong className="oms-admin-confirm-name">
                    “{clientName}”
                  </strong>{" "}
                  {linkedCount > 0
                    ? `is linked to ${linkedCount} project${linkedCount === 1 ? "" : "s"} and cannot be deleted.`
                    : "is linked to one or more projects and cannot be deleted."}
                </p>
                {loadingLinks ? (
                  <p className="oms-admin-empty">Loading linked projects…</p>
                ) : linkedProjects.length > 0 ? (
                  <ul className="oms-admin-clients-delete-links">
                    {linkedProjects.slice(0, 8).map((project) => (
                      <li key={project.id}>{projectLabel(project)}</li>
                    ))}
                    {linkedProjects.length > 8 ? (
                      <li>+{linkedProjects.length - 8} more</li>
                    ) : null}
                  </ul>
                ) : null}
              </>
            ) : (
              <>
                <p>
                  You&apos;re about to permanently delete{" "}
                  <strong className="oms-admin-confirm-name">
                    “{clientName}”
                  </strong>
                  . This action cannot be undone.
                </p>
                <p>
                  Linked Projects: <strong>0</strong>
                </p>
              </>
            )}
          </div>

          {error ? (
            <p className="oms-admin-error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="oms-admin-confirm-actions">
            {isBlocked ? (
              <button
                ref={cancelRef}
                className="oms-admin-confirm-cancel"
                type="button"
                onClick={closeModal}
              >
                Close
              </button>
            ) : (
              <>
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
                  type="button"
                  onClick={confirmDelete}
                  disabled={pending}
                >
                  {pending ? "Deleting…" : "DELETE CLIENT"}
                </button>
              </>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
