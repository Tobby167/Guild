import Link from "next/link";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { creators, getWorkBySlug, works } from "@/lib/guild-data";
import styles from "./page.module.css";

export function generateStaticParams() {
  return works.map((work) => ({ slug: work.slug }));
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = getWorkBySlug(slug);

  if (!work) {
    notFound();
  }

  const creator = creators.find((item) => item.slug === work.creatorSlug);
  const similarWorks = works
    .filter((item) => item.slug !== work.slug && item.category === work.category)
    .slice(0, 3);

  return (
    <main className={styles.page}>
      <div className={styles.backdrop} aria-hidden="true" />

      <section className={styles.shell}>
        <section className={styles.hero}>
          <div
            className={styles.imageStage}
            style={
              {
                "--tone-a": work.palette[0],
                "--tone-b": work.palette[1],
                "--tone-c": work.palette[2],
              } as CSSProperties
            }
          >
            <span className={styles.stageLabel}>{work.format}</span>
            <div className={styles.stageText}>
              <strong>{work.imageLabel}</strong>
            </div>
          </div>

          <div className={styles.heroPanel}>
            <p className={styles.eyebrow}>{work.category}</p>
            <h1>{work.title}</h1>
            <p className={styles.summary}>{work.summary}</p>

            <div className={styles.metaGrid}>
              <article>
                <span>Price range</span>
                <strong>{work.priceRange}</strong>
              </article>
              <article>
                <span>Lead time</span>
                <strong>{work.leadTime}</strong>
              </article>
              <article>
                <span>Commission status</span>
                <strong>{work.commissionReady ? "Open to custom requests" : "Reference only"}</strong>
              </article>
              {creator ? (
                <article>
                  <span>Creator</span>
                  <strong>{creator.name}</strong>
                </article>
              ) : null}
            </div>

            <div className={styles.actions}>
              {creator ? (
                <Link href={`/request?creator=${creator.slug}&work=${work.slug}`}>
                  Request commission
                </Link>
              ) : null}
              {creator ? (
                <Link className={styles.secondaryAction} href={`/creators/${creator.slug}`}>
                  Open creator profile
                </Link>
              ) : null}
            </div>
          </div>
        </section>

        <section className={styles.detailsGrid}>
          <article className={styles.panel}>
            <p className={styles.panelLabel}>Materials and process</p>
            <h2>What this piece depends on.</h2>
            <ul className={styles.materialList}>
              {work.materials.map((material) => (
                <li key={material}>{material}</li>
              ))}
            </ul>
          </article>

          {creator ? (
            <article className={styles.panel}>
              <p className={styles.panelLabel}>Creator trust</p>
              <h2>Who would make this for the buyer.</h2>
              <div className={styles.creatorSnapshot}>
                <div>
                  <span>Creator</span>
                  <strong>{creator.name}</strong>
                </div>
                <div>
                  <span>Location</span>
                  <strong>{creator.location}</strong>
                </div>
                <div>
                  <span>Turnaround</span>
                  <strong>{creator.turnaround}</strong>
                </div>
                <div>
                  <span>Status</span>
                  <strong>{creator.verified ? "Verified creator" : "Verification in progress"}</strong>
                </div>
              </div>
              <p className={styles.note}>{creator.highlight}</p>
            </article>
          ) : null}
        </section>

        <section className={styles.similarSection}>
          <div className={styles.sectionHeading}>
            <p className={styles.panelLabel}>More from this world</p>
            <h2>Similar pieces buyers might explore next.</h2>
          </div>

          <div className={styles.similarGrid}>
            {similarWorks.map((item) => (
              <Link key={item.slug} href={`/work/${item.slug}`} className={styles.similarCard}>
                <span>{item.category}</span>
                <strong>{item.title}</strong>
                <p>{item.priceRange}</p>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
