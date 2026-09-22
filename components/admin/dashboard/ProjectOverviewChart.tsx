type ProjectOverviewChartProps = {
  ongoing: number;
  completed: number;
};

const BURGUNDY = "#891746";
const PALE_ROSE = "#e8c5d2";

export function ProjectOverviewChart({
  ongoing,
  completed,
}: ProjectOverviewChartProps) {
  const total = ongoing + completed;
  const ongoingPct = total > 0 ? Math.round((ongoing / total) * 100) : 0;
  const completedPct = total > 0 ? 100 - ongoingPct : 0;
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const gap = total > 0 && ongoing > 0 && completed > 0 ? 4 : 0;
  const usable = circumference - gap * (ongoing > 0 && completed > 0 ? 2 : 0);
  const ongoingLength = total > 0 ? (ongoing / total) * usable : 0;
  const completedLength = total > 0 ? (completed / total) * usable : 0;

  return (
    <section
      className="oms-dash-panel oms-dash-overview"
      aria-labelledby="oms-dash-overview-heading"
    >
      <header className="oms-dash-panel-head">
        <div>
          <h2 id="oms-dash-overview-heading">Project Overview</h2>
          <p>Current status distribution across all projects.</p>
        </div>
      </header>

      {total === 0 ? (
        <p className="oms-admin-empty">
          No projects yet. Status distribution will appear here once projects
          are added.
        </p>
      ) : (
        <div className="oms-dash-overview-body">
          <svg
            className="oms-dash-donut"
            viewBox="0 0 140 140"
            role="img"
            aria-label={`${ongoing} ongoing and ${completed} completed projects`}
          >
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="#f4e8ed"
              strokeWidth="18"
            />
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke={BURGUNDY}
              strokeWidth="18"
              strokeDasharray={`${ongoingLength} ${circumference}`}
              strokeDashoffset="0"
              strokeLinecap="butt"
              transform="rotate(-90 70 70)"
            />
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke={PALE_ROSE}
              strokeWidth="18"
              strokeDasharray={`${completedLength} ${circumference}`}
              strokeDashoffset={-(ongoingLength + gap)}
              strokeLinecap="butt"
              transform="rotate(-90 70 70)"
            />
            <text
              x="70"
              y="64"
              textAnchor="middle"
              fill="#0b1726"
              fontSize="26"
              fontWeight="750"
            >
              {total}
            </text>
            <text
              x="70"
              y="84"
              textAnchor="middle"
              fill="#5d6772"
              fontSize="9"
              fontWeight="700"
              letterSpacing="0.08em"
            >
              Projects
            </text>
          </svg>

          <ul className="oms-dash-legend">
            <li>
              <span
                className="oms-dash-legend-swatch oms-dash-legend-ongoing"
                aria-hidden="true"
              />
              <span>
                Ongoing
                <strong>
                  {ongoing} · {ongoingPct}%
                </strong>
              </span>
            </li>
            <li>
              <span
                className="oms-dash-legend-swatch oms-dash-legend-completed"
                aria-hidden="true"
              />
              <span>
                Completed
                <strong>
                  {completed} · {completedPct}%
                </strong>
              </span>
            </li>
          </ul>
        </div>
      )}
    </section>
  );
}
