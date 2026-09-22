import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Building2,
  CircleCheck,
  Clock,
  FolderPlus,
  Inbox,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import {
  ProjectPublishBadge,
  ProjectStatusBadge,
} from "@/components/admin/projects/ProjectBadges";
import { ProjectMediaThumb } from "@/components/admin/projects/ProjectMediaThumb";
import { EnquiryStatusBadge } from "@/components/admin/enquiries/EnquiryStatusBadge";
import { parseGallery } from "@/lib/admin/projects/helpers";
import type { AdminIdentity } from "@/lib/admin/admin-identity";
import type {
  DashboardCounts,
  DashboardEnquiry,
} from "@/lib/admin/dashboard-data";
import type { AdminProject } from "@/lib/admin/projects/types";
import { asEnquiryStatus } from "@/lib/admin/enquiries/types";
import { DashboardTopBar } from "@/components/admin/dashboard/DashboardTopBar";
import { ProjectOverviewChart } from "@/components/admin/dashboard/ProjectOverviewChart";

type DashboardOverviewProps = {
  identity: AdminIdentity;
  counts: DashboardCounts;
  recentProjects: AdminProject[];
  recentEnquiries: DashboardEnquiry[];
};

const PUBLIC_HERO_PHOTO = "/images/hero/oms-hero-engineering-team.png.png";

const kpiCards = [
  {
    key: "ongoingProjects" as const,
    label: "Ongoing Projects",
    hint: "Active OMS work",
    href: "/admin/projects?status=ongoing",
    icon: Clock,
    tone: "blue",
  },
  {
    key: "completedProjects" as const,
    label: "Completed Projects",
    hint: "Delivered projects",
    href: "/admin/projects?status=completed",
    icon: CircleCheck,
    tone: "green",
  },
  {
    key: "clients" as const,
    label: "Clients",
    hint: "All client records",
    href: "/admin/clients",
    icon: Users,
    tone: "navy",
  },
  {
    key: "newEnquiries" as const,
    label: "New Enquiries",
    hint: "Awaiting review",
    href: "/admin/enquiries?status=new",
    icon: Sparkles,
    tone: "burgundy",
  },
];

const quickActions = [
  {
    href: "/admin/projects/new",
    label: "Add Project",
    description: "Create a new OMS project.",
    icon: FolderPlus,
  },
  {
    href: "/admin/clients",
    label: "Clients",
    description: "View and manage clients.",
    icon: Building2,
  },
  {
    href: "/admin/enquiries",
    label: "Contact Enquiries",
    description: "Review website enquiries.",
    icon: Inbox,
  },
  {
    href: "/admin/settings",
    label: "Settings",
    description: "Manage admin settings.",
    icon: Settings,
  },
];

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function DashboardOverview({
  identity,
  counts,
  recentProjects,
  recentEnquiries,
}: DashboardOverviewProps) {
  return (
    <div className="oms-dash">
      <DashboardTopBar
        identity={identity}
        newEnquiryCount={counts.newEnquiries}
      />

      <section className="oms-dash-hero" aria-labelledby="oms-dash-welcome">
        <Image
          src={PUBLIC_HERO_PHOTO}
          alt="OMS engineers on a plant floor"
          fill
          sizes="(max-width: 899px) 100vw, 72vw"
          className="oms-dash-hero-image"
          priority
        />
        <div className="oms-dash-hero-copy">
          <p className="oms-dash-hero-kicker">ORYXI Maintenance Services</p>
          <h1 id="oms-dash-welcome">
            Welcome back,{" "}
            <span className="oms-dash-hero-name">{identity.firstName}</span>.
          </h1>
          <p>Manage your projects, clients, and enquiries all in one place.</p>
        </div>
        <ul className="oms-dash-hero-values">
          <li>Safety</li>
          <li>Reliability</li>
          <li>Expertise</li>
        </ul>
      </section>

      <ul className="oms-dash-kpis">
        {kpiCards.map((card) => {
          const Icon = card.icon;

          return (
            <li key={card.key}>
              <Link
                href={card.href}
                className={`oms-dash-kpi oms-dash-kpi-${card.tone}`}
              >
                <span className="oms-dash-kpi-icon" aria-hidden="true">
                  <Icon size={22} strokeWidth={1.75} />
                </span>
                <span className="oms-dash-kpi-copy">
                  <span className="oms-dash-kpi-label">{card.label}</span>
                  <span className="oms-dash-kpi-value">{counts[card.key]}</span>
                  <span className="oms-dash-kpi-hint">{card.hint}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="oms-dash-split">
        <section
          className="oms-dash-panel"
          aria-labelledby="oms-dash-recent-projects-heading"
        >
          <header className="oms-dash-panel-head">
            <div>
              <h2 id="oms-dash-recent-projects-heading">Recent Projects</h2>
              <p>Your latest projects and their status.</p>
            </div>
            <Link className="oms-dash-add" href="/admin/projects/new">
              + Add Project
            </Link>
          </header>

          {recentProjects.length === 0 ? (
            <p className="oms-admin-empty">
              No projects yet. Add a project to see it listed here.
            </p>
          ) : (
            <div className="oms-admin-table-wrap oms-dash-table-wrap">
              <table className="oms-admin-table oms-dash-table">
                <thead>
                  <tr>
                    <th scope="col">Project</th>
                    <th scope="col">Location</th>
                    <th scope="col">Status</th>
                    <th scope="col">Website</th>
                    <th scope="col">Updated</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProjects.map((project) => {
                    const cover =
                      project.cover_image_url ||
                      parseGallery(project.gallery)[0] ||
                      "";

                    return (
                      <tr key={project.id}>
                        <td>
                          <div className="oms-admin-project-cell">
                            <ProjectMediaThumb
                              className="oms-admin-project-thumb"
                              url={cover || null}
                              width={56}
                              height={56}
                            />
                            <p className="oms-admin-project-name">
                              {project.title_en || "Untitled project"}
                            </p>
                          </div>
                        </td>
                        <td>{project.location_en || "-"}</td>
                        <td>
                          <ProjectStatusBadge status={project.project_status} />
                        </td>
                        <td>
                          <ProjectPublishBadge published={project.published} />
                        </td>
                        <td>
                          {formatDate(project.updated_at || project.created_at)}
                        </td>
                        <td>
                          <div className="oms-admin-table-actions">
                            <Link
                              className="oms-admin-table-action"
                              href={`/admin/projects/${project.id}/edit`}
                            >
                              Edit
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <Link className="oms-dash-view-all" href="/admin/projects">
            View all projects
            <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
          </Link>
        </section>

        <ProjectOverviewChart
          ongoing={counts.ongoingProjects}
          completed={counts.completedProjects}
        />
      </div>

      <div className="oms-dash-lower">
        <section
          className="oms-dash-panel"
          aria-labelledby="oms-dash-enquiries-heading"
        >
          <header className="oms-dash-panel-head">
            <div>
              <h2 id="oms-dash-enquiries-heading">Recent Enquiries</h2>
              <p>Latest messages from the public contact form.</p>
            </div>
            <Link
              className="oms-dash-view-all oms-dash-view-all-inline"
              href="/admin/enquiries"
            >
              View all enquiries
              <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
            </Link>
          </header>

          {recentEnquiries.length === 0 ? (
            <p className="oms-admin-empty">
              No enquiries right now. New contact form submissions will appear
              here.
            </p>
          ) : (
            <div className="oms-admin-table-wrap oms-dash-table-wrap">
              <table className="oms-admin-table oms-dash-table oms-dash-table-enquiries">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Company</th>
                    <th scope="col">Service</th>
                    <th scope="col">Date</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEnquiries.map((enquiry) => {
                    const status = asEnquiryStatus(enquiry.status);

                    return (
                      <tr key={enquiry.id}>
                        <td>
                          <Link
                            className="oms-admin-project-name oms-dash-enquiry-name"
                            href="/admin/enquiries"
                          >
                            {enquiry.fullName}
                          </Link>
                        </td>
                        <td>{enquiry.companyName}</td>
                        <td>{enquiry.serviceLabel}</td>
                        <td>{formatDate(enquiry.createdAt)}</td>
                        <td>
                          <EnquiryStatusBadge status={status} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section
          className="oms-dash-panel oms-dash-quick"
          aria-labelledby="oms-dash-actions-heading"
        >
          <header className="oms-dash-panel-head">
            <div>
              <h2 id="oms-dash-actions-heading">Quick Actions</h2>
              <p>Jump to the most common admin tasks.</p>
            </div>
          </header>
          <ul className="oms-dash-actions">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <li key={action.href}>
                  <Link href={action.href} className="oms-dash-action">
                    <span className="oms-dash-action-icon" aria-hidden="true">
                      <Icon size={20} strokeWidth={1.85} />
                    </span>
                    <span className="oms-dash-action-copy">
                      <span className="oms-dash-action-title">
                        {action.label}
                      </span>
                      <span className="oms-dash-action-desc">
                        {action.description}
                      </span>
                    </span>
                    <ArrowRight
                      className="oms-dash-action-arrow"
                      size={16}
                      strokeWidth={1.85}
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <footer className="oms-dash-footer">
        <p>© 2026 Oryxi Maintenance Services</p>
        <p className="oms-dash-footer-mark">Built for a safer tomorrow.</p>
      </footer>
    </div>
  );
}
