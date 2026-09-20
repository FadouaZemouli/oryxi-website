import Link from "next/link";
import type { ProjectListFilters } from "@/lib/admin/projects/queries";

export function ProjectsFilters({
  filters,
}: {
  filters: ProjectListFilters;
}) {
  const hasActiveFilters = Boolean(
    filters.q ||
      (filters.status && filters.status !== "all") ||
      (filters.publication && filters.publication !== "all"),
  );

  return (
    <form className="oms-admin-projects-filters" method="get">
      <label className="oms-admin-sr-only" htmlFor="oms-admin-projects-search">
        Search projects
      </label>
      <input
        id="oms-admin-projects-search"
        className="oms-admin-input oms-admin-projects-filter-search"
        name="q"
        type="search"
        placeholder="Search projects by name, location..."
        defaultValue={filters.q ?? ""}
      />

      <div className="oms-admin-projects-filter-controls">
        <label className="oms-admin-sr-only" htmlFor="oms-admin-projects-status">
          Status
        </label>
        <select
          id="oms-admin-projects-status"
          className="oms-admin-input oms-admin-projects-filter-select"
          name="status"
          defaultValue={filters.status ?? "all"}
        >
          <option value="all">All Status</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>

        <label
          className="oms-admin-sr-only"
          htmlFor="oms-admin-projects-publication"
        >
          Website
        </label>
        <select
          id="oms-admin-projects-publication"
          className="oms-admin-input oms-admin-projects-filter-select"
          name="publication"
          defaultValue={filters.publication ?? "all"}
        >
          <option value="all">All Website Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>

        <button className="oms-admin-projects-filter-submit" type="submit">
          Filter
        </button>

        <Link
          className={
            hasActiveFilters
              ? "oms-admin-projects-filter-reset"
              : "oms-admin-projects-filter-reset oms-admin-projects-filter-reset-idle"
          }
          href="/admin/projects"
          aria-disabled={!hasActiveFilters}
        >
          Reset
        </Link>
      </div>
    </form>
  );
}
