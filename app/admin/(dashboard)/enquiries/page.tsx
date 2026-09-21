import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/require-admin";
import {
  getAdminEnquiryCounts,
  listAdminEnquiries,
  type EnquiryListFilters,
} from "@/lib/admin/enquiries/queries";
import { isEnquiryStatus } from "@/lib/admin/enquiries/types";
import { EnquiriesFilters } from "@/components/admin/enquiries/EnquiriesFilters";
import { EnquiriesKpiCards } from "@/components/admin/enquiries/EnquiriesKpiCards";
import { EnquiriesModalsProvider } from "@/components/admin/enquiries/EnquiriesModals";
import { EnquiriesTable } from "@/components/admin/enquiries/EnquiriesTable";

export const metadata: Metadata = {
  title: "Enquiries",
};

const notices: Record<string, string> = {
  new: "Enquiry marked as new.",
  "in-progress": "Enquiry marked as in progress.",
  closed: "Enquiry closed.",
  error: "The last enquiry change could not be completed.",
};

function asStatus(value: string | undefined): EnquiryListFilters["status"] {
  if (value && isEnquiryStatus(value)) {
    return value;
  }

  return "all";
}

export default async function AdminEnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    notice?: string;
  }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const filters: EnquiryListFilters = {
    q: params.q?.trim() || undefined,
    status: asStatus(params.status),
  };
  const [{ enquiries, error }, counts] = await Promise.all([
    listAdminEnquiries(filters),
    getAdminEnquiryCounts(),
  ]);
  const notice = params.notice ? notices[params.notice] : null;
  const hasFilters = Boolean(
    filters.q || (filters.status && filters.status !== "all"),
  );

  return (
    <EnquiriesModalsProvider enquiries={enquiries}>
      <section
        className="oms-admin-enquiries"
        aria-labelledby="oms-admin-enquiries-heading"
      >
        <header className="oms-admin-enquiries-hero">
          <div className="oms-admin-enquiries-hero-media" aria-hidden="true" />
          <div className="oms-admin-enquiries-hero-content">
            <nav
              className="oms-admin-enquiries-breadcrumb"
              aria-label="Breadcrumb"
            >
              <Link href="/admin">Dashboard</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">Enquiries</span>
            </nav>

            <div className="oms-admin-enquiries-hero-row">
              <div>
                <h1
                  id="oms-admin-enquiries-heading"
                  className="oms-admin-heading"
                >
                  Enquiries
                </h1>
                <p className="oms-admin-welcome">
                  Manage website enquiries and customer requests.
                </p>
              </div>
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
            <p>Enquiries could not be loaded. Please try again.</p>
            {process.env.NODE_ENV !== "production" ? (
              <p className="oms-admin-empty">
                {[error.code, error.message, error.hint, error.details]
                  .filter(Boolean)
                  .join(" - ")}
              </p>
            ) : null}
          </div>
        ) : null}

        <EnquiriesKpiCards counts={counts} />

        <EnquiriesFilters filters={filters} />

        {enquiries.length === 0 ? (
          <div className="oms-admin-empty-panel oms-admin-enquiries-empty">
            <h2 className="oms-admin-panel-title">
              {hasFilters
                ? "No enquiries match your filters"
                : "No enquiries yet"}
            </h2>
            <p className="oms-admin-empty">
              {hasFilters
                ? "Try a different search or clear the status filter."
                : "New contact form submissions will appear here."}
            </p>
          </div>
        ) : (
          <EnquiriesTable enquiries={enquiries} />
        )}
      </section>
    </EnquiriesModalsProvider>
  );
}
