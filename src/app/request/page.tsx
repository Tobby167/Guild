"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { creators, getCreatorBySlug, getWorkBySlug } from "@/lib/guild-data";
import {
  getCurrentSession,
  makeGuildId,
  saveDemoRequest,
} from "@/lib/guild-demo-state";
import styles from "./page.module.css";

function RequestPageImpl() {
  const searchParams = useSearchParams();
  const creatorSlugParam = searchParams.get("creator") ?? creators[0]?.slug ?? "";
  const workSlugParam = searchParams.get("work");
  const initialWork = workSlugParam ? getWorkBySlug(workSlugParam) : undefined;
  const initialCreator = getCreatorBySlug(creatorSlugParam);
  const currentSession = getCurrentSession();
  const [selectedCreatorSlug, setSelectedCreatorSlug] = useState<string>(creatorSlugParam);
  const [buyerName, setBuyerName] = useState(currentSession?.name ?? "");
  const [buyerEmail, setBuyerEmail] = useState(currentSession?.email ?? "");
  const [projectTitle, setProjectTitle] = useState(
    initialWork ? `${initialWork.title} inspired custom request` : "Custom handmade request",
  );
  const [category, setCategory] = useState(
    initialWork?.category ?? initialCreator?.category ?? "",
  );
  const [budgetRange, setBudgetRange] = useState(
    initialWork?.priceRange ?? "Discuss with creator",
  );
  const [neededBy, setNeededBy] = useState(
    initialWork?.leadTime ?? initialCreator?.turnaround ?? "Flexible timeline",
  );
  const [description, setDescription] = useState(
    initialWork
      ? `I would like a custom version of ${initialWork.title}. I like the overall feel, but I want to adjust the color palette, measurements, and finishing details to suit my needs.`
      : "Describe what you want made, what matters most, and any details the creator should know before pricing.",
  );
  const [materials, setMaterials] = useState(
    initialWork ? initialWork.materials.join(", ") : "Cotton yarn, beads, lining",
  );
  const [deliveryNotes, setDeliveryNotes] = useState("Lagos delivery preferred");
  const [referenceNotes, setReferenceNotes] = useState(
    "Add screenshots, inspiration, measurements, or fit notes here in the real product.",
  );
  const [message, setMessage] = useState("");

  const creator = useMemo(
    () => getCreatorBySlug(selectedCreatorSlug),
    [selectedCreatorSlug],
  );
  const work = useMemo(
    () => (workSlugParam ? getWorkBySlug(workSlugParam) : undefined),
    [workSlugParam],
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!creator) {
      setMessage("Choose a creator first.");
      return;
    }

    if (!buyerName.trim() || !buyerEmail.trim() || !projectTitle.trim()) {
      setMessage("Add your name, email, and project title first.");
      return;
    }

    saveDemoRequest({
      id: makeGuildId("request"),
      creatorSlug: creator.slug,
      creatorName: creator.name,
      workSlug: work?.slug,
      workTitle: work?.title,
      buyerName: buyerName.trim(),
      buyerEmail: buyerEmail.trim().toLowerCase(),
      projectTitle: projectTitle.trim(),
      category: category.trim() || creator.category,
      budgetRange,
      neededBy,
      description: description.trim(),
      materials: materials.trim(),
      deliveryNotes: deliveryNotes.trim(),
      referenceNotes: referenceNotes.trim(),
      status: "new",
      createdAt: new Date().toISOString(),
    });

    setMessage(`Request saved for ${creator.name}. Open the creator inbox to review it.`);
  };

  return (
    <main className={styles.page}>
      <div className={styles.backdrop} aria-hidden="true" />

      <section className={styles.shell}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Commission Request</p>
            <h1>Shape a clear request before it becomes a scattered DM.</h1>
            <p className={styles.lead}>
              Guild guides the buyer through a structured custom request with
              enough detail for a creator to quote clearly and confidently.
            </p>

            <div className={styles.snapshotGrid}>
              <article>
                <span>Creator</span>
                <strong>{creator?.name ?? "Choose a creator below"}</strong>
              </article>
              <article>
                <span>Reference piece</span>
                <strong>{work?.title ?? "No specific piece attached yet"}</strong>
              </article>
              <article>
                <span>Typical lead time</span>
                <strong>{creator?.turnaround ?? work?.leadTime ?? "To be discussed"}</strong>
              </article>
            </div>
          </div>

          <aside className={styles.infoCard}>
            <p className={styles.cardLabel}>What this page is for</p>
            <ul>
              <li>Give creators enough detail to price accurately.</li>
              <li>Reduce vague back-and-forth before a quote is sent.</li>
              <li>Save the brief into a real creator inbox.</li>
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
                    setSelectedCreatorSlug(nextSlug);

                    if (!work) {
                      const nextCreator = getCreatorBySlug(nextSlug);
                      setCategory(nextCreator?.category ?? "");
                      setNeededBy(nextCreator?.turnaround ?? "Flexible timeline");
                    }
                  }}
                >
                  {creators.map((item) => (
                    <option key={item.slug} value={item.slug}>
                      {item.name}
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
              <button type="submit" className={styles.primaryButton}>
                Save request to inbox
              </button>
              <p className={styles.helperText}>
                This local demo stores the request in the browser and makes it
                visible in the creator inbox right away.
              </p>
            </div>

            {message ? (
              <div className={styles.messagePanel}>
                <p>{message}</p>
                {creator ? (
                  <Link href={`/inbox?creator=${creator.slug}`}>Open {creator.name}&apos;s inbox</Link>
                ) : null}
              </div>
            ) : null}
          </form>

          <aside className={styles.sidePanel}>
            <div className={styles.sideCard}>
              <p className={styles.cardLabel}>Attached context</p>
              <dl className={styles.definitionList}>
                <div>
                  <dt>Selected creator</dt>
                  <dd>{creator?.name ?? "None selected"}</dd>
                </div>
                <div>
                  <dt>Verification status</dt>
                  <dd>{creator ? (creator.verified ? "Verified creator" : "In review") : "N/A"}</dd>
                </div>
                <div>
                  <dt>Reference work</dt>
                  <dd>{work?.title ?? "None selected"}</dd>
                </div>
                <div>
                  <dt>Lead-time context</dt>
                  <dd>{work?.leadTime ?? creator?.turnaround ?? "Discuss first"}</dd>
                </div>
              </dl>
            </div>

            <div className={styles.sideCard}>
              <p className={styles.cardLabel}>What now works</p>
              <ol>
                <li>The form saves to a local creator inbox.</li>
                <li>The creator can review it and change the status.</li>
                <li>The request stays connected to the chosen maker.</li>
              </ol>
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}

export default dynamic(() => Promise.resolve(RequestPageImpl), { ssr: false });
