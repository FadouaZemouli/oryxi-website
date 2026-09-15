import type { Metadata } from "next";
import Image from "next/image";
import { ResetPasswordForm } from "@/components/admin/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset password",
};

export default function AdminResetPasswordPage() {
  return (
    <main className="oms-admin-login">
      <section
        className="oms-admin-login-card"
        aria-labelledby="oms-admin-reset-heading"
      >
        <div className="oms-admin-login-brand">
          <Image
            src="/logos/oms-logo.png"
            alt="ORYXI Maintenance Services"
            width={913}
            height={600}
            className="oms-admin-login-logo"
            priority
          />
          <p className="oms-admin-login-kicker">Control panel</p>
          <h1 id="oms-admin-reset-heading" className="oms-admin-login-title">
            Reset Password
          </h1>
          <p className="oms-admin-login-copy">
            Choose a new password for your OMS administrator account.
          </p>
        </div>
        <ResetPasswordForm />
      </section>
    </main>
  );
}
