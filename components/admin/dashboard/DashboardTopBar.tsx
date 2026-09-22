"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Bell, ChevronDown, Search } from "lucide-react";
import { SignOutButton } from "@/components/admin/SignOutButton";
import type { AdminIdentity } from "@/lib/admin/admin-identity";

type DashboardTopBarProps = {
  identity: AdminIdentity;
  newEnquiryCount: number;
};

export function DashboardTopBar({
  identity,
  newEnquiryCount,
}: DashboardTopBarProps) {
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="oms-dash-topbar">
      <form className="oms-dash-search" action="/admin/projects" method="get">
        <Search size={16} strokeWidth={1.85} aria-hidden="true" />
        <label className="oms-admin-sr-only" htmlFor="oms-dash-search">
          Search projects
        </label>
        <input
          ref={searchRef}
          id="oms-dash-search"
          name="q"
          type="search"
          placeholder="Search projects..."
          autoComplete="off"
        />
        <kbd className="oms-dash-search-kbd">⌘ K</kbd>
      </form>

      <div className="oms-dash-topbar-end">
        <Link
          href="/admin/enquiries"
          className="oms-dash-bell"
          aria-label={
            newEnquiryCount > 0
              ? `${newEnquiryCount} new enquiries`
              : "Enquiries"
          }
        >
          <Bell size={18} strokeWidth={1.8} aria-hidden="true" />
          {newEnquiryCount > 0 ? (
            <span className="oms-dash-bell-badge">
              {newEnquiryCount > 9 ? "9+" : newEnquiryCount}
            </span>
          ) : null}
        </Link>

        <details className="oms-dash-user">
          <summary aria-label="Account menu">
            <span className="oms-dash-avatar" aria-hidden="true">
              {identity.initials}
            </span>
            <span className="oms-dash-user-copy">
              <span className="oms-dash-user-name">{identity.displayName}</span>
              <span className="oms-dash-user-role">Administrator</span>
            </span>
            <ChevronDown size={16} strokeWidth={1.8} aria-hidden="true" />
          </summary>
          <div className="oms-dash-user-menu">
            {identity.email ? <p>{identity.email}</p> : null}
            <SignOutButton />
          </div>
        </details>
      </div>
    </header>
  );
}
