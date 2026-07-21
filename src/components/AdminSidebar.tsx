"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

interface AdminSidebarProps {
  userName: string;
}

export function AdminSidebar({ userName }: AdminSidebarProps) {
  const pathname = usePathname();

  const links = [
    { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/admin/profile", label: "Profile", icon: "👤" },
    { href: "/admin/projects", label: "Projects", icon: "📁" },
    { href: "/admin/skills", label: "Skills", icon: "💻" },
    { href: "/admin/experience", label: "Experience", icon: "💼" },
    { href: "/admin/messages", label: "Messages", icon: "✉" },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        ⚙ Admin Panel
      </div>
      <nav>
        <ul className="admin-sidebar-nav">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={pathname === link.href ? "active" : ""}
              >
                <span className="nav-icon">{link.icon}</span>
                {link.label}
              </Link>
            </li>
          ))}
          <li style={{ marginTop: "var(--space-xl)" }}>
            <Link href="/" style={{ opacity: 0.6 }}>
              <span className="nav-icon">🌐</span>
              View Site
            </Link>
          </li>
          <li>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-sm)",
                padding: "var(--space-sm) var(--space-lg)",
                color: "rgba(255,255,255,0.5)",
                fontSize: "var(--font-size-sm)",
                fontWeight: 500,
                background: "none",
                border: "none",
                borderLeft: "3px solid transparent",
                cursor: "pointer",
                width: "100%",
                fontFamily: "var(--font-sans)",
                textAlign: "left",
              }}
            >
              <span className="nav-icon">🚪</span>
              Sign Out
            </button>
          </li>
        </ul>
      </nav>
      <div style={{
        padding: "var(--space-lg)",
        marginTop: "auto",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        fontSize: "var(--font-size-xs)",
        color: "rgba(255,255,255,0.4)",
      }}>
        Logged in as <strong style={{ color: "rgba(255,255,255,0.7)" }}>{userName}</strong>
      </div>
    </aside>
  );
}
