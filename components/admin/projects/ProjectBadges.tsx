type ProjectStatusBadgeProps = {
  status: "ongoing" | "completed";
};

export function ProjectStatusBadge({ status }: ProjectStatusBadgeProps) {
  const label = status === "completed" ? "Completed" : "Ongoing";

  return (
    <span
      className={
        status === "completed"
          ? "oms-admin-pill oms-admin-pill-completed"
          : "oms-admin-pill oms-admin-pill-ongoing"
      }
    >
      {label}
    </span>
  );
}

export function ProjectPublishBadge({ published }: { published: boolean }) {
  return (
    <span
      className={
        published
          ? "oms-admin-pill oms-admin-pill-published"
          : "oms-admin-pill oms-admin-pill-draft"
      }
    >
      {published ? "Published" : "Draft"}
    </span>
  );
}
