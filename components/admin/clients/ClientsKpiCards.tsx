import Link from "next/link";
import { FolderKanban, Link2, UserCheck, Users } from "lucide-react";
import type { ClientCounts } from "@/lib/admin/clients/queries";

const cards = [
  {
    key: "total" as const,
    label: "Total Clients",
    hint: "All clients",
    href: "/admin/clients",
    icon: Users,
    tone: "navy",
  },
  {
    key: "active" as const,
    label: "Active Clients",
    hint: "Currently active",
    href: "/admin/clients?status=active",
    icon: UserCheck,
    tone: "green",
  },
  {
    key: "withProjects" as const,
    label: "Clients With Projects",
    hint: "Linked to ≥1 project",
    href: "/admin/clients",
    icon: FolderKanban,
    tone: "blue",
  },
  {
    key: "linkedProjects" as const,
    label: "Linked Projects",
    hint: "Projects with a client",
    href: "/admin/projects",
    icon: Link2,
    tone: "burgundy",
  },
];

export function ClientsKpiCards({ counts }: { counts: ClientCounts }) {
  return (
    <ul className="oms-admin-clients-kpis">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <li key={card.key}>
            <Link
              href={card.href}
              className={`oms-admin-clients-kpi oms-admin-clients-kpi-${card.tone}`}
            >
              <span className="oms-admin-clients-kpi-icon" aria-hidden="true">
                <Icon size={22} strokeWidth={1.75} />
              </span>
              <span className="oms-admin-clients-kpi-copy">
                <span className="oms-admin-clients-kpi-label">{card.label}</span>
                <span className="oms-admin-clients-kpi-value">
                  {counts[card.key]}
                </span>
                <span className="oms-admin-clients-kpi-hint">{card.hint}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
