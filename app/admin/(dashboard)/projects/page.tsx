import type { Metadata } from "next";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const metadata: Metadata = {
  title: "Projects",
};

export default function AdminProjectsPage() {
  return (
    <ComingSoon
      title="Projects"
      description="Project management will be added in a later phase. Counts on the dashboard already reflect ongoing and completed projects."
    />
  );
}
