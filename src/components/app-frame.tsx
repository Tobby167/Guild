"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useSyncExternalStore, type ReactNode } from "react";
import {
  clearCurrentSession,
  getCurrentSession,
} from "@/lib/guild-demo-state";
import styles from "./app-frame.module.css";

const appLinks = [
  { href: "/join", label: "Join" },
  { href: "/studio", label: "Studio" },
  { href: "/inbox", label: "Inbox" },
  { href: "/feed", label: "Feed" },
];

export function AppFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const session = useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined") {
        return () => undefined;
      }

      window.addEventListener("storage", callback);
      window.addEventListener("guild-session-change", callback);

      return () => {
        window.removeEventListener("storage", callback);
        window.removeEventListener("guild-session-change", callback);
      };
    },
    getCurrentSession,
    () => null,
  );

  const handleLogout = () => {
    clearCurrentSession();
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <div className={styles.frame}>
      <div
        className={menuOpen ? styles.overlayVisible : styles.overlay}
        aria-hidden={menuOpen ? "false" : "true"}
        onClick={() => setMenuOpen(false)}
      />

      <aside
        id="guild-side-menu"
        className={menuOpen ? styles.sidebarOpen : styles.sidebar}
      >
        <div className={styles.sidebarHeader}>
          <Link
            className={styles.brand}
            href="/"
            onClick={() => setMenuOpen(false)}
          >
            <span className={styles.brandMark}>GU</span>
            <div>
              <p className={styles.brandName}>Guild</p>
              <p className={styles.brandTag}>Creator app</p>
            </div>
          </Link>

          <button
            type="button"
            className={styles.closeButton}
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            Close
          </button>
        </div>

        <div className={styles.navBlock}>
          <p className={styles.navLabel}>App menu</p>
          <nav className={styles.navList} aria-label="Guild app pages">
            {appLinks.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={active ? styles.navLinkActive : styles.navLink}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className={styles.sidebarNote}>
          <p className={styles.sidebarNoteLabel}>Testing flow</p>
          <p>
            Join, browse the feed, upload a piece, and watch requests land in the inbox.
          </p>
        </div>
      </aside>

      <div className={styles.contentColumn}>
        <header className={styles.authBar}>
          <div className={styles.authLeft}>
            <button
              type="button"
              className={styles.menuButton}
              onClick={() => setMenuOpen((current) => !current)}
              aria-expanded={menuOpen}
              aria-controls="guild-side-menu"
            >
              <span className={styles.menuIcon} aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              Menu
            </button>

            <div className={styles.authIntro}>
              <p className={styles.authLabel}>Guild preview</p>
              <p className={styles.authNote}>
                {pathname === "/" ? "Homepage and direction" : "App walkthrough"}
              </p>
            </div>
          </div>

          {session ? (
            <div className={styles.sessionStrip}>
              <div className={styles.sessionInfo}>
                <span className={styles.sessionName}>{session.name}</span>
                <span className={styles.sessionMeta}>
                  {session.role === "both"
                    ? "Buyer + Creator"
                    : session.role === "creator"
                      ? "Creator"
                      : "Buyer"}
                </span>
              </div>
              <button type="button" className={styles.authGhost} onClick={handleLogout}>
                Log out
              </button>
            </div>
          ) : (
            <div className={styles.authActions}>
              <Link
                href="/login"
                className={styles.authGhost}
                onClick={() => setMenuOpen(false)}
              >
                Log in
              </Link>
              <Link
                href="/join"
                className={styles.authPrimary}
                onClick={() => setMenuOpen(false)}
              >
                Sign up
              </Link>
            </div>
          )}
        </header>

        <div className={styles.pageStage}>{children}</div>
      </div>
    </div>
  );
}
