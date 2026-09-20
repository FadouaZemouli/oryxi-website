import Link from "next/link";
import {
  CircleCheck,
  FolderKanban,
  Globe2,
  LoaderCircle,
} from "lucide-react";

type ProjectCounts = {
  total: number;
  ongoing: number;
  completed: number;
  published: number;
};

const cards = [
  {
    key: "total" as const,
    label: "Total Projects",
    hint: "All projects",
    href: "/admin/projects",
    icon: FolderKanban,
    tone: "navy",
  },
  {
    key: "ongoing" as const,
    label: "Ongoing Projects",
    hint: "In progress",
    href: "/admin/projects?status=ongoing",
    icon: LoaderCircle,
    tone: "blue",
  },
  {
    key: "completed" as const,
    label: "Completed Projects",
    hint: "Successfully delivered",
    href: "/admin/projects?status=completed",
    icon: CircleCheck,
    tone: "green",
  },
  {
    key: "published" as const,
    label: "Published on Website",
    hint: "Visible to visitors",
    href: "/admin/projects?publication=published",
    icon: Globe2,
    tone: "burgundy",
  },
];

export function ProjectsKpiCards({ counts }: { counts: ProjectCounts }) {
  return (
    <ul className="oms-admin-projects-kpis">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <li key={card.key}>
            <Link
              href={card.href}
              className={`oms-admin-projects-kpi oms-admin-projects-kpi-${card.tone}`}
            >
              <span className="oms-admin-projects-kpi-icon" aria-hidden="true">
                <Icon size={22} strokeWidth={1.75} />
              </span>
              <span className="oms-admin-projects-kpi-copy">
                <span className="oms-admin-projects-kpi-label">{card.label}</span>
                <span className="oms-admin-projects-kpi-value">
                  {counts[card.key]}
                </span>
                <span className="oms-admin-projects-kpi-hint">{card.hint}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
