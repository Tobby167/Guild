"use client";

import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";
import {
  creators,
  guildCategories,
  type GuildCategory,
  works,
} from "@/lib/guild-data";
import styles from "./page.module.css";

type FeedFilter = "All" | GuildCategory;

export default function FeedPage() {
  const [selectedCategories, setSelectedCategories] = useState<GuildCategory[]>([]);
  const categoryFilters: FeedFilter[] = ["All", ...guildCategories];
  const imageHeights = [
    "25rem",
    "33rem",
    "26rem",
    "37rem",
    "21rem",
    "29rem",
    "24rem",
    "35rem",
  ];
  const allActive = selectedCategories.length === 0;

  const toggleCategory = (category: FeedFilter) => {
    if (category === "All") {
      setSelectedCategories([]);
      return;
    }

    setSelectedCategories((current) => {
      const next = current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category];

      return guildCategories.filter((item) => next.includes(item));
    });
  };

  const filteredWorks = useMemo(
    () =>
      allActive
        ? works
        : works.filter((work) => selectedCategories.includes(work.category)),
    [allActive, selectedCategories],
  );
  const visibleCreatorCount = useMemo(
    () => new Set(filteredWorks.map((work) => work.creatorSlug)).size,
    [filteredWorks],
  );
  const commissionReadyCount = useMemo(
    () => filteredWorks.filter((work) => work.commissionReady).length,
    [filteredWorks],
  );

  return (
    <main className={styles.page}>
      <div className={styles.backdrop} aria-hidden="true" />

      <section className={styles.shell}>
        <section className={styles.boardIntro}>
          <div className={styles.introCopy}>
            <p className={styles.eyebrow}>Handmade discovery</p>
            <h1>Discover the work first. Meet the maker behind it next.</h1>
            <p>
              Guild brings crochet, knitting, sewing, embroidery, tie-dye,
              beadwork, and handmade accessories into one calm, inspiration-led
              feed built for trust, custom work, and beautiful browsing.
            </p>

            <div className={styles.introPills}>
              <span>Inspiration-first</span>
              <span>Commission-aware</span>
              <span>Creator trust built in</span>
            </div>
          </div>

          <div className={styles.introSide}>
            <div className={styles.introStats}>
              <div>
                <span>Pins</span>
                <strong>{filteredWorks.length}</strong>
              </div>
              <div>
                <span>Creators</span>
                <strong>{visibleCreatorCount}</strong>
              </div>
              <div>
                <span>Ready for commission</span>
                <strong>{commissionReadyCount}</strong>
              </div>
            </div>

            <p className={styles.introNote}>
              Browse the box, open a piece, and follow the work into the creator
              profile when you want something made for you.
            </p>
          </div>
        </section>

        <section className={styles.filterBar}>
          {categoryFilters.map((category) => {
            const active =
              category === "All"
                ? allActive
                : selectedCategories.includes(category);

            return (
              <button
                key={category}
                type="button"
                className={`${styles.filterChip} ${
                  active ? styles.filterChipActive : ""
                }`}
                onClick={() => toggleCategory(category)}
              >
                {category}
              </button>
            );
          })}

          <p className={styles.filterStatus}>
            Showing side by side:{" "}
            <strong>
              {allActive ? "all v1 art categories" : selectedCategories.join(" / ")}
            </strong>
          </p>
        </section>

        <section className={styles.feedBoard}>
          {filteredWorks.map((work, index) => {
            const creator = creators.find((item) => item.slug === work.creatorSlug);

            return (
              <article key={work.slug} className={styles.card}>
                <Link
                  href={`/work/${work.slug}`}
                  className={styles.imageCard}
                  style={
                    {
                      "--tone-a": work.palette[0],
                      "--tone-b": work.palette[1],
                      "--tone-c": work.palette[2],
                      "--image-height": imageHeights[index % imageHeights.length],
                    } as CSSProperties
                  }
                >
                  <div className={styles.imageOverlay}>
                    <span className={styles.imageBadge}>{work.format}</span>
                    {work.commissionReady ? (
                      <span className={styles.readyBadge}>Commission Ready</span>
                    ) : null}
                  </div>

                  <div className={styles.imageText}>
                    <strong>{work.imageLabel}</strong>
                  </div>
                </Link>

                <div className={styles.cardBody}>
                  <h2>
                    <Link href={`/work/${work.slug}`}>{work.title}</Link>
                  </h2>

                  {creator ? (
                    <div className={styles.creatorRow}>
                      <div className={styles.creatorBlock}>
                        <p className={styles.creatorLabel}>{work.category}</p>
                        <Link href={`/creators/${creator.slug}`}>{creator.name}</Link>
                      </div>
                      <span className={styles.creatorTrust}>
                        {creator.verified ? "Verified" : "In Review"}
                      </span>
                    </div>
                  ) : null}

                  <div className={styles.metaRow}>
                    <span>{work.priceRange}</span>
                    <span>{work.leadTime}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </section>
    </main>
  );
}
