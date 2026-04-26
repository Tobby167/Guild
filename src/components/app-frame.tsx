"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import {
  clearCurrentSession,
  getCurrentSession,
} from "@/lib/guild-demo-state";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { ensureProfileFromSupabaseUser, signOutSupabase } from "@/lib/supabase/profiles";
import styles from "./app-frame.module.css";

const appLinks = [
  { href: "/join", label: "Join" },
  { href: "/studio", label: "Studio" },
  { href: "/inbox", label: "Inbox" },
  { href: "/feed", label: "Feed" },
];

function getRouteMood(pathname: string) {
  if (pathname === "/") {
    return {
      frameClass: styles.themeHome,
      note: "Overview and direction",
    };
  }

  if (
    pathname === "/feed" ||
    pathname.startsWith("/work/") ||
    pathname.startsWith("/creators/")
  ) {
    return {
      frameClass: styles.themeFeed,
      note: "Discovery mode",
    };
  }

  if (pathname === "/studio" || pathname.startsWith("/studio/")) {
    return {
      frameClass: styles.themeStudio,
      note: "Maker workspace",
    };
  }

  if (pathname === "/inbox") {
    return {
      frameClass: styles.themeInbox,
      note: "Inbox and replies",
    };
  }

  if (pathname === "/request") {
    return {
      frameClass: styles.themeRequest,
      note: "Commission brief",
    };
  }

  if (pathname === "/join" || pathname === "/login") {
    return {
      frameClass: styles.themeJoin,
      note: "Welcome and setup",
    };
  }

  return {
    frameClass: styles.themeHome,
    note: "App walkthrough",
  };
}

export function AppFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const routeMood = getRouteMood(pathname);
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

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      return;
    }

    const supabase = getSupabaseBrowserClient();

    supabase.auth
      .getSession()
      .then(async ({ data, error }) => {
        if (error) {
          return;
        }

        if (!data.session?.user) {
          clearCurrentSession();
          return;
        }

        try {
          await ensureProfileFromSupabaseUser(data.session.user);
        } catch {}
      })
      .catch(() => undefined);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!nextSession?.user) {
        clearCurrentSession();
        return;
      }

      void ensureProfileFromSupabaseUser(nextSession.user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOutSupabase();
    } catch {}

    clearCurrentSession();
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <div className={`${styles.frame} ${routeMood.frameClass}`}>
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
          <p className={styles.sidebarNoteLabel}>Core flow</p>
          <p>
            Join Guild, upload work, browse the feed, and manage requests in one place.
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
              <p className={styles.authLabel}>Guild</p>
              <p className={styles.authNote}>{routeMood.note}</p>
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
