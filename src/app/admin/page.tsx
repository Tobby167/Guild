"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import { guildCategories } from "@/lib/guild-data";
import {
  getDemoProfiles,
  getDemoRequests,
  updateProfileVerification,
  type GuildDemoProfile,
  type GuildDemoRequest,
} from "@/lib/guild-demo-state";
import styles from "./page.module.css";

const notes = [
  "Keep verification manual in v1 until the trust rules are stable.",
  "Do not let copied-work reports auto-ban creators without review.",
  "Track which categories receive the most commission requests before expanding v1.",
];

function AdminPageImpl() {
  const [profiles, setProfiles] = useState<GuildDemoProfile[]>(() => getDemoProfiles());
  const [requests, setRequests] = useState<GuildDemoRequest[]>(() => getDemoRequests());

  const refresh = () => {
    setProfiles(getDemoProfiles());
    setRequests(getDemoRequests());
  };

  const creatorProfiles = useMemo(
    () => profiles.filter((profile) => profile.role === "creator" || profile.role === "both"),
    [profiles],
  );
  const pendingProfiles = useMemo(
    () => creatorProfiles.filter((profile) => profile.verificationStatus === "pending"),
    [creatorProfiles],
  );
  const openRequests = useMemo(
    () => requests.filter((request) => request.status !== "archived"),
    [requests],
  );

  const stats = [
    {
      label: "Pending Verification",
      value: String(pendingProfiles.length).padStart(2, "0"),
      note:
        pendingProfiles.length > 0
          ? "Approve local creator signups"
          : "No pending creator signups",
    },
    {
      label: "Open Requests",
      value: String(openRequests.length).padStart(2, "0"),
      note:
        openRequests.length > 0
          ? "Requests waiting for creator action"
          : "No request activity yet",
    },
    {
      label: "Active Creators",
      value: String(creatorProfiles.length).padStart(2, "0"),
      note:
        creatorProfiles.length > 0
          ? `${creatorProfiles.length} creator account(s) saved on this device`
          : "No creator accounts yet",
    },
    {
      label: "Commission Requests",
      value: String(requests.length).padStart(2, "0"),
      note: "Saved through the current Guild request flow",
    },
  ];

  return (
    <main className={styles.page}>
      <div className={styles.backdrop} aria-hidden="true" />

      <section className={styles.shell}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Guild Internal Dashboard</p>
            <h1>Admin control for trust, safety, and platform flow.</h1>
            <p className={styles.lead}>
              This founder-facing control room reads the current Guild state on
              this device. Creator signups can be manually approved here, and
              saved requests show up as real activity.
            </p>
          </div>

          <div className={styles.headerActions}>
            <span className={styles.badge}>Current Admin: You</span>
            <Link className={styles.linkButton} href="/">
              Back to Guild
            </Link>
          </div>
        </header>

        <section className={styles.statsGrid}>
          {stats.map((stat) => (
            <article key={stat.label} className={styles.statCard}>
              <p className={styles.cardLabel}>{stat.label}</p>
              <strong>{stat.value}</strong>
              <span>{stat.note}</span>
            </article>
          ))}
        </section>

        <section className={styles.mainGrid}>
          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.cardLabel}>Verification Queue</p>
                <h2>Approve creators with enough proof.</h2>
              </div>
              <span className={styles.panelMeta}>Manual-first review</span>
            </div>

            {pendingProfiles.length === 0 ? (
              <div className={styles.listCard}>
                <p className={styles.detailRow}>
                  No pending creator signups on this device yet. Use the join
                  flow to create one, then approve it here.
                </p>
              </div>
            ) : (
              <div className={styles.list}>
                {pendingProfiles.map((item) => (
                  <div key={item.id} className={styles.listCard}>
                    <div className={styles.listTop}>
                      <h3>{item.name}</h3>
                      <span className={styles.statusChip}>Needs review</span>
                    </div>
                    <p className={styles.detailRow}>
                      <strong>Category:</strong> {item.category ?? "Not provided"}
                    </p>
                    <p className={styles.detailRow}>
                      <strong>Email:</strong> {item.email}
                    </p>
                    <p className={styles.detailRow}>
                      <strong>Bio:</strong> {item.bio ?? "No bio added yet"}
                    </p>
                    <div className={styles.actionRow}>
                      <button
                        type="button"
                        onClick={() => {
                          updateProfileVerification(item.id, "verified");
                          refresh();
                        }}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className={styles.secondaryAction}
                        onClick={refresh}
                      >
                        Keep pending
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>

          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.cardLabel}>Reports</p>
                <h2>Review copied-work and trust issues fast.</h2>
              </div>
              <span className={styles.panelMeta}>Priority sorted</span>
            </div>
            <div className={styles.listCard}>
              <p className={styles.detailRow}>
                No reports have been filed yet. This queue will become useful
                once creators and buyers begin using the app more actively.
              </p>
            </div>
          </article>
        </section>

        <section className={styles.lowerGrid}>
          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.cardLabel}>Request Queue</p>
                <h2>Watch live request activity.</h2>
              </div>
            </div>

            {requests.length === 0 ? (
              <div className={styles.simpleCard}>
                <p className={styles.detailRow}>
                  No requests yet. Submit one from the request form or the
                  request form to populate this queue.
                </p>
              </div>
            ) : (
              <div className={styles.list}>
                {requests.slice(0, 4).map((request) => (
                  <div key={request.id} className={styles.simpleCard}>
                    <div className={styles.listTop}>
                      <h3>{request.projectTitle}</h3>
                      <span className={styles.userRole}>{request.status}</span>
                    </div>
                    <p className={styles.detailRow}>
                      <strong>Creator:</strong> {request.creatorName}
                    </p>
                    <p className={styles.detailRow}>
                      <strong>Buyer:</strong> {request.buyerName}
                    </p>
                    <p className={styles.detailRow}>
                      <strong>Budget:</strong> {request.budgetRange}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </article>

          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.cardLabel}>Categories</p>
                <h2>Current v1 craft scope.</h2>
              </div>
            </div>

            <div className={styles.categoryWrap}>
              {guildCategories.map((category) => (
                <span key={category} className={styles.categoryChip}>
                  {category}
                </span>
              ))}
            </div>

            <div className={styles.categoryAction}>
              <button type="button">Add category later</button>
            </div>
          </article>

          <article className={`${styles.panel} ${styles.notesPanel}`}>
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.cardLabel}>Trust Notes</p>
                <h2>What the admin should protect first.</h2>
              </div>
            </div>

            <ul className={styles.noteList}>
              {notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </article>
        </section>
      </section>
    </main>
  );
}

export default dynamic(() => Promise.resolve(AdminPageImpl), { ssr: false });
