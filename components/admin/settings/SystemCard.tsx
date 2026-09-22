export function SystemCard() {
  return (
    <article className="oms-admin-setting-card">
      <header className="oms-admin-setting-card-header">
        <h2 className="oms-admin-setting-card-title">System</h2>
        <p className="oms-admin-setting-card-subtitle">
          Environment status for OMS Settings storage.
        </p>
      </header>

      <dl className="oms-admin-setting-readonly">
        <div>
          <dt>Website</dt>
          <dd>
            <a
              href="https://www.oms.com.qa"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://www.oms.com.qa
            </a>
          </dd>
        </div>
        <div>
          <dt>Settings storage</dt>
          <dd>
            <span className="oms-admin-setting-status oms-admin-setting-status-ok">
              Connected
            </span>
          </dd>
        </div>
        <div>
          <dt>Public website integration</dt>
          <dd>
            <span className="oms-admin-setting-status oms-admin-setting-status-muted">
              Not enabled
            </span>
          </dd>
        </div>
      </dl>
    </article>
  );
}
