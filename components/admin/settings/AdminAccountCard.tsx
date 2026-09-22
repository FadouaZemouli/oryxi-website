import type { AdminIdentity } from "@/lib/admin/admin-identity";
import { SettingsPasswordAction } from "@/components/admin/settings/SettingsPasswordAction";

type AdminAccountCardProps = {
  identity: AdminIdentity;
};

export function AdminAccountCard({ identity }: AdminAccountCardProps) {
  return (
    <article className="oms-admin-setting-card">
      <header className="oms-admin-setting-card-header">
        <h2 className="oms-admin-setting-card-title">Admin Account</h2>
        <p className="oms-admin-setting-card-subtitle">
          Signed-in OMS administrator profile.
        </p>
      </header>

      <dl className="oms-admin-setting-readonly">
        <div>
          <dt>Display name</dt>
          <dd>{identity.displayName || "—"}</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>{identity.email || "—"}</dd>
        </div>
      </dl>

      <SettingsPasswordAction email={identity.email} />
    </article>
  );
}
