import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { getAuthorizedAdmin } from "@/lib/admin/require-admin";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function AdminLoginPage() {
  const admin = await getAuthorizedAdmin();

  if (admin) {
    redirect("/admin");
  }

  return (
    <main className="oms-admin-login">
      <section className="oms-admin-login-card" aria-labelledby="oms-admin-login-heading">
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
          <h1 id="oms-admin-login-heading" className="oms-admin-login-title">
            OMS Admin
          </h1>
          <p className="oms-admin-login-copy">
            Sign in with an authorized OMS administrator account.
          </p>
        </div>
        <LoginForm />
      </section>
    </main>
  );
}
