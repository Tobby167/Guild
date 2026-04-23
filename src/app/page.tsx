"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./page.module.css";

type ChamberKey = "studio" | "trade";

const chambers: Record<
  ChamberKey,
  {
    label: string;
    title: string;
    description: string;
    highlights: string[];
    note: string;
  }
> = {
  studio: {
    label: "Studio",
    title: "Shape your craft with a portfolio that feels alive.",
    description:
      "Give every piece context: works in progress, material notes, process stories, and the kind of detail that helps buyers understand the maker behind the work.",
    highlights: [
      "Portfolio-first creator pages",
      "Works-in-progress and material-aware posts",
      "A calmer creative identity than a noisy social feed",
    ],
    note: "Built for makers who want to be taken seriously before they are asked to lower their price.",
  },
  trade: {
    label: "Trade",
    title: "Turn admiration into trusted commission requests.",
    description:
      "Guide buyers through a clearer path: what they want made, when they need it, what they can spend, and how they can trust the creator they are hiring.",
    highlights: [
      "Structured commission requests with references and timelines",
      "Verification, reviews, and visible trust signals",
      "Quotes centered on quality, clarity, and turnaround",
    ],
    note: "Built for buyers who want custom work without the usual chaos of scattered DMs and unclear expectations.",
  },
};

const pillars = [
  {
    title: "Show Work Better",
    description:
      "Creators get a polished home for finished pieces, works in progress, and the story behind each craft.",
  },
  {
    title: "Win Better Jobs",
    description:
      "Buyers can submit thoughtful commission requests instead of vague messages that go nowhere.",
  },
  {
    title: "Keep Context Attached",
    description:
      "Material notes, timelines, and process details stay close to the work instead of getting lost in chat threads.",
  },
];

const roadmap = [
  {
    phase: "Now",
    title: "Launch the premium foundation",
    description:
      "Profiles, portfolio posts, discovery, commission requests, reviews, and manual verification for a focused textile beta.",
  },
  {
    phase: "Next",
    title: "Strengthen trust and workflow",
    description:
      "Structured quotes, job tracking, dispute handling, and better collaboration between creators and creative buyers.",
  },
  {
    phase: "Later",
    title: "Add intelligent creator tools",
    description:
      "Material recommendations, listing assistance, and fiber-specific helpers once real usage patterns are clear.",
  },
];

const launchPrinciples = [
  "Start with fiber and textile creators, not every creative category at once.",
  "Prioritize trusted quality over low-price competition.",
  "Keep Studio and Trade as one connected experience rather than two oversized apps.",
  "Launch with manual trust systems before promising advanced AI moderation.",
];

export default function Home() {
  const [activeChamber, setActiveChamber] = useState<ChamberKey>("studio");
  const chamber = chambers[activeChamber];

  return (
    <main id="top" className={`${styles.page} ${styles[activeChamber]}`}>
      <div className={styles.backdrop} aria-hidden="true" />

      <section className={styles.heroShell}>
        <header className={styles.topbar}>
          <div className={styles.brandLockup}>
            <span className={styles.brandMark}>GU</span>
            <div>
              <p className={styles.brandName}>Guild</p>
              <p className={styles.brandTag}>For fiber and textile creators</p>
            </div>
          </div>

          <nav className={styles.jumpLinks} aria-label="Section navigation">
            <a href="#vision">Vision</a>
            <a href="#launch-scope">Launch Scope</a>
            <a href="#roadmap">Roadmap</a>
          </nav>
        </header>

        <div className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Craft your vision. Protect your trade.</p>
            <h1>A more trusted home for custom handmade work.</h1>
            <p className={styles.lead}>
              Guild brings portfolio storytelling, commission requests,
              verification, and material context into one elegant experience for
              textile creators and the buyers who want to hire them well.
            </p>

            <div className={styles.heroActions}>
              <a className={styles.primaryCta} href="#vision">
                Explore the creator side
              </a>
              <a className={styles.secondaryCta} href="#roadmap">
                See the launch path
              </a>
              <Link className={styles.tertiaryCta} href="/admin">
                Open admin preview
              </Link>
            </div>

            <div className={styles.statRow}>
              <article>
                <strong>01</strong>
                <span>Commission-ready creator profiles</span>
              </article>
              <article>
                <strong>02</strong>
                <span>Manual trust and verification from day one</span>
              </article>
              <article>
                <strong>03</strong>
                <span>Material-aware workflow support without feature bloat</span>
              </article>
            </div>
          </div>

          <aside className={styles.heroPanel}>
            <div className={styles.toggleWrap}>
              <p className={styles.toggleLabel}>Guild Chambers</p>
              <div className={styles.toggle} role="tablist" aria-label="Guild chambers">
                {(["studio", "trade"] as ChamberKey[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={activeChamber === key}
                    className={
                      activeChamber === key ? styles.toggleActive : styles.toggleButton
                    }
                    onClick={() => setActiveChamber(key)}
                  >
                    {chambers[key].label}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.panelCard}>
              <p className={styles.panelKicker}>{chamber.label} Chamber</p>
              <h2>{chamber.title}</h2>
              <p>{chamber.description}</p>
              <ul className={styles.panelList}>
                {chamber.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className={styles.panelNote}>{chamber.note}</div>
            </div>
          </aside>
        </div>
      </section>

      <section className={styles.section} id="vision">
        <div className={styles.sectionHeading}>
          <p className={styles.sectionEyebrow}>Why this product exists</p>
          <h2>Creators should not need five different apps to complete one job.</h2>
        </div>

        <div className={styles.pillarGrid}>
          {pillars.map((pillar) => (
            <article key={pillar.title} className={styles.pillarCard}>
              <h3>{pillar.title}</h3>
              <p>{pillar.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} id="launch-scope">
        <div className={styles.scopeCard}>
          <div className={styles.scopeIntro}>
            <p className={styles.sectionEyebrow}>Launch scope</p>
            <h2>Version one stays focused.</h2>
            <p>
              The first release is not trying to replace every creative tool. It
              is starting as a trusted commission and discovery platform for
              crochet, knitting, sewing, embroidery, and related textile craft.
            </p>
          </div>

          <div className={styles.principles}>
            {launchPrinciples.map((principle) => (
              <article key={principle} className={styles.principle}>
                <span className={styles.principleDot} aria-hidden="true" />
                <p>{principle}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} id="roadmap">
        <div className={styles.sectionHeading}>
          <p className={styles.sectionEyebrow}>Roadmap</p>
          <h2>Build the trust layer first, then grow into smarter tooling.</h2>
        </div>

        <div className={styles.roadmapGrid}>
          {roadmap.map((item) => (
            <article key={item.phase} className={styles.roadmapCard}>
              <p className={styles.roadmapPhase}>{item.phase}</p>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.footerCallout}>
        <div>
          <p className={styles.sectionEyebrow}>Founding direction</p>
          <h2>Built to help makers look more professional, not more disposable.</h2>
        </div>
        <a className={styles.primaryCta} href="#top">
          Back to top
        </a>
      </section>
    </main>
  );
}
