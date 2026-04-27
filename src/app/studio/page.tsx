"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getCurrentSession, getDemoProfiles } from "@/lib/guild-demo-state";
import {
  deleteWorkPost,
  fetchWorkPostsForCreator,
  migrateLegacyWorkPostImage,
  type GuildWorkPost,
} from "@/lib/supabase/works";
import styles from "./page.module.css";

function StudioPageImpl() {
  const session = getCurrentSession();
  const profile = session?.creatorSlug
    ? getDemoProfiles().find((item) => item.id === session.profileId) ?? null
    : null;
  const [uploads, setUploads] = useState<GuildWorkPost[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!session?.profileId || !(session.role === "creator" || session.role === "both")) {
      return;
    }

    let active = true;
    void fetchWorkPostsForCreator(session.profileId)
      .then(async (data) => {
        if (active) {
          setUploads(data);
        }

        const legacyPosts = data.filter((work) => work.image_data_url && !work.image_url);

        if (!legacyPosts.length) {
          return;
        }

        try {
          const migrated = await Promise.all(
            data.map((work) =>
              work.image_data_url && !work.image_url
                ? migrateLegacyWorkPostImage(work)
                : Promise.resolve(work),
            ),
          );

          if (active) {
            setUploads(migrated);
          }
        } catch {
          if (active) {
            setMessage(
              "Guild loaded your work, but some older images still need a storage refresh.",
            );
          }
        }
      })
      .catch(() => {
        if (active) {
          setMessage(
            "Guild still needs the work_posts table SQL run in Supabase before Studio can load uploaded work.",
          );
        }
      });

    return () => {
      active = false;
    };
  }, [session?.profileId, session?.role]);

  const commissionReadyCount = useMemo(
    () => uploads.filter((work) => work.commission_ready).length,
    [uploads],
  );

  const creatorMode = session?.role === "creator" || session?.role === "both";

  return (
    <main className={styles.page}>
      <div className={styles.backdrop} aria-hidden="true" />

      <section className={styles.shell}>
        {!creatorMode || !session?.creatorSlug ? (
          <section className={styles.emptyState}>
            <p className={styles.eyebrow}>Creator studio</p>
            <h1>You need a creator identity to use the studio.</h1>
            <p>
              Join Guild as a creator or both, then come back here to upload work,
              track verification, and prepare your portfolio for buyer requests.
            </p>
            <div className={styles.actionRow}>
              <Link href="/join" className={styles.primaryButton}>
                Join as creator
              </Link>
              <Link href="/feed" className={styles.secondaryButton}>
                Keep browsing feed
              </Link>
            </div>
          </section>
        ) : (
          <>
            <section className={styles.hero}>
              <div className={styles.heroCopy}>
                <p className={styles.eyebrow}>Creator studio</p>
                <h1>{session.creatorName}</h1>
                <p className={styles.lead}>
                  This is the working space for a Guild creator. Upload your
                  pieces, watch your verification status, and prepare your
                  portfolio for real commission requests.
                </p>

                <div className={styles.statGrid}>
                  <article>
                    <span>Verification</span>
                    <strong>
                      {profile?.verified ? "Verified creator" : "Pending review"}
                    </strong>
                  </article>
                  <article>
                    <span>Uploads</span>
                    <strong>{uploads.length}</strong>
                  </article>
                  <article>
                    <span>Commission-ready</span>
                    <strong>{commissionReadyCount}</strong>
                  </article>
                </div>
              </div>

              <aside className={styles.sideCard}>
                <p className={styles.cardLabel}>Next steps</p>
                <ul>
                  <li>Upload work with enough detail for discovery and quoting.</li>
                  <li>Wait for manual verification approval from the admin side.</li>
                  <li>Check your inbox for structured commission requests.</li>
                </ul>

                <div className={styles.sideActions}>
                  <Link href="/studio/new" className={styles.primaryButton}>
                    Upload a new piece
                  </Link>
                  <Link href="/inbox" className={styles.secondaryButton}>
                    Open creator inbox
                  </Link>
                </div>
              </aside>
            </section>

            <section className={styles.uploadSection}>
              <div className={styles.sectionHeading}>
                <p className={styles.cardLabel}>Uploaded work</p>
                <h2>Your Guild portfolio.</h2>
              </div>

              {message ? <p className={styles.helperText}>{message}</p> : null}

              {uploads.length === 0 ? (
                <div className={styles.emptyUploads}>
                  <p>No uploaded pieces yet.</p>
                  <Link href="/studio/new">Add your first work</Link>
                </div>
              ) : (
                <div className={styles.uploadGrid}>
                  {uploads.map((work) => (
                    <article key={work.id} className={styles.uploadCard}>
                      {work.image_url || work.image_data_url ? (
                        <Image
                          className={styles.uploadImage}
                          src={work.image_url ?? work.image_data_url ?? ""}
                          alt={work.title}
                          width={720}
                          height={520}
                          unoptimized
                        />
                      ) : (
                        <div className={styles.uploadPlaceholder}>
                          <strong>{work.image_label}</strong>
                        </div>
                      )}

                      <div className={styles.uploadBody}>
                        <p className={styles.workCategory}>{work.category}</p>
                        <h3>{work.title}</h3>
                        <p>{work.summary}</p>
                        <div className={styles.metaRow}>
                          <span>{work.price_range}</span>
                          <span>{work.lead_time}</span>
                        </div>
                        <div className={styles.uploadActions}>
                          <Link
                            href={`/studio/edit/${work.id}`}
                            className={styles.editButton}
                          >
                            Edit post
                          </Link>
                          <button
                            type="button"
                            className={styles.deleteButton}
                            onClick={async () => {
                              if (!window.confirm(`Delete "${work.title}" from Studio?`)) {
                                return;
                              }

                              try {
                                await deleteWorkPost(work.id, work.image_path);
                                const next = await fetchWorkPostsForCreator(session.profileId);
                                setUploads(next);
                              } catch {
                                setMessage("Guild could not delete that work yet.");
                              }
                            }}
                          >
                            Delete post
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </section>
    </main>
  );
}

export default dynamic(() => Promise.resolve(StudioPageImpl), { ssr: false });
