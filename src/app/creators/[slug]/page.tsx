import Link from "next/link";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { creators, getCreatorBySlug, getWorksByCreator } from "@/lib/guild-data";
import styles from "./page.module.css";

export function generateStaticParams() {
  return creators.map((creator) => ({ slug: creator.slug }));
}

export default async function CreatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const creator = getCreatorBySlug(slug);

  if (!creator) {
    notFound();
  }

  const portfolio = getWorksByCreator(creator.slug);

  return (
    <main className={styles.page}>
      <div className={styles.backdrop} aria-hidden="true" />

      <section className={styles.shell}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>{creator.category}</p>
            <h1>{creator.name}</h1>
            <p className={styles.bio}>{creator.bio}</p>

            <div className={styles.highlights}>
              <article>
                <span>Status</span>
                <strong>{creator.verified ? "Verified creator" : "Verification in progress"}</strong>
              </article>
              <article>
                <span>Turnaround</span>
                <strong>{creator.turnaround}</strong>
              </article>
              <article>
                <span>Response time</span>
                <strong>{creator.responseTime}</strong>
              </article>
              <article>
                <span>Completed jobs</span>
                <strong>{creator.completedJobs}</strong>
              </article>
            </div>
          </div>

          <aside className={styles.profileCard}>
            <p className={styles.cardLabel}>Creator snapshot</p>
            <div className={styles.snapshotRow}>
              <span>Location</span>
              <strong>{creator.location}</strong>
            </div>
            <div className={styles.snapshotRow}>
              <span>Availability</span>
              <strong>{creator.availability}</strong>
            </div>
            <div className={styles.snapshotRow}>
              <span>Rating</span>
              <strong>{creator.rating}</strong>
            </div>
            <p className={styles.highlightNote}>{creator.highlight}</p>
            <Link className={styles.actionButton} href={`/request?creator=${creator.slug}`}>
              Start a custom request
            </Link>
          </aside>
        </section>

        <section className={styles.specialtySection}>
          <div className={styles.sectionHeading}>
            <p className={styles.cardLabel}>Specialties</p>
            <h2>How this creator should be hired.</h2>
          </div>

          <div className={styles.specialties}>
            {creator.specialties.map((specialty) => (
              <span key={specialty}>{specialty}</span>
            ))}
          </div>
        </section>

        <section className={styles.portfolioSection}>
          <div className={styles.sectionHeading}>
            <p className={styles.cardLabel}>Portfolio</p>
            <h2>Work that helps buyers decide with confidence.</h2>
          </div>

          <div className={styles.portfolioGrid}>
            {portfolio.map((work) => (
              <article key={work.slug} className={styles.workCard}>
                <div
                  className={styles.workVisual}
                  style={
                    {
                      "--tone-a": work.palette[0],
                      "--tone-b": work.palette[1],
                      "--tone-c": work.palette[2],
                    } as CSSProperties
                  }
                >
                  <span>{work.format}</span>
                  <strong>{work.imageLabel}</strong>
                </div>
                <div className={styles.workBody}>
                  <p className={styles.workCategory}>{work.category}</p>
                  <h3>
                    <Link href={`/work/${work.slug}`}>{work.title}</Link>
                  </h3>
                  <p>{work.summary}</p>
                  <div className={styles.workMeta}>
                    <span>{work.priceRange}</span>
                    <span>{work.leadTime}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
