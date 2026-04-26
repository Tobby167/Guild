"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { guildCategories, type GuildCategory } from "@/lib/guild-data";
import { getCurrentSession } from "@/lib/guild-demo-state";
import { deleteWorkPost, fetchWorkPosts, type GuildWorkPost } from "@/lib/supabase/works";
import styles from "./page.module.css";

type FeedFilter = "All" | GuildCategory;
type FeedCardStyle = CSSProperties & {
  "--tone-a": string;
  "--tone-b": string;
  "--tone-c": string;
  "--image-height": string;
};

const feedPalette: [string, string, string] = ["#1f1711", "#8d6c4f", "#f3e7d6"];

export default function FeedPage() {
  const [selectedCategories, setSelectedCategories] = useState<GuildCategory[]>([]);
  const [workPosts, setWorkPosts] = useState<GuildWorkPost[]>([]);
  const [message, setMessage] = useState("");
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

  useEffect(() => {
    let active = true;

    void fetchWorkPosts()
      .then((data) => {
        if (active) {
          setWorkPosts(data);
        }
      })
      .catch(() => {
        if (active) {
          setMessage(
            "Guild still needs the work_posts table SQL run in Supabase before the feed can load shared posts.",
          );
        }
      });

    return () => {
      active = false;
    };
  }, []);

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
        ? workPosts
        : workPosts.filter((work) => selectedCategories.includes(work.category)),
    [allActive, workPosts, selectedCategories],
  );

  const visibleCreatorCount = useMemo(
    () => new Set(filteredWorks.map((work) => work.creator_id)).size,
    [filteredWorks],
  );

  const commissionReadyCount = useMemo(
    () => filteredWorks.filter((work) => work.commission_ready).length,
    [filteredWorks],
  );

  const buildCardStyle = (work: GuildWorkPost, imageHeight: string): FeedCardStyle => {
    if (work.image_data_url) {
      return {
        "--tone-a": feedPalette[0],
        "--tone-b": feedPalette[1],
        "--tone-c": feedPalette[2],
        "--image-height": imageHeight,
        backgroundImage: `linear-gradient(rgba(19, 14, 10, 0.28), rgba(19, 14, 10, 0.18)), url(${work.image_data_url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }

    return {
      "--tone-a": feedPalette[0],
      "--tone-b": feedPalette[1],
      "--tone-c": feedPalette[2],
      "--image-height": imageHeight,
    };
  };

  const hasAnyPosts = workPosts.length > 0;
  const hasFilteredPosts = filteredWorks.length > 0;

  return (
    <main className={styles.page}>
      <div className={styles.backdrop} aria-hidden="true" />

      <section className={styles.shell}>
        <section className={styles.boardIntro}>
          <div className={styles.introCopy}>
            <p className={styles.eyebrow}>Handmade discovery</p>
            <h1>See what Guild creators have actually posted.</h1>
            <p>
              The feed now runs from shared Guild posts. As creators add their
              work, this board becomes the place where buyers discover pieces,
              trust makers, and move into commission requests.
            </p>

            <div className={styles.introPills}>
              <span>Creator-posted work only</span>
              <span>Commission-aware</span>
              <span>Shared across devices</span>
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
              Upload from Studio to push work into the shared feed. Buyers can
              then move from the board into a structured request instead of
              scattered DMs.
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
            Showing:{" "}
            <strong>
              {allActive ? "all posted categories" : selectedCategories.join(" / ")}
            </strong>
          </p>
        </section>

        {message ? <p className={styles.summary}>{message}</p> : null}

        {!hasAnyPosts ? (
          <section className={styles.emptyBoard}>
            <p className={styles.cardLabel}>Nothing posted yet</p>
            <h2>Guild needs its first real pieces.</h2>
            <p>
              Once creators upload work into Studio, those pieces will appear
              here for buyers to discover across devices.
            </p>
            <div className={styles.emptyActions}>
              <Link href="/studio/new" className={styles.emptyPrimary}>
                Upload a piece
              </Link>
              <Link href="/join" className={styles.emptySecondary}>
                Create a creator account
              </Link>
            </div>
          </section>
        ) : !hasFilteredPosts ? (
          <section className={styles.emptyBoard}>
            <p className={styles.cardLabel}>No matches yet</p>
            <h2>Nothing in this category set right now.</h2>
            <p>
              Try another mix of categories or reset the board to see everything
              that has been posted so far.
            </p>
            <div className={styles.emptyActions}>
              <button
                type="button"
                className={styles.emptyPrimary}
                onClick={() => setSelectedCategories([])}
              >
                Show all posts
              </button>
            </div>
          </section>
        ) : (
          <section className={styles.feedBoard}>
            {filteredWorks.map((work, index) => {
              const ownWork = session?.profileId === work.creator_id;
              const targetHref = ownWork ? "/studio" : `/request?creator=${work.creator_slug}`;

              return (
                <article key={work.id} className={styles.card}>
                  <Link
                    href={targetHref}
                    className={styles.imageCard}
                    style={buildCardStyle(work, imageHeights[index % imageHeights.length])}
                  >
                    <div className={styles.imageOverlay}>
                      <span className={styles.imageBadge}>{work.format}</span>
                      {work.commission_ready ? (
                        <span className={styles.readyBadge}>Commission Ready</span>
                      ) : null}
                    </div>

                    <div className={styles.imageText}>
                      <strong>{work.image_label}</strong>
                    </div>
                  </Link>

                  <div className={styles.cardBody}>
                    <h2>
                      <Link href={targetHref}>{work.title}</Link>
                    </h2>

                    <div className={styles.creatorRow}>
                      <div className={styles.creatorBlock}>
                        <p className={styles.creatorLabel}>{work.category}</p>
                        <Link href={targetHref}>{work.creator_name}</Link>
                      </div>
                      <span className={styles.creatorTrust}>
                        {work.creator_verified ? "Verified" : "In Review"}
                      </span>
                    </div>

                    <div className={styles.metaRow}>
                      <span>{work.price_range}</span>
                      <span>{work.lead_time}</span>
                    </div>

                    {ownWork ? (
                      <div className={styles.localActionRow}>
                        <button
                          type="button"
                          className={styles.deleteButton}
                          onClick={async () => {
                            if (!window.confirm(`Delete "${work.title}" from the feed?`)) {
                              return;
                            }

                            try {
                              await deleteWorkPost(work.id);
                              const next = await fetchWorkPosts();
                              setWorkPosts(next);
                            } catch {
                              setMessage("Guild could not delete that post yet.");
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
        )}
      </section>
    </main>
  );
}
