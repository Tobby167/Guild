"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  creators,
  guildCategories,
  type GuildCategory,
  works,
} from "@/lib/guild-data";
import {
  deleteDemoWork,
  getCurrentSession,
  getDemoProfiles,
  getDemoWorks,
  subscribeToDemoWorks,
  type GuildDemoWork,
} from "@/lib/guild-demo-state";
import styles from "./page.module.css";

type FeedFilter = "All" | GuildCategory;
type FeedCardStyle = CSSProperties & {
  "--tone-a": string;
  "--tone-b": string;
  "--tone-c": string;
  "--image-height": string;
};
type FeedItem =
  | {
      source: "seed";
      key: string;
      href: string;
      creatorSlug: string;
      creatorHref: string;
      creatorName: string;
      creatorTrust: string;
      category: GuildCategory;
      format: string;
      commissionReady: boolean;
      title: string;
      priceRange: string;
      leadTime: string;
      imageLabel: string;
      palette: [string, string, string];
      id?: undefined;
      imageDataUrl?: undefined;
    }
  | {
      source: "local";
      id: string;
      key: string;
      href: string;
      creatorSlug: string;
      creatorHref: string;
      creatorName: string;
      creatorTrust: string;
      category: GuildCategory;
      format: string;
      commissionReady: boolean;
      title: string;
      priceRange: string;
      leadTime: string;
      imageLabel: string;
      palette: [string, string, string];
      imageDataUrl?: string;
    };

export default function FeedPage() {
  const [selectedCategories, setSelectedCategories] = useState<GuildCategory[]>([]);
  const [localWorks, setLocalWorks] = useState<GuildDemoWork[]>(() => getDemoWorks());
  const session = getCurrentSession();
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

  useEffect(() => subscribeToDemoWorks(() => setLocalWorks(getDemoWorks())), []);

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

  const feedItems = useMemo<FeedItem[]>(() => {
    const localProfiles = getDemoProfiles();
    const localFeedItems: FeedItem[] = localWorks.map((work) => {
      const profile = localProfiles.find((item) => item.slug === work.creatorSlug);

      return {
        source: "local",
        id: work.id,
        key: `local-${work.id}`,
        href: "/studio",
        creatorSlug: work.creatorSlug,
        creatorHref: "/studio",
        creatorName: profile?.name ?? work.creatorName,
        creatorTrust: profile?.verified ? "Verified" : "In Review",
        category: work.category,
        format: work.format,
        commissionReady: work.commissionReady,
        title: work.title,
        priceRange: work.priceRange,
        leadTime: work.leadTime,
        imageLabel: work.imageLabel,
        palette: ["#1f1711", "#8d6c4f", "#f3e7d6"],
        imageDataUrl: work.imageDataUrl,
      };
    });

    const seedFeedItems: FeedItem[] = works.map((work) => {
      const creator = creators.find((item) => item.slug === work.creatorSlug);

      return {
        source: "seed",
        key: `seed-${work.slug}`,
        href: `/work/${work.slug}`,
        creatorSlug: work.creatorSlug,
        creatorHref: creator ? `/creators/${creator.slug}` : "/feed",
        creatorName: creator?.name ?? "Guild Creator",
        creatorTrust: creator?.verified ? "Verified" : "In Review",
        category: work.category,
        format: work.format,
        commissionReady: work.commissionReady,
        title: work.title,
        priceRange: work.priceRange,
        leadTime: work.leadTime,
        imageLabel: work.imageLabel,
        palette: work.palette,
        id: undefined,
      };
    });

    return [...localFeedItems, ...seedFeedItems];
  }, [localWorks]);

  const filteredWorks = useMemo(
    () =>
      allActive
        ? feedItems
        : feedItems.filter((work) => selectedCategories.includes(work.category)),
    [allActive, feedItems, selectedCategories],
  );
  const visibleCreatorCount = useMemo(
    () => new Set(filteredWorks.map((work) => work.creatorSlug)).size,
    [filteredWorks],
  );
  const commissionReadyCount = useMemo(
    () => filteredWorks.filter((work) => work.commissionReady).length,
    [filteredWorks],
  );
  const buildCardStyle = (work: FeedItem, imageHeight: string): FeedCardStyle => {
    if (work.imageDataUrl) {
      return {
        "--tone-a": work.palette[0],
        "--tone-b": work.palette[1],
        "--tone-c": work.palette[2],
        "--image-height": imageHeight,
        backgroundImage: `linear-gradient(rgba(19, 14, 10, 0.28), rgba(19, 14, 10, 0.18)), url(${work.imageDataUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }

    return {
      "--tone-a": work.palette[0],
      "--tone-b": work.palette[1],
      "--tone-c": work.palette[2],
      "--image-height": imageHeight,
    };
  };
  const canDeleteWork = (work: FeedItem) =>
    work.source === "local" && session?.creatorSlug === work.creatorSlug;

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
              profile when you want something made for you. Your local studio
              uploads will also appear here first.
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
            const localWork = work.source === "local" ? work : null;

            return (
              <article key={work.key} className={styles.card}>
                <Link
                  href={work.href}
                  className={styles.imageCard}
                  style={buildCardStyle(
                    work,
                    imageHeights[index % imageHeights.length],
                  )}
                >
                  <div className={styles.imageOverlay}>
                    <span className={styles.imageBadge}>{work.format}</span>
                    {work.source === "local" ? (
                      <span className={styles.localBadge}>Studio Upload</span>
                    ) : null}
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
                    <Link href={work.href}>{work.title}</Link>
                  </h2>

                  <div className={styles.creatorRow}>
                    <div className={styles.creatorBlock}>
                      <p className={styles.creatorLabel}>{work.category}</p>
                      <Link href={work.creatorHref}>{work.creatorName}</Link>
                    </div>
                    <span className={styles.creatorTrust}>{work.creatorTrust}</span>
                  </div>

                  <div className={styles.metaRow}>
                    <span>{work.priceRange}</span>
                    <span>{work.leadTime}</span>
                  </div>

                  {localWork && canDeleteWork(localWork) ? (
                    <div className={styles.localActionRow}>
                      <button
                        type="button"
                        className={styles.deleteButton}
                        onClick={() => {
                          if (window.confirm(`Delete "${localWork.title}" from your feed?`)) {
                            deleteDemoWork(localWork.id);
                          }
                        }}
                      >
                        Delete post
                      </button>
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </section>
      </section>
    </main>
  );
}
