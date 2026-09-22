"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  CircleHelp,
  ExternalLink,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Users,
  X,
} from "lucide-react";
import { SignOutButton } from "@/components/admin/SignOutButton";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/enquiries", label: "Contact Enquiries", icon: Inbox },
  { href: "/admin/settings", label: "Settings", icon: Settings },
] as const;

function isCurrent(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === "/admin";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <aside className={`oms-admin-sidebar${open ? " is-open" : ""}`}>
      <div className="oms-admin-sidebar-top">
        <Link href="/admin" className="oms-admin-sidebar-brand">
          <Image
            src="/logos/oms-logo-white.png.png"
            alt="ORYXI Maintenance Services"
            width={480}
            height={270}
            className="oms-admin-sidebar-logo"
            priority
          />
        </Link>
        <button
          type="button"
          className="oms-admin-sidebar-toggle"
          aria-expanded={open}
          aria-controls="oms-admin-sidebar-body"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? (
            <X size={18} strokeWidth={2} />
          ) : (
            <Menu size={18} strokeWidth={2} />
          )}
          <span>{open ? "Close" : "Menu"}</span>
        </button>
      </div>

      <div id="oms-admin-sidebar-body" className="oms-admin-sidebar-body">
        <nav className="oms-admin-nav" aria-label="Admin">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="oms-admin-nav-link"
                aria-current={
                  isCurrent(pathname, item.href) ? "page" : undefined
                }
                onClick={() => setOpen(false)}
              >
                <Icon size={16} strokeWidth={1.85} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="oms-admin-sidebar-rule" />

        <Link href="/en" className="oms-admin-nav-link oms-admin-nav-external">
          <ExternalLink size={16} strokeWidth={1.85} aria-hidden="true" />
          Visit Website
        </Link>

        <div className="oms-admin-sidebar-art-spacer" aria-hidden="true" />

        <div className="oms-admin-sidebar-foot">
          <a className="oms-admin-nav-link" href="mailto:marketing@oms.com.qa">
            <CircleHelp size={16} strokeWidth={1.85} aria-hidden="true" />
            Help &amp; Support
          </a>
          <SignOutButton className="oms-admin-signout-icon">
            <LogOut size={16} strokeWidth={1.85} aria-hidden="true" />
          </SignOutButton>
        </div>
      </div>
    </aside>
  );
}
