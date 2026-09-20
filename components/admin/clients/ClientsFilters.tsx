import Link from "next/link";
import type { ClientListFilters } from "@/lib/admin/clients/queries";

export function ClientsFilters({ filters }: { filters: ClientListFilters }) {
  const hasActiveFilters = Boolean(
    filters.q ||
      (filters.status && filters.status !== "all") ||
      (filters.publication && filters.publication !== "all"),
  );

  return (
    <form className="oms-admin-clients-filters" method="get">
      <label className="oms-admin-sr-only" htmlFor="oms-admin-clients-search">
        Search clients
      </label>
      <input
        id="oms-admin-clients-search"
        className="oms-admin-input oms-admin-clients-filter-search"
        name="q"
        type="search"
        placeholder="Search by name, contact, email, phone..."
        defaultValue={filters.q ?? ""}
      />

      <div className="oms-admin-clients-filter-controls">
        <label className="oms-admin-sr-only" htmlFor="oms-admin-clients-status">
          Status
        </label>
        <select
          id="oms-admin-clients-status"
          className="oms-admin-input oms-admin-clients-filter-select"
          name="status"
          defaultValue={filters.status ?? "all"}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <label
          className="oms-admin-sr-only"
          htmlFor="oms-admin-clients-publication"
        >
          Website
        </label>
        <select
          id="oms-admin-clients-publication"
          className="oms-admin-input oms-admin-clients-filter-select"
          name="publication"
          defaultValue={filters.publication ?? "all"}
        >
          <option value="all">All Website Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>

        <button className="oms-admin-clients-filter-submit" type="submit">
          Filter
        </button>

        <Link
          className={
            hasActiveFilters
              ? "oms-admin-clients-filter-reset"
              : "oms-admin-clients-filter-reset oms-admin-clients-filter-reset-idle"
          }
          href="/admin/clients"
          aria-disabled={!hasActiveFilters}
        >
          Reset
        </Link>
      </div>
    </form>
  );
}
