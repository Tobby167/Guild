"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { creators } from "@/lib/guild-data";
import {
  getCurrentSession,
  getDemoProfiles,
  getRequestsForCreator,
  type GuildDemoRequest,
  updateRequestStatus,
} from "@/lib/guild-demo-state";
import styles from "./page.module.css";

type CreatorOption = {
  slug: string;
  name: string;
  source: "seed" | "local";
};

function InboxPageImpl() {
  const searchParams = useSearchParams();
  const creatorOptions = useMemo<CreatorOption[]>(() => {
    const localCreatorProfiles = getDemoProfiles().filter(
      (profile) => profile.role === "creator" || profile.role === "both",
    );

    const localOptions: CreatorOption[] = localCreatorProfiles.map((profile) => ({
      slug: profile.slug,
      name: profile.name,
      source: "local",
    }));

    const seedOptions: CreatorOption[] = creators.map((creator) => ({
      slug: creator.slug,
      name: creator.name,
      source: "seed",
    }));

    return [...seedOptions, ...localOptions];
  }, []);
  const requestedCreator = searchParams.get("creator");
  const [selectedCreatorSlug, setSelectedCreatorSlug] = useState(
    () =>
      requestedCreator ??
      getCurrentSession()?.creatorSlug ??
      creatorOptions[0]?.slug ??
      "",
  );
  const [requests, setRequests] = useState(() =>
    selectedCreatorSlug ? getRequestsForCreator(selectedCreatorSlug) : [],
  );

  const selectedCreator = useMemo(
    () => creatorOptions.find((item) => item.slug === selectedCreatorSlug),
    [creatorOptions, selectedCreatorSlug],
  );

  const handleStatusUpdate = (
    requestId: string,
    status: GuildDemoRequest["status"],
  ) => {
    updateRequestStatus(requestId, status);
    setRequests(getRequestsForCreator(selectedCreatorSlug));
  };

  return (
    <main className={styles.page}>
      <div className={styles.backdrop} aria-hidden="true" />

      <section className={styles.shell}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Creator inbox</p>
            <h1>Review the requests that are ready for a quote.</h1>
            <p className={styles.lead}>
              This inbox reads the local demo requests saved in your browser.
              Pick any creator identity to see what buyers have submitted and
              mark each request as new, quoted, or archived.
            </p>
          </div>

          <aside className={styles.sideCard}>
            <p className={styles.cardLabel}>Selected creator</p>
            <label className={styles.selector}>
              <span>View inbox as</span>
              <select
                value={selectedCreatorSlug}
                onChange={(event) => {
                  const nextSlug = event.target.value;
                  setSelectedCreatorSlug(nextSlug);
                  setRequests(nextSlug ? getRequestsForCreator(nextSlug) : []);
                }}
              >
                {creatorOptions.map((item) => (
                  <option key={`${item.source}-${item.slug}`} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            <p className={styles.selectorNote}>
              {selectedCreator
                ? `${selectedCreator.name} is currently showing ${requests.length} request${requests.length === 1 ? "" : "s"}.`
                : "Choose a creator to open the inbox."}
            </p>
          </aside>
        </section>

        <section className={styles.requestSection}>
          {requests.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.cardLabel}>No requests yet</p>
              <h2>This inbox is clear for now.</h2>
              <p>
                Submit a request from a work page or the request form, then come
                back here to review it.
              </p>
              <Link href="/feed" className={styles.secondaryButton}>
                Browse work and create a request
              </Link>
            </div>
          ) : (
            <div className={styles.requestList}>
              {requests.map((request) => (
                <article key={request.id} className={styles.requestCard}>
                  <div className={styles.requestTop}>
                    <div>
                      <p className={styles.cardLabel}>{request.category}</p>
                      <h2>{request.projectTitle}</h2>
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
                      <strong>{request.buyerName}</strong>
                    </article>
                    <article>
                      <span>Budget</span>
                      <strong>{request.budgetRange}</strong>
                    </article>
                    <article>
                      <span>Needed by</span>
                      <strong>{request.neededBy}</strong>
                    </article>
                    <article>
                      <span>Reference work</span>
                      <strong>{request.workTitle ?? "Custom brief only"}</strong>
                    </article>
                  </div>

                  <div className={styles.requestBody}>
                    <p>
                      <strong>Description:</strong> {request.description}
                    </p>
                    <p>
                      <strong>Materials:</strong> {request.materials}
                    </p>
                    <p>
                      <strong>Delivery notes:</strong> {request.deliveryNotes}
                    </p>
                    <p>
                      <strong>Reference notes:</strong> {request.referenceNotes}
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
      </section>
    </main>
  );
}

export default dynamic(() => Promise.resolve(InboxPageImpl), { ssr: false });
