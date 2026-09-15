import type { DashboardCounts, RecentEnquiry } from "@/lib/admin/dashboard-data";

type DashboardOverviewProps = {
  welcomeName: string;
  counts: DashboardCounts;
  recentEnquiries: RecentEnquiry[];
};

const cards: { key: keyof DashboardCounts; label: string }[] = [
  { key: "ongoingProjects", label: "Ongoing Projects" },
  { key: "completedProjects", label: "Completed Projects" },
  { key: "clients", label: "Clients" },
  { key: "newEnquiries", label: "New Enquiries" },
];

function formatDate(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function DashboardOverview({
  welcomeName,
  counts,
  recentEnquiries,
}: DashboardOverviewProps) {
  return (
    <section aria-labelledby="oms-admin-dashboard-heading">
      <h1 id="oms-admin-dashboard-heading" className="oms-admin-heading">
        Dashboard
      </h1>
      <p className="oms-admin-welcome">Welcome back, {welcomeName}.</p>

      <ul className="oms-admin-cards">
        {cards.map((card) => (
          <li key={card.key} className="oms-admin-card">
            <p className="oms-admin-card-label">{card.label}</p>
            <p className="oms-admin-card-value">{counts[card.key]}</p>
          </li>
        ))}
      </ul>

      <div className="oms-admin-panel">
        <h2 className="oms-admin-panel-title">Recent Enquiries</h2>
        {recentEnquiries.length === 0 ? (
          <p className="oms-admin-empty">
            No new enquiries right now. New contact form submissions will appear
            here.
          </p>
        ) : (
          <ul className="oms-admin-enquiry-list">
            {recentEnquiries.map((enquiry) => {
              const dateLabel = formatDate(enquiry.createdAt);

              return (
                <li key={enquiry.id} className="oms-admin-enquiry">
                  <p className="oms-admin-enquiry-title">{enquiry.title}</p>
                  <p className="oms-admin-enquiry-meta">
                    {[enquiry.detail, dateLabel].filter(Boolean).join(" · ")}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
