import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/require-admin";
import { adminIdentityFromUser } from "@/lib/admin/admin-identity";
import { loadAdminSettings } from "@/lib/admin/settings/queries";
import { AdminAccountCard } from "@/components/admin/settings/AdminAccountCard";
import { CompanyInformationForm } from "@/components/admin/settings/CompanyInformationForm";
import { ContactNotificationsForm } from "@/components/admin/settings/ContactNotificationsForm";
import { SystemCard } from "@/components/admin/settings/SystemCard";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function AdminSettingsPage() {
  const user = await requireAdmin();
  const identity = adminIdentityFromUser(user);
  const settings = await loadAdminSettings();

  return (
    <section
      className="oms-admin-settings"
      aria-labelledby="oms-admin-settings-heading"
    >
      <header className="oms-admin-settings-hero">
        <div className="oms-admin-settings-hero-media" aria-hidden="true" />
        <div className="oms-admin-settings-hero-content">
          <nav
            className="oms-admin-settings-breadcrumb"
            aria-label="Breadcrumb"
          >
            <Link href="/admin">Dashboard</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Settings</span>
          </nav>

          <div className="oms-admin-settings-hero-row">
            <div>
              <h1
                id="oms-admin-settings-heading"
                className="oms-admin-heading"
              >
                Settings
              </h1>
              <p className="oms-admin-welcome">
                Manage OMS company and system preferences.
              </p>
            </div>
          </div>
        </div>
      </header>

      {settings.error ? (
        <p className="oms-admin-error" role="alert">
          Settings could not be loaded completely. Showing defaults where needed.
        </p>
      ) : null}

      <div className="oms-admin-settings-grid">
        <article className="oms-admin-setting-card">
          <header className="oms-admin-setting-card-header">
            <h2 className="oms-admin-setting-card-title">
              Company Information
            </h2>
            <p className="oms-admin-setting-card-subtitle">
              Core company details stored for OMS administration.
            </p>
          </header>
          <CompanyInformationForm initialValues={settings.company} />
        </article>

        <article className="oms-admin-setting-card">
          <header className="oms-admin-setting-card-header">
            <h2 className="oms-admin-setting-card-title">
              Contact &amp; Notifications
            </h2>
            <p className="oms-admin-setting-card-subtitle">
              Enquiry routing preferences for future integration.
            </p>
          </header>
          <ContactNotificationsForm initialValues={settings.notifications} />
        </article>

        <AdminAccountCard identity={identity} />
        <SystemCard />
      </div>
    </section>
  );
}
