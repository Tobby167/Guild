"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { guildCategories, type GuildCategory } from "@/lib/guild-data";
import {
  clearCurrentSession,
  getCurrentSession,
  makeGuildId,
  makeGuildSlug,
  saveCurrentSession,
  saveDemoProfile,
  type GuildRole,
} from "@/lib/guild-demo-state";
import styles from "./page.module.css";

const roles: Array<{
  key: GuildRole;
  label: string;
  note: string;
}> = [
  {
    key: "buyer",
    label: "Buyer",
    note: "Browse work, save creators, and send calm custom requests.",
  },
  {
    key: "creator",
    label: "Creator",
    note: "Set up a maker identity, upload work, and receive structured requests.",
  },
  {
    key: "both",
    label: "Both",
    note: "Useful if you buy custom work and also create your own pieces.",
  },
];

export default function JoinPage() {
  const router = useRouter();
  const [role, setRole] = useState<GuildRole>("creator");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState<GuildCategory>("Crochet");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [message, setMessage] = useState("");
  const session = useMemo(() => getCurrentSession(), []);
  const creatorMode = role === "creator" || role === "both";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !email.trim()) {
      setMessage("Add your name and email first.");
      return;
    }

    const slug = creatorMode ? makeGuildSlug(name) : undefined;
    const profile = saveDemoProfile({
      id: makeGuildId("profile"),
      slug: slug ?? makeGuildSlug(name),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      category: creatorMode ? category : undefined,
      location: location.trim() || undefined,
      bio: bio.trim() || undefined,
      verified: false,
      verificationStatus: creatorMode ? "pending" : "verified",
      createdAt: new Date().toISOString(),
    });

    saveCurrentSession({
      profileId: profile.id,
      name: profile.name,
      email: profile.email,
      role: profile.role,
      creatorSlug: creatorMode ? profile.slug : undefined,
      creatorName: creatorMode ? profile.name : undefined,
    });

    router.push(creatorMode ? "/studio" : "/feed");
  };

  return (
    <main className={styles.page}>
      <div className={styles.backdrop} aria-hidden="true" />

      <section className={styles.shell}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Join Guild</p>
            <h1>Start as a buyer, a creator, or both.</h1>
            <p className={styles.lead}>
              This local demo stores your Guild identity in the browser so you
              can test the real loop: join, upload work, send a request, and
              receive it in an inbox.
            </p>
          </div>

          <aside className={styles.sideCard}>
            <p className={styles.cardLabel}>What happens next</p>
            <ul>
              <li>Buyers go straight into the feed and request flow.</li>
              <li>Creators get a studio space and a pending verification state.</li>
              <li>Admins can manually approve creator verification in the dashboard.</li>
            </ul>
          </aside>
        </section>

        <section className={styles.contentGrid}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.sectionHeading}>
              <p className={styles.cardLabel}>Account type</p>
              <h2>How should Guild treat this identity?</h2>
            </div>

            <div className={styles.roleGrid}>
              {roles.map((item) => {
                const active = item.key === role;

                return (
                  <button
                    key={item.key}
                    type="button"
                    className={`${styles.roleCard} ${active ? styles.roleCardActive : ""}`}
                    onClick={() => setRole(item.key)}
                  >
                    <strong>{item.label}</strong>
                    <span>{item.note}</span>
                  </button>
                );
              })}
            </div>

            <div className={styles.fieldGrid}>
              <label className={styles.field}>
                <span>Name</span>
                <input value={name} onChange={(event) => setName(event.target.value)} />
              </label>

              <label className={styles.field}>
                <span>Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>
            </div>

            <div className={styles.fieldGrid}>
              <label className={styles.field}>
                <span>Location</span>
                <input
                  placeholder="Lagos, Nigeria"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                />
              </label>

              {creatorMode ? (
                <label className={styles.field}>
                  <span>Main category</span>
                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value as GuildCategory)}
                  >
                    {guildCategories.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}
            </div>

            <label className={styles.field}>
              <span>{creatorMode ? "Bio" : "What are you here for?"}</span>
              <textarea
                rows={5}
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                placeholder={
                  creatorMode
                    ? "Tell Guild what you make, how you work, and what you want buyers to understand."
                    : "Tell Guild what kind of custom work or creators you want to discover."
                }
              />
            </label>

            <div className={styles.actionRow}>
              <button type="submit" className={styles.primaryButton}>
                {creatorMode ? "Enter creator studio" : "Start browsing Guild"}
              </button>
              <p className={styles.helperText}>
                {creatorMode
                  ? "Creator accounts begin with manual verification pending."
                  : "Buyer accounts go straight into discovery and request flow."}
              </p>
            </div>

            {message ? <p className={styles.message}>{message}</p> : null}
          </form>

          <aside className={styles.sidePanel}>
            <div className={styles.sideCard}>
              <p className={styles.cardLabel}>Current local session</p>
              {session ? (
                <div className={styles.sessionCard}>
                  <strong>{session.name}</strong>
                  <span>{session.email}</span>
                  <span>Role: {session.role}</span>
                  {session.creatorName ? <span>Creator mode: {session.creatorName}</span> : null}
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={() => {
                      clearCurrentSession();
                      window.location.reload();
                    }}
                  >
                    Clear local session
                  </button>
                </div>
              ) : (
                <p className={styles.helperText}>
                  No Guild identity is saved in this browser yet.
                </p>
              )}
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}
