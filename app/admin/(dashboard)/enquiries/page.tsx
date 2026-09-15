import type { Metadata } from "next";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const metadata: Metadata = {
  title: "Contact Enquiries",
};

export default function AdminEnquiriesPage() {
  return (
    <ComingSoon
      title="Contact Enquiries"
      description="Full enquiry management will be added in a later phase. New submissions already appear on the dashboard."
    />
  );
}
