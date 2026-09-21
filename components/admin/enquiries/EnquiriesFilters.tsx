import Link from "next/link";
import type { EnquiryListFilters } from "@/lib/admin/enquiries/queries";

export function EnquiriesFilters({ filters }: { filters: EnquiryListFilters }) {
  const hasActiveFilters = Boolean(
    filters.q || (filters.status && filters.status !== "all"),
  );

  return (
    <form className="oms-admin-enquiries-filters" method="get">
      <label className="oms-admin-sr-only" htmlFor="oms-admin-enquiries-search">
        Search enquiries
      </label>
      <input
        id="oms-admin-enquiries-search"
        className="oms-admin-input oms-admin-enquiries-filter-search"
        name="q"
        type="search"
        placeholder="Search by name, company, email, phone, service..."
        defaultValue={filters.q ?? ""}
      />

      <div className="oms-admin-enquiries-filter-controls">
        <label
          className="oms-admin-sr-only"
          htmlFor="oms-admin-enquiries-status"
        >
          Status
        </label>
        <select
          id="oms-admin-enquiries-status"
          className="oms-admin-input oms-admin-enquiries-filter-select"
          name="status"
          defaultValue={filters.status ?? "all"}
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="in_progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>

        <button className="oms-admin-enquiries-filter-submit" type="submit">
          Filter
        </button>

        <Link
          className={
            hasActiveFilters
              ? "oms-admin-enquiries-filter-reset"
              : "oms-admin-enquiries-filter-reset oms-admin-enquiries-filter-reset-idle"
          }
          href="/admin/enquiries"
          aria-disabled={!hasActiveFilters}
        >
          Reset
        </Link>
      </div>
    </form>
  );
}
