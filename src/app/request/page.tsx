"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getCurrentSession } from "@/lib/guild-demo-state";
import {
  buildCreatorOptionsFromPosts,
  createCommissionRequest,
  type GuildCreatorOption,
} from "@/lib/supabase/requests";
import { fetchWorkPosts, type GuildWorkPost } from "@/lib/supabase/works";
import styles from "./page.module.css";

function RequestPageImpl() {
  const searchParams = useSearchParams();
  const currentSession = getCurrentSession();
  const [posts, setPosts] = useState<GuildWorkPost[]>([]);
  const [message, setMessage] = useState("");
  const [loadingMessage, setLoadingMessage] = useState("");
  const requestedCreator = searchParams.get("creator");
  const creatorOptions = useMemo<GuildCreatorOption[]>(
    () => buildCreatorOptionsFromPosts(posts),
    [posts],
  );
  const [selectedCreatorSlug, setSelectedCreatorSlug] = useState<string>("");
  const creator = useMemo(
    () => creatorOptions.find((profile) => profile.creatorSlug === selectedCreatorSlug),
    [creatorOptions, selectedCreatorSlug],
  );
  const creatorPosts = useMemo(
    () => posts.filter((post) => post.creator_slug === selectedCreatorSlug),
    [posts, selectedCreatorSlug],
  );
  const [buyerName, setBuyerName] = useState(currentSession?.name ?? "");
  const [buyerEmail, setBuyerEmail] = useState(currentSession?.email ?? "");
  const [projectTitle, setProjectTitle] = useState("Custom handmade request");
  const [category, setCategory] = useState("");
  const [budgetRange, setBudgetRange] = useState("Discuss with creator");
  const [neededBy, setNeededBy] = useState("Flexible timeline");
  const [description, setDescription] = useState(
    "Describe what you want made, what matters most, and any details the creator should know before pricing.",
  );
  const [materials, setMaterials] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [referenceNotes, setReferenceNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let active = true;

    void fetchWorkPosts()
      .then((data) => {
        if (!active) {
          return;
        }

        setPosts(data);

        const firstCreatorSlug =
          requestedCreator && data.some((post) => post.creator_slug === requestedCreator)
            ? requestedCreator
            : data[0]?.creator_slug ?? "";
        const firstCreator = buildCreatorOptionsFromPosts(data).find(
          (item) => item.creatorSlug === firstCreatorSlug,
        );

        setSelectedCreatorSlug(firstCreatorSlug);
        setCategory(firstCreator?.category ?? "");
      })
      .catch(() => {
        if (active) {
          setLoadingMessage(
            "Guild still needs the work_posts and commission_requests SQL run in Supabase before requests can load properly.",
          );
        }
      });

    return () => {
      active = false;
    };
  }, [requestedCreator]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!currentSession) {
      setMessage("Log in or join Guild first before sending a request.");
      return;
    }

    if (!creator) {
      setMessage("Choose a creator first.");
      return;
    }

    if (!buyerName.trim() || !buyerEmail.trim() || !projectTitle.trim()) {
      setMessage("Add your name, email, and project title first.");
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      await createCommissionRequest({
        session: currentSession,
        creatorId: creator.creatorId,
        creatorSlug: creator.creatorSlug,
        creatorName: creator.creatorName,
        projectTitle,
        category: category || creator.category,
        budgetRange,
        neededBy,
        description,
        materials,
        deliveryNotes,
        referenceNotes,
      });

      setMessage(`Request saved for ${creator.creatorName}. Open the inbox to review it.`);
    } catch {
      setMessage(
        "Guild still needs the commission_requests table SQL run in Supabase before requests can save there.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!currentSession) {
    return (
      <main className={styles.page}>
        <div className={styles.backdrop} aria-hidden="true" />

        <section className={styles.shell}>
          <section className={styles.emptyState}>
            <p className={styles.cardLabel}>Log in first</p>
            <h2>You need a Guild account to send requests.</h2>
            <p>
              Join or log in first, then come back to send a structured commission
              request that lands in a creator inbox.
            </p>
            <div className={styles.emptyActions}>
              <Link href="/join" className={styles.primaryButton}>
                Sign up
              </Link>
              <Link href="/login" className={styles.secondaryButton}>
                Log in
              </Link>
            </div>
          </section>
        </section>
      </main>
    );
  }

  if (creatorOptions.length === 0) {
    return (
      <main className={styles.page}>
        <div className={styles.backdrop} aria-hidden="true" />

        <section className={styles.shell}>
          <section className={styles.emptyState}>
            <p className={styles.cardLabel}>No creators yet</p>
            <h2>There is nobody to request work from yet.</h2>
            <p>
              Guild now runs from real creator posts. Once a creator uploads
              work in Studio, they can start receiving requests here.
            </p>
            <div className={styles.emptyActions}>
              <Link href="/studio/new" className={styles.primaryButton}>
                Upload a piece
              </Link>
              <Link href="/feed" className={styles.secondaryButton}>
                Back to feed
              </Link>
            </div>
          </section>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.backdrop} aria-hidden="true" />

      <section className={styles.shell}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Commission request</p>
            <h1>Turn a loose idea into a clear brief.</h1>
            <p className={styles.lead}>
              Guild guides buyers through a structured request so creators can
              quote clearly, respond faster, and avoid scattered back-and-forth.
            </p>

            <div className={styles.snapshotGrid}>
              <article>
                <span>Creator</span>
                <strong>{creator?.creatorName ?? "Choose a creator below"}</strong>
              </article>
              <article>
                <span>Status</span>
                <strong>{creator?.creatorVerified ? "Verified creator" : "Verification in review"}</strong>
              </article>
              <article>
                <span>Posted work</span>
                <strong>{creatorPosts.length}</strong>
              </article>
            </div>
          </div>

          <aside className={styles.infoCard}>
            <p className={styles.cardLabel}>What this page is for</p>
            <ul>
              <li>Give creators enough detail to price accurately.</li>
              <li>Reduce vague back-and-forth before a quote is sent.</li>
              <li>Save the brief directly into the chosen creator inbox.</li>
            </ul>
          </aside>
        </section>

        <section className={styles.formShell}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.sectionHeading}>
              <p className={styles.cardLabel}>Request brief</p>
              <h2>What should the maker build?</h2>
            </div>

            <div className={styles.fieldGrid}>
              <label className={styles.field}>
                <span>Buyer name</span>
                <input value={buyerName} onChange={(event) => setBuyerName(event.target.value)} />
              </label>

              <label className={styles.field}>
                <span>Buyer email</span>
                <input
                  type="email"
                  value={buyerEmail}
                  onChange={(event) => setBuyerEmail(event.target.value)}
                />
              </label>
            </div>

            <div className={styles.fieldGrid}>
              <label className={styles.field}>
                <span>Creator</span>
                <select
                  value={selectedCreatorSlug}
                  onChange={(event) => {
                    const nextSlug = event.target.value;
                    const nextCreator = creatorOptions.find(
                      (profile) => profile.creatorSlug === nextSlug,
                    );

                    setSelectedCreatorSlug(nextSlug);
                    setCategory(nextCreator?.category ?? "");
                  }}
                >
                  {creatorOptions.map((profile) => (
                    <option key={profile.creatorId} value={profile.creatorSlug}>
                      {profile.creatorName}
                    </option>
                  ))}
                </select>
              </label>

              <label className={styles.field}>
                <span>Project title</span>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(event) => setProjectTitle(event.target.value)}
                />
              </label>
            </div>

            <div className={styles.fieldGrid}>
              <label className={styles.field}>
                <span>Category</span>
                <input value={category} onChange={(event) => setCategory(event.target.value)} />
              </label>

              <label className={styles.field}>
                <span>Budget range</span>
                <select
                  value={budgetRange}
                  onChange={(event) => setBudgetRange(event.target.value)}
                >
                  <option>Under NGN 50,000</option>
                  <option>NGN 50,000 - NGN 120,000</option>
                  <option>NGN 120,000 - NGN 250,000</option>
                  <option>Above NGN 250,000</option>
                  <option>Discuss with creator</option>
                </select>
              </label>

              <label className={styles.field}>
                <span>Needed by</span>
                <input value={neededBy} onChange={(event) => setNeededBy(event.target.value)} />
              </label>
            </div>

            <label className={styles.field}>
              <span>Description</span>
              <textarea
                rows={6}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </label>

            <div className={styles.fieldGrid}>
              <label className={styles.field}>
                <span>Preferred colors or materials</span>
                <input value={materials} onChange={(event) => setMaterials(event.target.value)} />
              </label>

              <label className={styles.field}>
                <span>Delivery or pickup notes</span>
                <input
                  value={deliveryNotes}
                  onChange={(event) => setDeliveryNotes(event.target.value)}
                />
              </label>
            </div>

            <label className={styles.field}>
              <span>Reference notes</span>
              <textarea
                rows={4}
                value={referenceNotes}
                onChange={(event) => setReferenceNotes(event.target.value)}
              />
            </label>

            <div className={styles.actionRow}>
              <button type="submit" className={styles.primaryButton} disabled={isSaving}>
                Save request to inbox
              </button>
              <p className={styles.helperText}>
                This now saves the request to Guild&apos;s shared Supabase-backed
                inbox instead of only to local browser storage.
              </p>
            </div>

            {message ? (
              <div className={styles.messagePanel}>
                <p>{message}</p>
                {creator ? <Link href="/inbox">Open inbox</Link> : null}
              </div>
            ) : null}
          </form>

          <aside className={styles.sidePanel}>
            <div className={styles.sideCard}>
              <p className={styles.cardLabel}>Attached context</p>
              <dl className={styles.definitionList}>
                <div>
                  <dt>Selected creator</dt>
                  <dd>{creator?.creatorName ?? "None selected"}</dd>
                </div>
                <div>
                  <dt>Verification status</dt>
                  <dd>{creator ? (creator.creatorVerified ? "Verified creator" : "In review") : "N/A"}</dd>
                </div>
                <div>
                  <dt>Posted pieces</dt>
                  <dd>{creatorPosts.length}</dd>
                </div>
                <div>
                  <dt>Category context</dt>
                  <dd>{creator?.category ?? "Not added yet"}</dd>
                </div>
              </dl>
            </div>

            <div className={styles.sideCard}>
              <p className={styles.cardLabel}>What now works</p>
              <ol>
                <li>The form saves to a real Guild creator account.</li>
                <li>The creator can review it and change the status in Inbox.</li>
                <li>The request is shared through Supabase instead of one browser.</li>
              </ol>
            </div>

            {loadingMessage ? (
              <div className={styles.sideCard}>
                <p className={styles.cardLabel}>Setup note</p>
                <p>{loadingMessage}</p>
              </div>
            ) : null}
          </aside>
        </section>
      </section>
    </main>
  );
}

export default dynamic(() => Promise.resolve(RequestPageImpl), { ssr: false });
