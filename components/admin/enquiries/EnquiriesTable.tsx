"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EnquiryStatusBadge } from "@/components/admin/enquiries/EnquiryStatusBadge";
import { useEnquiriesModals } from "@/components/admin/enquiries/EnquiriesModals";
import {
  enquiryServiceLabel,
  type AdminEnquiry,
} from "@/lib/admin/enquiries/types";

const PAGE_SIZE = 10;

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

export function EnquiriesTable({ enquiries }: { enquiries: AdminEnquiry[] }) {
  const { openEnquiry } = useEnquiriesModals();
  const [rows, setRows] = useState(enquiries);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setRows(enquiries);
    setPage(1);
  }, [enquiries]);

  const total = rows.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, total);
  const visibleRows = rows.slice(startIndex, endIndex);
  const showingFrom = total === 0 ? 0 : startIndex + 1;
  const showingTo = endIndex;

  return (
    <div className="oms-admin-enquiries-table-block">
      <div className="oms-admin-table-wrap oms-admin-enquiries-table-wrap">
        <table className="oms-admin-table oms-admin-enquiries-table">
          <thead>
            <tr>
              <th scope="col">Customer</th>
              <th scope="col">Contact</th>
              <th scope="col">Service</th>
              <th scope="col">Status</th>
              <th scope="col">Received</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((enquiry) => {
              const company = enquiry.company_name?.trim() || null;
              const phone = enquiry.phone?.trim() || null;
              const isNew = enquiry.status === "new";

              return (
                <tr
                  key={enquiry.id}
                  className={
                    isNew ? "oms-admin-enquiries-row-new" : undefined
                  }
                >
                  <td>
                    <div className="oms-admin-enquiries-customer">
                      <p className="oms-admin-enquiries-customer-name">
                        {enquiry.full_name}
                      </p>
                      {company ? (
                        <p className="oms-admin-enquiries-meta">{company}</p>
                      ) : null}
                    </div>
                  </td>
                  <td>
                    <div className="oms-admin-enquiries-contact">
                      {enquiry.email.trim() ? (
                        <a
                          className="oms-admin-enquiries-email"
                          href={`mailto:${enquiry.email}`}
                        >
                          {enquiry.email}
                        </a>
                      ) : null}
                      {phone ? (
                        <a
                          className="oms-admin-enquiries-phone"
                          href={`tel:${phone}`}
                        >
                          {phone}
                        </a>
                      ) : null}
                      {!enquiry.email.trim() && !phone ? (
                        <span className="oms-admin-enquiries-contact-empty">
                          {"\u2014"}
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td>
                    <span className="oms-admin-enquiries-service">
                      {enquiryServiceLabel(enquiry.inquiry_type)}
                    </span>
                  </td>
                  <td>
                    <EnquiryStatusBadge status={enquiry.status} />
                  </td>
                  <td>
                    <span className="oms-admin-enquiries-received">
                      {formatDateTime(enquiry.created_at)}
                    </span>
                  </td>
                  <td>
                    <div className="oms-admin-table-actions">
                      <button
                        type="button"
                        className="oms-admin-table-action oms-admin-enquiries-open"
                        onClick={() => openEnquiry(enquiry)}
                      >
                        Open
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="oms-admin-enquiries-pagination">
        <p className="oms-admin-enquiries-pagination-summary">
          Showing {showingFrom}–{showingTo} of {total}{" "}
          {total === 1 ? "enquiry" : "enquiries"}
        </p>
        <div className="oms-admin-enquiries-pagination-controls">
          <button
            type="button"
            className="oms-admin-enquiries-page-btn"
            disabled={currentPage <= 1}
            aria-label="Previous page"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            <ChevronLeft size={16} strokeWidth={2} aria-hidden="true" />
          </button>
          <span className="oms-admin-enquiries-page-status">
            Page {currentPage} of {pageCount}
          </span>
          <button
            type="button"
            className="oms-admin-enquiries-page-btn"
            disabled={currentPage >= pageCount}
            aria-label="Next page"
            onClick={() =>
              setPage((current) => Math.min(pageCount, current + 1))
            }
          >
            <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
