"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  getDemoProfiles,
  saveCurrentSession,
  type GuildDemoProfile,
} from "@/lib/guild-demo-state";
import styles from "./page.module.css";

function makeSession(profile: GuildDemoProfile) {
  return {
    profileId: profile.id,
    name: profile.name,
    email: profile.email,
    role: profile.role,
    creatorSlug:
      profile.role === "creator" || profile.role === "both" ? profile.slug : undefined,
    creatorName:
      profile.role === "creator" || profile.role === "both" ? profile.name : undefined,
  };
}

export default function LoginPage() {
  const router = useRouter();
  const profiles = useMemo(() => getDemoProfiles(), []);
  const [email, setEmail] = useState(profiles[0]?.email ?? "");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const profile = profiles.find(
      (item) => item.email.toLowerCase() === email.trim().toLowerCase(),
    );

    if (!profile) {
      setMessage("No local Guild account was found for that email. Sign up first.");
      return;
    }

    saveCurrentSession(makeSession(profile));
    router.push(
      profile.role === "creator" || profile.role === "both" ? "/studio" : "/feed",
    );
    router.refresh();
  };

  return (
    <main className={styles.page}>
      <div className={styles.backdrop} aria-hidden="true" />

      <section className={styles.card}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Log in</p>
          <h1>Open your Guild account.</h1>
          <p>
            This demo login checks the local accounts saved in your browser and
            restores that session instantly.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="your@email.com"
            />
          </label>

          {profiles.length > 0 ? (
            <div className={styles.savedAccounts}>
              <p className={styles.savedLabel}>Saved local accounts</p>
              <div className={styles.savedList}>
                {profiles.map((profile) => (
                  <button
                    key={profile.id}
                    type="button"
                    className={styles.savedAccount}
                    onClick={() => setEmail(profile.email)}
                  >
                    <strong>{profile.name}</strong>
                    <span>{profile.email}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className={styles.helper}>
              No local account exists yet. Create one first to test the full flow.
            </p>
          )}

          <div className={styles.actions}>
            <button type="submit" className={styles.primaryButton}>
              Log in
            </button>
            <Link href="/join" className={styles.secondaryButton}>
              Sign up
            </Link>
          </div>

          {message ? <p className={styles.message}>{message}</p> : null}
        </form>
      </section>
    </main>
  );
}
