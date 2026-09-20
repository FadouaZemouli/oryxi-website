import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/require-admin";
import {
  getAdminProjectCounts,
  listAdminProjects,
  type ProjectListFilters,
} from "@/lib/admin/projects/queries";
import { ProjectsFilters } from "@/components/admin/projects/ProjectsFilters";
import { ProjectsKpiCards } from "@/components/admin/projects/ProjectsKpiCards";
import { ProjectsShowcaseCta } from "@/components/admin/projects/ProjectsShowcaseCta";
import { ProjectsTable } from "@/components/admin/projects/ProjectsTable";
import {
  AddProjectButton,
  ProjectsAddProjectProvider,
} from "@/components/admin/projects/ProjectsAddProject";

export const metadata: Metadata = {
  title: "Projects",
};

const notices: Record<string, string> = {
  created: "Project created.",
  saved: "Project saved.",
  deleted: "Project deleted.",
  "deleted-media":
    "Project deleted. Some images could not be removed from storage.",
  published: "Project published.",
  unpublished: "Project unpublished.",
  error: "The last project change could not be completed.",
};

function asStatus(value: string | undefined): ProjectListFilters["status"] {
  if (value === "ongoing" || value === "completed") {
    return value;
  }

  return "all";
}

function asPublication(
  value: string | undefined,
): ProjectListFilters["publication"] {
  if (value === "published" || value === "draft") {
    return value;
  }

  return "all";
}

export default async function AdminProjectsPage({
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
  const filters: ProjectListFilters = {
    q: params.q?.trim() || undefined,
    status: asStatus(params.status),
    publication: asPublication(params.publication),
  };
  const [{ projects, error }, counts] = await Promise.all([
    listAdminProjects(filters),
    getAdminProjectCounts(),
  ]);
  const notice = params.notice ? notices[params.notice] : null;
  const hasFilters = Boolean(
    filters.q ||
      (filters.status && filters.status !== "all") ||
      (filters.publication && filters.publication !== "all"),
  );

  return (
    <ProjectsAddProjectProvider>
      <section
        className="oms-admin-projects"
        aria-labelledby="oms-admin-projects-heading"
      >
        <header className="oms-admin-projects-hero">
          <div className="oms-admin-projects-hero-media" aria-hidden="true" />
          <div className="oms-admin-projects-hero-content">
            <nav
              className="oms-admin-projects-breadcrumb"
              aria-label="Breadcrumb"
            >
              <Link href="/admin">Dashboard</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">Projects</span>
            </nav>

            <div className="oms-admin-projects-hero-row">
              <div>
                <h1
                  id="oms-admin-projects-heading"
                  className="oms-admin-heading"
                >
                  Projects
                </h1>
                <p className="oms-admin-welcome">
                  Manage projects displayed across the OMS website.
                </p>
              </div>
              <AddProjectButton className="oms-admin-submit oms-admin-add-link oms-admin-projects-add">
                + Add Project
              </AddProjectButton>
            </div>
          </div>
        </header>

        {notice ? (
          <p
            className={
              params.notice === "error" || params.notice === "deleted-media"
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
            <p>Projects could not be loaded. Please try again.</p>
            {process.env.NODE_ENV !== "production" ? (
              <p className="oms-admin-empty">
                {[error.code, error.message, error.hint, error.details]
                  .filter(Boolean)
                  .join(" — ")}
              </p>
            ) : null}
          </div>
        ) : null}

        <ProjectsKpiCards counts={counts} />

        <ProjectsFilters filters={filters} />

        {projects.length === 0 ? (
          <div className="oms-admin-empty-panel oms-admin-projects-empty">
            <h2 className="oms-admin-panel-title">
              {hasFilters ? "No matching projects" : "No projects yet"}
            </h2>
            <p className="oms-admin-empty">
              {hasFilters
                ? "Try a different search or clear the status and website filters."
                : "Add a project to manage what can be displayed on the OMS website."}
            </p>
            {!hasFilters ? (
              <AddProjectButton className="oms-admin-submit oms-admin-add-link">
                + Add Project
              </AddProjectButton>
            ) : null}
          </div>
        ) : (
          <ProjectsTable projects={projects} canReorder={!hasFilters} />
        )}

        <ProjectsShowcaseCta />
      </section>
    </ProjectsAddProjectProvider>
  );
}
