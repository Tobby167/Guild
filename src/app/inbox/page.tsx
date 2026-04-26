"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCurrentSession } from "@/lib/guild-demo-state";
import {
  fetchRequestsForCreator,
  type GuildCommissionRequest,
  updateCommissionRequestStatus,
} from "@/lib/supabase/requests";
import styles from "./page.module.css";

function InboxPageImpl() {
  const session = getCurrentSession();
  const creatorMode = session?.role === "creator" || session?.role === "both";
  const [requests, setRequests] = useState<GuildCommissionRequest[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!creatorMode || !session?.profileId) {
      return;
    }

    let active = true;

    void fetchRequestsForCreator(session.profileId)
      .then((data) => {
        if (active) {
          setRequests(data);
        }
      })
      .catch(() => {
        if (active) {
          setMessage(
            "Guild still needs the commission_requests table SQL run in Supabase before Inbox can load shared requests.",
          );
        }
      });

    return () => {
      active = false;
    };
  }, [creatorMode, session?.profileId]);

  const handleStatusUpdate = async (
    requestId: string,
    status: GuildCommissionRequest["status"],
  ) => {
    if (!session?.profileId) {
      return;
    }

    try {
      await updateCommissionRequestStatus(requestId, status);
      const next = await fetchRequestsForCreator(session.profileId);
      setRequests(next);
    } catch {
      setMessage("Guild could not update that request yet.");
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.backdrop} aria-hidden="true" />

      <section className={styles.shell}>
        {!creatorMode || !session?.profileId ? (
          <section className={styles.emptyState}>
            <p className={styles.cardLabel}>No creator inbox yet</p>
            <h2>You need a creator account to use Inbox.</h2>
            <p>
              Join Guild as a creator or both, then come back here to review the
              requests sent to your work.
            </p>
            <Link href="/join" className={styles.secondaryButton}>
              Join as creator
            </Link>
          </section>
        ) : (
          <>
            <section className={styles.hero}>
              <div className={styles.heroCopy}>
                <p className={styles.eyebrow}>Creator inbox</p>
                <h1>Review the requests that are ready for a quote.</h1>
                <p className={styles.lead}>
                  This inbox now reads from Guild&apos;s shared request table, so
                  the work is no longer trapped in one browser.
                </p>
              </div>

              <aside className={styles.sideCard}>
                <p className={styles.cardLabel}>Current creator</p>
                <label className={styles.selector}>
                  <span>Signed in as</span>
                  <div className={styles.selectorNote}>{session.creatorName ?? session.name}</div>
                </label>
                <p className={styles.selectorNote}>
                  {requests.length} request{requests.length === 1 ? "" : "s"} currently waiting
                  in this inbox.
                </p>
              </aside>
            </section>

            <section className={styles.welcomeCard}>
              <div className={styles.logoMark} aria-hidden="true">
                GU
              </div>
              <div className={styles.welcomeCopy}>
                <p className={styles.cardLabel}>Welcome to Guild</p>
                <h2>We&apos;re happy to have you on board.</h2>
                <p>
                  This inbox is your calm place for commission requests, updates,
                  and the conversations that grow around your work. Keep your
                  studio ready, check in often, and let Guild help you stay close
                  to the people who want to create with you.
                </p>
              </div>
            </section>

            {message ? <p className={styles.selectorNote}>{message}</p> : null}

            <section className={styles.requestSection}>
              {requests.length === 0 ? (
                <div className={styles.emptyState}>
                  <p className={styles.cardLabel}>No requests yet</p>
                  <h2>Your inbox is set up and ready.</h2>
                  <p>
                    We&apos;ll place every new commission request here as soon as
                    someone reaches out. Until then, you can keep posting work,
                    share your page, or send a test request into Guild to see how
                    it feels from both sides.
                  </p>
                  <Link href="/request" className={styles.secondaryButton}>
                    Open request form
                  </Link>
                </div>
              ) : (
                <div className={styles.requestList}>
                  {requests.map((request) => (
                    <article key={request.id} className={styles.requestCard}>
                      <div className={styles.requestTop}>
                        <div>
                          <p className={styles.cardLabel}>{request.category}</p>
                          <h2>{request.project_title}</h2>
                        </div>
                        <span
                          className={`${styles.statusChip} ${
                            request.status === "new"
                              ? styles.statusNew
                              : request.status === "quoted"
                                ? styles.statusQuoted
                                : styles.statusArchived
                          }`}
                        >
                          {request.status}
                        </span>
                      </div>

                      <div className={styles.metaGrid}>
                        <article>
                          <span>Buyer</span>
                          <strong>{request.buyer_name}</strong>
                        </article>
                        <article>
                          <span>Budget</span>
                          <strong>{request.budget_range}</strong>
                        </article>
                        <article>
                          <span>Needed by</span>
                          <strong>{request.needed_by}</strong>
                        </article>
                        <article>
                          <span>Reference work</span>
                          <strong>{request.work_title ?? "Custom brief only"}</strong>
                        </article>
                      </div>

                      <div className={styles.requestBody}>
                        <p>
                          <strong>Description:</strong> {request.description}
                        </p>
                        <p>
                          <strong>Materials:</strong> {request.materials ?? "Not specified"}
                        </p>
                        <p>
                          <strong>Delivery notes:</strong> {request.delivery_notes ?? "Not specified"}
                        </p>
                        <p>
                          <strong>Reference notes:</strong> {request.reference_notes ?? "Not specified"}
                        </p>
                      </div>

                      <div className={styles.actionRow}>
                        <button
                          type="button"
                          className={styles.primaryButton}
                          onClick={() => handleStatusUpdate(request.id, "quoted")}
                        >
                          Mark as quoted
                        </button>
                        <button
                          type="button"
                          className={styles.secondaryButton}
                          onClick={() => handleStatusUpdate(request.id, "archived")}
                        >
                          Archive
                        </button>
                        <button
                          type="button"
                          className={styles.ghostButton}
                          onClick={() => handleStatusUpdate(request.id, "new")}
                        >
                          Reset to new
                        </button>
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

export default dynamic(() => Promise.resolve(InboxPageImpl), { ssr: false });
