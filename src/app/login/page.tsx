"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  getDemoProfiles,
} from "@/lib/guild-demo-state";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { ensureProfileFromSupabaseUser } from "@/lib/supabase/profiles";
import styles from "./page.module.css";

export default function LoginPage() {
  const router = useRouter();
  const profiles = useMemo(() => getDemoProfiles(), []);
  const [email, setEmail] = useState(profiles[0]?.email ?? "");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setMessage("Enter your email and password first.");
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      if (!isSupabaseConfigured()) {
        setMessage(
          "Guild is missing its Supabase keys in Vercel settings, so hosted login cannot finish yet.",
        );
        return;
      }

      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      if (!data.user) {
        setMessage("Guild could not open that account yet.");
        return;
      }

      const profile = await ensureProfileFromSupabaseUser(data.user);

      router.push(
        profile.role === "creator" || profile.role === "both" ? "/studio" : "/feed",
      );
      router.refresh();
    } catch {
      setMessage(
        "Guild could not finish login cleanly yet. Check the Supabase setup and try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.backdrop} aria-hidden="true" />

      <section className={styles.card}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Log in</p>
          <h1>Open your Guild account.</h1>
          <p>
            Choose an account saved on this device and step back into Guild
            instantly.
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

          <label className={styles.field}>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Your Guild password"
            />
          </label>

          {profiles.length > 0 ? (
            <div className={styles.savedAccounts}>
              <p className={styles.savedLabel}>Saved accounts on this device</p>
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
              No Guild account exists on this device yet. Create one first.
            </p>
          )}

          <div className={styles.actions}>
            <button type="submit" className={styles.primaryButton} disabled={isSaving}>
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
