import Link from "next/link";
import { CheckCircle2, Clock3, Inbox, Sparkles } from "lucide-react";
import type { EnquiryCounts } from "@/lib/admin/enquiries/queries";

const cards = [
  {
    key: "total" as const,
    label: "Total Enquiries",
    hint: "All website enquiries",
    href: "/admin/enquiries",
    icon: Inbox,
    tone: "navy",
  },
  {
    key: "new" as const,
    label: "New",
    hint: "Awaiting review",
    href: "/admin/enquiries?status=new",
    icon: Sparkles,
    tone: "burgundy",
  },
  {
    key: "in_progress" as const,
    label: "In Progress",
    hint: "Being handled",
    href: "/admin/enquiries?status=in_progress",
    icon: Clock3,
    tone: "blue",
  },
  {
    key: "closed" as const,
    label: "Closed",
    hint: "Completed history",
    href: "/admin/enquiries?status=closed",
    icon: CheckCircle2,
    tone: "green",
  },
];

export function EnquiriesKpiCards({ counts }: { counts: EnquiryCounts }) {
  return (
    <ul className="oms-admin-enquiries-kpis">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <li key={card.key}>
            <Link
              href={card.href}
              className={`oms-admin-enquiries-kpi oms-admin-enquiries-kpi-${card.tone}`}
            >
              <span className="oms-admin-enquiries-kpi-icon" aria-hidden="true">
                <Icon size={22} strokeWidth={1.75} />
              </span>
              <span className="oms-admin-enquiries-kpi-copy">
                <span className="oms-admin-enquiries-kpi-label">{card.label}</span>
                <span className="oms-admin-enquiries-kpi-value">
                  {counts[card.key]}
                </span>
                <span className="oms-admin-enquiries-kpi-hint">{card.hint}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
