"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/components/admin/SignOutButton";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/enquiries", label: "Contact Enquiries" },
  { href: "/admin/settings", label: "Settings" },
] as const;

function isCurrent(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === "/admin";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="oms-admin-sidebar">
      <Link href="/admin" className="oms-admin-sidebar-brand">
        <Image
          src="/logos/oms-logo-transparent.png"
          alt="ORYXI Maintenance Services"
          width={1672}
          height={941}
          className="oms-admin-sidebar-logo"
          priority
        />
        <span className="oms-admin-sidebar-kicker">Admin</span>
      </Link>

      <nav className="oms-admin-nav" aria-label="Admin">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="oms-admin-nav-link"
            aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="oms-admin-sidebar-foot">
        <SignOutButton />
      </div>
    </aside>
  );
}
