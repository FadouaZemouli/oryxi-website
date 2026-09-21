import type { EnquiryStatus } from "@/lib/admin/enquiries/types";
import { ENQUIRY_STATUS_LABELS } from "@/lib/admin/enquiries/types";

export function EnquiryStatusBadge({ status }: { status: EnquiryStatus }) {
  return (
    <span
      className={`oms-admin-pill oms-admin-enquiries-pill oms-admin-enquiries-pill-${status}`}
    >
      {ENQUIRY_STATUS_LABELS[status]}
    </span>
  );
}
