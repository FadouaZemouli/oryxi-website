"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { AdminClient } from "@/lib/admin/clients/types";
import {
  ClientPublishBadge,
  ClientStatusBadge,
} from "@/components/admin/clients/ClientBadges";
import { ClientActionsMenu } from "@/components/admin/clients/ClientActionsMenu";
import { ClientLogoThumb } from "@/components/admin/clients/ClientLogoThumb";
import { useClientsModals } from "@/components/admin/clients/ClientsModals";

const PAGE_SIZE = 10;

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatWebsite(url: string | null) {
  if (!url) {
    return null;
  }

  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").replace(/^www\./, "");
  }
}

export function ClientsTable({ clients }: { clients: AdminClient[] }) {
  const router = useRouter();
  const { openEdit } = useClientsModals();
  const [rows, setRows] = useState(clients);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setRows(clients);
    setPage(1);
  }, [clients]);

  const total = rows.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, total);
  const visibleRows = rows.slice(startIndex, endIndex);
  const showingFrom = total === 0 ? 0 : startIndex + 1;
  const showingTo = endIndex;

  function handleDeleted(clientId: string) {
    setRows((current) => current.filter((row) => row.id !== clientId));
    router.replace("/admin/clients?notice=deleted");
    router.refresh();
  }

  return (
    <div className="oms-admin-clients-table-block">
      <div className="oms-admin-table-wrap oms-admin-clients-table-wrap">
        <table className="oms-admin-table oms-admin-clients-table">
          <thead>
            <tr>
              <th scope="col">Client</th>
              <th scope="col">Contact</th>
              <th scope="col">Phone</th>
              <th scope="col">Projects</th>
              <th scope="col">Status</th>
              <th scope="col">Website</th>
              <th scope="col">Last Updated</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((client) => {
              const name = client.name.trim() || "Untitled";
              const websiteLabel = formatWebsite(client.website_url);
              const contact = client.contact_person?.trim() || "—";
              const email = client.email?.trim() || null;
              const phone = client.phone?.trim() || "—";

              return (
                <tr key={client.id}>
                  <td>
                    <div className="oms-admin-client-cell">
                      <ClientLogoThumb
                        className="oms-admin-client-logo"
                        url={client.logo_url}
                        name={name}
                      />
                      <div>
                        <p className="oms-admin-client-name">{name}</p>
                        {websiteLabel ? (
                          client.website_url ? (
                            <a
                              className="oms-admin-client-meta oms-admin-client-website"
                              href={client.website_url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {websiteLabel}
                            </a>
                          ) : (
                            <p className="oms-admin-client-meta">
                              {websiteLabel}
                            </p>
                          )
                        ) : (
                          <p className="oms-admin-client-meta">No website</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="oms-admin-client-contact">
                      <p className="oms-admin-client-contact-name">{contact}</p>
                      {email ? (
                        <a
                          className="oms-admin-client-meta oms-admin-client-email"
                          href={`mailto:${email}`}
                        >
                          {email}
                        </a>
                      ) : (
                        <p className="oms-admin-client-meta">No email</p>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="oms-admin-client-phone">{phone}</span>
                  </td>
                  <td>
                    <span className="oms-admin-clients-project-count">
                      {client.project_count}
                    </span>
                  </td>
                  <td>
                    <ClientStatusBadge status={client.status} />
                  </td>
                  <td>
                    <ClientPublishBadge published={client.published} />
                  </td>
                  <td>
                    {formatDate(client.updated_at || client.created_at)}
                  </td>
                  <td>
                    <div className="oms-admin-table-actions oms-admin-clients-actions">
                      <button
                        type="button"
                        className="oms-admin-table-action oms-admin-clients-edit"
                        onClick={() => openEdit(client)}
                      >
                        Edit
                      </button>
                      <ClientActionsMenu
                        id={client.id}
                        name={name}
                        projectCount={client.project_count}
                        onDeleted={() => handleDeleted(client.id)}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="oms-admin-clients-pagination">
        <p className="oms-admin-clients-pagination-summary">
          Showing {showingFrom}–{showingTo} of {total}{" "}
          {total === 1 ? "client" : "clients"}
        </p>
        <div className="oms-admin-clients-pagination-controls">
          <button
            type="button"
            className="oms-admin-clients-page-btn"
            disabled={currentPage <= 1}
            aria-label="Previous page"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            <ChevronLeft size={16} strokeWidth={2} aria-hidden="true" />
          </button>
          <span className="oms-admin-clients-page-status">
            Page {currentPage} of {pageCount}
          </span>
          <button
            type="button"
            className="oms-admin-clients-page-btn"
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
