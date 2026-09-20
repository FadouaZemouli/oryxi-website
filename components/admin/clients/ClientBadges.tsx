type ClientStatusBadgeProps = {
  status: "active" | "inactive";
};

export function ClientStatusBadge({ status }: ClientStatusBadgeProps) {
  const label = status === "active" ? "Active" : "Inactive";

  return (
    <span
      className={
        status === "active"
          ? "oms-admin-pill oms-admin-pill-active"
          : "oms-admin-pill oms-admin-pill-inactive"
      }
    >
      {label}
    </span>
  );
}

export function ClientPublishBadge({ published }: { published: boolean }) {
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
