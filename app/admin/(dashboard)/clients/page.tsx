import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/require-admin";
import {
  getAdminClientCounts,
  getNextClientSortOrder,
  listAdminClients,
  type ClientListFilters,
} from "@/lib/admin/clients/queries";
import { AddClientButton } from "@/components/admin/clients/AddClientButton";
import { ClientsFilters } from "@/components/admin/clients/ClientsFilters";
import { ClientsKpiCards } from "@/components/admin/clients/ClientsKpiCards";
import { ClientsModalsProvider } from "@/components/admin/clients/ClientsModals";
import { ClientsTable } from "@/components/admin/clients/ClientsTable";

export const metadata: Metadata = {
  title: "Clients",
};

const notices: Record<string, string> = {
  created: "Client created.",
  updated: "Client updated.",
  deleted: "Client deleted.",
  error: "The last client change could not be completed.",
};

function asStatus(value: string | undefined): ClientListFilters["status"] {
  if (value === "active" || value === "inactive") {
    return value;
  }

  return "all";
}

function asPublication(
  value: string | undefined,
): ClientListFilters["publication"] {
  if (value === "published" || value === "draft") {
    return value;
  }

  return "all";
}

export default async function AdminClientsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    publication?: string;
    notice?: string;
  }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const filters: ClientListFilters = {
    q: params.q?.trim() || undefined,
    status: asStatus(params.status),
    publication: asPublication(params.publication),
  };
  const [{ clients, error }, counts, nextSortOrder] = await Promise.all([
    listAdminClients(filters),
    getAdminClientCounts(),
    getNextClientSortOrder(),
  ]);
  const notice = params.notice ? notices[params.notice] : null;
  const hasFilters = Boolean(
    filters.q ||
      (filters.status && filters.status !== "all") ||
      (filters.publication && filters.publication !== "all"),
  );

  return (
    <ClientsModalsProvider nextSortOrder={nextSortOrder}>
      <section
        className="oms-admin-clients"
        aria-labelledby="oms-admin-clients-heading"
      >
        <header className="oms-admin-clients-hero">
          <div className="oms-admin-clients-hero-media" aria-hidden="true" />
          <div className="oms-admin-clients-hero-content">
            <nav
              className="oms-admin-clients-breadcrumb"
              aria-label="Breadcrumb"
            >
              <Link href="/admin">Dashboard</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">Clients</span>
            </nav>

            <div className="oms-admin-clients-hero-row">
              <div>
                <h1
                  id="oms-admin-clients-heading"
                  className="oms-admin-heading"
                >
                  Clients
                </h1>
                <p className="oms-admin-welcome">
                  Manage OMS clients, contacts and project relationships.
                </p>
              </div>
              <AddClientButton className="oms-admin-submit oms-admin-add-link oms-admin-clients-add" />
            </div>
          </div>
        </header>

        {notice ? (
          <p
            className={
              params.notice === "error"
                ? "oms-admin-error"
                : "oms-admin-success"
            }
            role="status"
          >
            {notice}
          </p>
        ) : null}

        {error ? (
          <div className="oms-admin-error" role="alert">
            <p>Clients could not be loaded. Please try again.</p>
            {process.env.NODE_ENV !== "production" ? (
              <p className="oms-admin-empty">
                {[error.code, error.message, error.hint, error.details]
                  .filter(Boolean)
                  .join(" — ")}
              </p>
            ) : null}
          </div>
        ) : null}

        <ClientsKpiCards counts={counts} />

        <ClientsFilters filters={filters} />

        {clients.length === 0 ? (
          <div className="oms-admin-empty-panel oms-admin-clients-empty">
            <h2 className="oms-admin-panel-title">
              {hasFilters ? "No matching clients" : "No clients yet"}
            </h2>
            <p className="oms-admin-empty">
              {hasFilters
                ? "Try a different search or clear the status and website filters."
                : "Add a client to manage contacts and project relationships."}
            </p>
            {!hasFilters ? (
              <AddClientButton className="oms-admin-submit oms-admin-add-link" />
            ) : null}
          </div>
        ) : (
          <ClientsTable clients={clients} />
        )}
      </section>
    </ClientsModalsProvider>
  );
}
