"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Mail, Phone } from "lucide-react";
import { EnquiryStatusBadge } from "@/components/admin/enquiries/EnquiryStatusBadge";
import { updateEnquiryStatusAction } from "@/lib/admin/enquiries/actions";
import {
  enquiryServiceLabel,
  type AdminEnquiry,
  type EnquiryStatus,
} from "@/lib/admin/enquiries/types";

type EnquiryDetailModalProps = {
  enquiry: AdminEnquiry | null;
  open: boolean;
  onClose: () => void;
};

function formatDateTime(value: string | null) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Qatar",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function noticeForStatus(status: EnquiryStatus) {
  if (status === "closed") {
    return "closed";
  }
  if (status === "in_progress") {
    return "in-progress";
  }
  return "new";
}

export function EnquiryDetailModal({
  enquiry,
  open,
  onClose,
}: EnquiryDetailModalProps) {
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
  const [pending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    busyRef.current = pending;
  }, [pending]);

  useEffect(() => {
    confirmOpenRef.current = confirmOpen;
  }, [confirmOpen]);

  useEffect(() => {
    if (!open || !enquiry) {
      setConfirmOpen(false);
      setActionError(null);
      return;
    }

    setConfirmOpen(false);
    setActionError(null);

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
  }, [open, enquiry?.id]);

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

  if (!open || !enquiry) {
    return null;
  }

  const current = enquiry;
  const serviceLabel = enquiryServiceLabel(current.inquiry_type);
  const phone = current.phone?.trim() || null;
  const company = current.company_name?.trim() || null;

  function requestClose() {
    if (busyRef.current || pending || confirmOpen) {
      return;
    }
    onClose();
  }

  function closeConfirm() {
    if (pending) {
      return;
    }
    setConfirmOpen(false);
  }

  function applyStatus(nextStatus: EnquiryStatus) {
    if (pending) {
      return;
    }

    startTransition(async () => {
      setActionError(null);
      const result = await updateEnquiryStatusAction(current.id, nextStatus);
      if (result.error) {
        setActionError(result.error);
        return;
      }

      setConfirmOpen(false);
      onClose();
      router.replace(`/admin/enquiries?notice=${noticeForStatus(nextStatus)}`);
      router.refresh();
    });
  }

  function handleStatusClick(nextStatus: EnquiryStatus) {
    if (pending || nextStatus === current.status) {
      return;
    }

    if (nextStatus === "closed") {
      setActionError(null);
      setConfirmOpen(true);
      return;
    }

    applyStatus(nextStatus);
  }

  return (
    <>
      <div
        className="oms-admin-enquiry-overlay"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            requestClose();
          }
        }}
      >
        <div
          className="oms-admin-enquiry-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={subtitleId}
        >
          <header className="oms-admin-enquiry-modal-header">
            <div
              className="oms-admin-enquiry-modal-header-bg"
              aria-hidden="true"
            />
            <div className="oms-admin-enquiry-modal-header-content">
              <div className="oms-admin-enquiry-modal-heading">
                <h2 id={titleId} className="oms-admin-enquiry-modal-title">
                  Enquiry Details
                </h2>
                <p
                  id={subtitleId}
                  className="oms-admin-enquiry-modal-subtitle"
                >
                  Received {formatDateTime(current.created_at)}
                </p>
              </div>
              <div className="oms-admin-enquiry-modal-header-meta">
                <EnquiryStatusBadge status={current.status} />
                <button
                  ref={closeRef}
                  type="button"
                  className="oms-admin-enquiry-modal-close"
                  aria-label="Close enquiry details"
                  onClick={requestClose}
                  disabled={pending}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            </div>
          </header>

          <div ref={bodyRef} className="oms-admin-enquiry-modal-body">
            <section className="oms-admin-enquiry-section">
              <h3 className="oms-admin-enquiry-section-title">Customer</h3>
              <dl className="oms-admin-enquiry-dl">
                <div>
                  <dt>Full Name</dt>
                  <dd>{current.full_name}</dd>
                </div>
                {company ? (
                  <div>
                    <dt>Company</dt>
                    <dd>{company}</dd>
                  </div>
                ) : null}
              </dl>
            </section>

            <section className="oms-admin-enquiry-section">
              <h3 className="oms-admin-enquiry-section-title">Contact</h3>
              <dl className="oms-admin-enquiry-dl">
                <div>
                  <dt>Email</dt>
                  <dd>
                    <a href={`mailto:${current.email}`}>{current.email}</a>
                  </dd>
                </div>
                {phone ? (
                  <div>
                    <dt>Phone</dt>
                    <dd>
                      <a href={`tel:${phone}`}>{phone}</a>
                    </dd>
                  </div>
                ) : null}
              </dl>
              <div className="oms-admin-enquiry-contact-actions">
                <a
                  className="oms-admin-enquiry-contact-link"
                  href={`mailto:${current.email}`}
                >
                  <Mail size={16} strokeWidth={1.85} aria-hidden="true" />
                  Email Customer
                </a>
                {phone ? (
                  <a
                    className="oms-admin-enquiry-contact-link"
                    href={`tel:${phone}`}
                  >
                    <Phone size={16} strokeWidth={1.85} aria-hidden="true" />
                    Call Customer
                  </a>
                ) : null}
              </div>
            </section>

            <section className="oms-admin-enquiry-section">
              <h3 className="oms-admin-enquiry-section-title">Enquiry</h3>
              <dl className="oms-admin-enquiry-dl">
                <div>
                  <dt>Service</dt>
                  <dd>{serviceLabel}</dd>
                </div>
              </dl>
              <p className="oms-admin-enquiry-message-label">Message</p>
              <div className="oms-admin-enquiry-message">{current.message}</div>
            </section>

            <section className="oms-admin-enquiry-section">
              <h3 className="oms-admin-enquiry-section-title">Status</h3>
              <p className="oms-admin-enquiry-status-current">
                Current status:{" "}
                <EnquiryStatusBadge status={current.status} />
              </p>
              {actionError ? (
                <p className="oms-admin-error" role="alert">
                  {actionError}
                </p>
              ) : null}
            </section>
          </div>

          <footer className="oms-admin-enquiry-modal-footer">
            {current.status === "new" ? (
              <>
                <button
                  type="button"
                  className="oms-admin-enquiry-status-btn oms-admin-enquiry-status-btn-primary"
                  disabled={pending}
                  onClick={() => handleStatusClick("in_progress")}
                >
                  Mark In Progress
                </button>
                <button
                  type="button"
                  className="oms-admin-enquiry-status-btn"
                  disabled={pending}
                  onClick={() => handleStatusClick("closed")}
                >
                  Close Enquiry
                </button>
              </>
            ) : null}

            {current.status === "in_progress" ? (
              <>
                <button
                  type="button"
                  className="oms-admin-enquiry-status-btn"
                  disabled={pending}
                  onClick={() => handleStatusClick("new")}
                >
                  Mark New
                </button>
                <button
                  type="button"
                  className="oms-admin-enquiry-status-btn oms-admin-enquiry-status-btn-primary"
                  disabled={pending}
                  onClick={() => handleStatusClick("closed")}
                >
                  Close Enquiry
                </button>
              </>
            ) : null}

            {current.status === "closed" ? (
              <>
                <button
                  type="button"
                  className="oms-admin-enquiry-status-btn oms-admin-enquiry-status-btn-primary"
                  disabled={pending}
                  onClick={() => handleStatusClick("in_progress")}
                >
                  Reopen as In Progress
                </button>
                <button
                  type="button"
                  className="oms-admin-enquiry-status-btn"
                  disabled={pending}
                  onClick={() => handleStatusClick("new")}
                >
                  Mark New
                </button>
              </>
            ) : null}

            <button
              type="button"
              className="oms-admin-enquiry-status-btn oms-admin-enquiry-modal-cancel"
              disabled={pending}
              onClick={requestClose}
            >
              Close
            </button>
          </footer>
        </div>
      </div>

      <dialog
        ref={confirmDialogRef}
        className="oms-admin-enquiry-confirm"
        aria-labelledby={confirmTitleId}
        aria-describedby={confirmMessageId}
        onCancel={(event) => {
          event.preventDefault();
          closeConfirm();
        }}
      >
        <form
          method="dialog"
          className="oms-admin-enquiry-confirm-form"
          onSubmit={(event) => event.preventDefault()}
        >
          <h3 id={confirmTitleId}>Close Enquiry?</h3>
          <p id={confirmMessageId}>
            This enquiry will remain in your records and can be reopened later.
          </p>
          {actionError ? (
            <p className="oms-admin-error" role="alert">
              {actionError}
            </p>
          ) : null}
          <div className="oms-admin-enquiry-confirm-actions">
            <button
              ref={confirmCancelRef}
              type="button"
              className="oms-admin-enquiry-status-btn"
              disabled={pending}
              onClick={closeConfirm}
            >
              Cancel
            </button>
            <button
              type="button"
              className="oms-admin-enquiry-status-btn oms-admin-enquiry-status-btn-danger"
              disabled={pending}
              onClick={() => applyStatus("closed")}
            >
              Close Enquiry
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
