import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

type AdminShellProps = {
  children: ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="oms-admin-shell">
      <AdminSidebar />
      <div className="oms-admin-main">{children}</div>
    </div>
  );
}
