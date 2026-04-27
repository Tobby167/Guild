"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { guildCategories, type GuildCategory, type GuildWork } from "@/lib/guild-data";
import { getCurrentSession } from "@/lib/guild-demo-state";
import {
  fetchWorkPostForCreator,
  updateWorkPost,
  type GuildWorkPost,
} from "@/lib/supabase/works";
import styles from "../../new/page.module.css";

const formats: GuildWork["format"][] = [
  "Finished Piece",
  "Work in Progress",
  "Custom Example",
];

function EditStudioWorkPageImpl() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const session = getCurrentSession();
  const creatorMode = session?.role === "creator" || session?.role === "both";
  const workId = typeof params?.id === "string" ? params.id : "";

  const [loading, setLoading] = useState(true);
  const [work, setWork] = useState<GuildWorkPost | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<GuildCategory>("Crochet");
  const [format, setFormat] = useState<GuildWork["format"]>("Finished Piece");
  const [priceRange, setPriceRange] = useState("NGN 25,000 - NGN 45,000");
  const [leadTime, setLeadTime] = useState("5-8 days");
  const [summary, setSummary] = useState("");
  const [materials, setMaterials] = useState("Cotton yarn, lining, clasp");
  const [imageLabel, setImageLabel] = useState("");
  const [commissionReady, setCommissionReady] = useState(true);
  const [imagePreviewSrc, setImagePreviewSrc] = useState<string | undefined>(undefined);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!creatorMode || !session?.profileId || !workId) {
      return;
    }

    let active = true;

    void fetchWorkPostForCreator(workId, session.profileId)
      .then((data) => {
        if (!active) {
          return;
        }

        if (!data) {
          setMessage("Guild could not find that post under your creator account.");
          setLoading(false);
          return;
        }

        setWork(data);
        setTitle(data.title);
        setCategory(data.category);
        setFormat(data.format);
        setPriceRange(data.price_range);
        setLeadTime(data.lead_time);
        setSummary(data.summary);
        setMaterials(data.materials.join(", "));
        setImageLabel(data.image_label);
        setCommissionReady(data.commission_ready);
        setImagePreviewSrc(data.image_url ?? data.image_data_url ?? undefined);
        setLoading(false);
      })
      .catch(() => {
        if (active) {
          setMessage(
            "Guild could not load that post cleanly yet. Check the work_posts setup and try again.",
          );
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [creatorMode, session?.profileId, workId]);

  const previewLabel = useMemo(
    () => imageLabel.trim() || title.trim() || "Uploaded work",
    [imageLabel, title],
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreviewSrc(typeof reader.result === "string" ? reader.result : undefined);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!creatorMode || !session?.creatorName || !workId || !work) {
      setMessage("Join Guild as a creator before editing work.");
      return;
    }

    if (!title.trim() || !summary.trim()) {
      setMessage("Add a title and summary first.");
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      await updateWorkPost({
        workId,
        session,
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
        imageFile,
        existingImagePath: work.image_path,
        existingImageUrl: work.image_url,
      });

      router.push("/studio");
      router.refresh();
    } catch {
      setMessage("Guild could not save those changes yet.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.backdrop} aria-hidden="true" />

      <section className={styles.shell}>
        {!creatorMode || !session?.creatorSlug ? (
          <section className={styles.emptyState}>
            <p className={styles.eyebrow}>Edit work</p>
            <h1>You need a creator identity first.</h1>
            <p>Join Guild as a creator, then come back to edit your work.</p>
            <Link href="/join" className={styles.primaryButton}>
              Join as creator
            </Link>
          </section>
        ) : loading ? (
          <section className={styles.emptyState}>
            <p className={styles.eyebrow}>Edit work</p>
            <h1>Loading your post.</h1>
            <p>Guild is pulling the current details into the editor.</p>
          </section>
        ) : !work ? (
          <section className={styles.emptyState}>
            <p className={styles.eyebrow}>Edit work</p>
            <h1>We couldn&apos;t open that piece.</h1>
            <p>{message || "This post may not belong to your current creator account."}</p>
            <Link href="/studio" className={styles.primaryButton}>
              Return to studio
            </Link>
          </section>
        ) : (
          <section className={styles.layout}>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.sectionHeading}>
                <p className={styles.eyebrow}>Edit work</p>
                <h1>Update your Guild post.</h1>
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
                <span>Replace image</span>
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
                  Save changes
                </button>
                <Link href="/studio" className={styles.secondaryButton}>
                  Cancel
                </Link>
              </div>

              {message ? <p className={styles.message}>{message}</p> : null}
            </form>

            <aside className={styles.previewCard}>
              <p className={styles.cardLabel}>Preview</p>
              <div className={styles.previewMedia}>
                {imagePreviewSrc ? (
                  <Image
                    className={styles.previewImage}
                    src={imagePreviewSrc}
                    alt={previewLabel}
                    width={720}
                    height={520}
                    unoptimized
                  />
                ) : (
                  <div className={styles.previewPlaceholder} />
                )}
                <div className={styles.previewCaption}>
                  <strong>{previewLabel}</strong>
                </div>
              </div>
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

export default dynamic(() => Promise.resolve(EditStudioWorkPageImpl), { ssr: false });
