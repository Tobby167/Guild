"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { guildCategories, type GuildCategory, type GuildWork } from "@/lib/guild-data";
import { getCurrentSession } from "@/lib/guild-demo-state";
import { createWorkPost } from "@/lib/supabase/works";
import { getDemoProfiles } from "@/lib/guild-demo-state";
import styles from "./page.module.css";

const formats: GuildWork["format"][] = [
  "Finished Piece",
  "Work in Progress",
  "Custom Example",
];

function NewStudioPageImpl() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<GuildCategory>("Crochet");
  const [format, setFormat] = useState<GuildWork["format"]>("Finished Piece");
  const [priceRange, setPriceRange] = useState("NGN 25,000 - NGN 45,000");
  const [leadTime, setLeadTime] = useState("5-8 days");
  const [summary, setSummary] = useState("");
  const [materials, setMaterials] = useState("Cotton yarn, lining, clasp");
  const [imageLabel, setImageLabel] = useState("");
  const [commissionReady, setCommissionReady] = useState(true);
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const session = getCurrentSession();

  const creatorMode = session?.role === "creator" || session?.role === "both";
  const creatorSlug = session?.creatorSlug;
  const profile = session?.profileId
    ? getDemoProfiles().find((item) => item.id === session.profileId) ?? null
    : null;

  const previewLabel = useMemo(
    () => imageLabel.trim() || title.trim() || "Uploaded work",
    [imageLabel, title],
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setImageDataUrl(undefined);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageDataUrl(typeof reader.result === "string" ? reader.result : undefined);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!creatorMode || !session?.creatorName || !creatorSlug) {
      setMessage("Join Guild as a creator before uploading work.");
      return;
    }

    if (!title.trim() || !summary.trim()) {
      setMessage("Add a title and summary first.");
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      await createWorkPost({
        session,
        verified: profile?.verified ?? false,
        title: title.trim(),
        category,
        format,
        priceRange: priceRange.trim(),
        leadTime: leadTime.trim(),
        commissionReady,
        summary: summary.trim(),
        materials: materials
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        imageLabel: previewLabel,
        imageDataUrl,
      });

      router.push("/studio");
      router.refresh();
    } catch {
      setMessage(
        "Guild still needs the work_posts table SQL run in Supabase before uploads can save there.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.backdrop} aria-hidden="true" />

      <section className={styles.shell}>
        {!creatorMode || !creatorSlug ? (
          <section className={styles.emptyState}>
            <p className={styles.eyebrow}>Upload work</p>
            <h1>You need a creator identity first.</h1>
            <p>Join Guild as a creator, then come back to upload your work.</p>
            <Link href="/join" className={styles.primaryButton}>
              Join as creator
            </Link>
          </section>
        ) : (
          <section className={styles.layout}>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.sectionHeading}>
                <p className={styles.eyebrow}>New work</p>
                <h1>Upload a piece for your Guild studio.</h1>
              </div>

              <div className={styles.fieldGrid}>
                <label className={styles.field}>
                  <span>Title</span>
                  <input value={title} onChange={(event) => setTitle(event.target.value)} />
                </label>

                <label className={styles.field}>
                  <span>Category</span>
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
              </div>

              <div className={styles.fieldGrid}>
                <label className={styles.field}>
                  <span>Format</span>
                  <select
                    value={format}
                    onChange={(event) => setFormat(event.target.value as GuildWork["format"])}
                  >
                    {formats.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>

                <label className={styles.field}>
                  <span>Image label</span>
                  <input
                    placeholder="Describe what the image shows"
                    value={imageLabel}
                    onChange={(event) => setImageLabel(event.target.value)}
                  />
                </label>
              </div>

              <label className={styles.field}>
                <span>Summary</span>
                <textarea
                  rows={5}
                  value={summary}
                  onChange={(event) => setSummary(event.target.value)}
                />
              </label>

              <div className={styles.fieldGrid}>
                <label className={styles.field}>
                  <span>Price range</span>
                  <input
                    value={priceRange}
                    onChange={(event) => setPriceRange(event.target.value)}
                  />
                </label>

                <label className={styles.field}>
                  <span>Lead time</span>
                  <input
                    value={leadTime}
                    onChange={(event) => setLeadTime(event.target.value)}
                  />
                </label>
              </div>

              <label className={styles.field}>
                <span>Materials</span>
                <input
                  value={materials}
                  onChange={(event) => setMaterials(event.target.value)}
                />
              </label>

              <label className={styles.field}>
                <span>Upload image</span>
                <input type="file" accept="image/*" onChange={handleFileChange} />
              </label>

              <label className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={commissionReady}
                  onChange={(event) => setCommissionReady(event.target.checked)}
                />
                <span>This piece is open for commission requests.</span>
              </label>

              <div className={styles.actionRow}>
                <button type="submit" className={styles.primaryButton} disabled={isSaving}>
                  Save to studio
                </button>
                <p className={styles.helperText}>
                  This now saves the upload to Guild&apos;s Supabase-backed post
                  table instead of only to local browser storage.
                </p>
              </div>

              {message ? <p className={styles.message}>{message}</p> : null}
            </form>

            <aside className={styles.previewCard}>
              <p className={styles.cardLabel}>Preview</p>
              {imageDataUrl ? (
                <Image
                  className={styles.previewImage}
                  src={imageDataUrl}
                  alt={previewLabel}
                  width={720}
                  height={520}
                  unoptimized
                />
              ) : (
                <div className={styles.previewPlaceholder}>
                  <strong>{previewLabel}</strong>
                </div>
              )}
              <div className={styles.previewBody}>
                <span>{format}</span>
                <h2>{title || "Untitled upload"}</h2>
                <p>{summary || "Your work summary will appear here."}</p>
              </div>
            </aside>
          </section>
        )}
      </section>
    </main>
  );
}

export default dynamic(() => Promise.resolve(NewStudioPageImpl), { ssr: false });
