import Link from "next/link";
import styles from "./page.module.css";

const stats = [
  { label: "Pending Verification", value: "14", note: "5 need review today" },
  { label: "Open Reports", value: "07", note: "2 marked high priority" },
  { label: "Active Creators", value: "128", note: "23 newly onboarded" },
  { label: "Commission Requests", value: "41", note: "12 waiting for quote" },
];

const verificationQueue = [
  {
    name: "Ada Stitch Studio",
    category: "Embroidery",
    evidence: "Process photos, Instagram link, two client screenshots",
    status: "Needs review",
  },
  {
    name: "Mira Bead House",
    category: "Handmade Accessories",
    evidence: "Work-in-progress video and product gallery",
    status: "Ready to approve",
  },
  {
    name: "Kemi Crochet Works",
    category: "Crochet",
    evidence: "Three finished pieces and yarn process shots",
    status: "Waiting on identity proof",
  },
];

const reports = [
  {
    type: "Copied work claim",
    target: "Gold Loop Handbag post",
    priority: "High",
    status: "Review evidence",
  },
  {
    type: "Spam inquiry",
    target: "Buyer account: customflash_22",
    priority: "Medium",
    status: "Warn or suspend",
  },
  {
    type: "Late delivery complaint",
    target: "Commission #CM-204",
    priority: "Low",
    status: "Awaiting creator response",
  },
];

const recentUsers = [
  {
    name: "Nora Loom",
    role: "Creator",
    status: "Profile complete",
    note: "Posted 4 works in first day",
  },
  {
    name: "David O.",
    role: "Buyer",
    status: "Browsing only",
    note: "Saved 9 posts, no request yet",
  },
  {
    name: "Simi Threads",
    role: "Creator",
    status: "Verification pending",
    note: "Needs turnaround time added",
  },
];

const categories = [
  "Crochet",
  "Knitting",
  "Sewing",
  "Embroidery",
  "Beadwork",
  "Handmade Accessories",
  "Tie-Dye",
];

const notes = [
  "Keep verification manual in v1 until the trust rules are stable.",
  "Do not let copied-work reports auto-ban creators without review.",
  "Track which categories receive the most commission requests before expanding v1.",
];

export default function AdminPage() {
  return (
    <main className={styles.page}>
      <div className={styles.backdrop} aria-hidden="true" />

      <section className={styles.shell}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Guild Internal Dashboard</p>
            <h1>Admin control for trust, safety, and platform flow.</h1>
            <p className={styles.lead}>
              This is the founder-facing control room for Guild. In the real
              product, this area should be protected by admin authentication and
              role-based access.
            </p>
          </div>

          <div className={styles.headerActions}>
            <span className={styles.badge}>Current Admin: You</span>
            <Link className={styles.linkButton} href="/">
              Back to Guild
            </Link>
          </div>
        </header>

        <section className={styles.statsGrid}>
          {stats.map((stat) => (
            <article key={stat.label} className={styles.statCard}>
              <p className={styles.cardLabel}>{stat.label}</p>
              <strong>{stat.value}</strong>
              <span>{stat.note}</span>
            </article>
          ))}
        </section>

        <section className={styles.mainGrid}>
          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.cardLabel}>Verification Queue</p>
                <h2>Approve creators with enough proof.</h2>
              </div>
              <span className={styles.panelMeta}>Manual-first review</span>
            </div>

            <div className={styles.list}>
              {verificationQueue.map((item) => (
                <div key={item.name} className={styles.listCard}>
                  <div className={styles.listTop}>
                    <h3>{item.name}</h3>
                    <span className={styles.statusChip}>{item.status}</span>
                  </div>
                  <p className={styles.detailRow}>
                    <strong>Category:</strong> {item.category}
                  </p>
                  <p className={styles.detailRow}>
                    <strong>Evidence:</strong> {item.evidence}
                  </p>
                  <div className={styles.actionRow}>
                    <button type="button">Approve</button>
                    <button type="button" className={styles.secondaryAction}>
                      Request more proof
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.cardLabel}>Reports</p>
                <h2>Review copied-work and trust issues fast.</h2>
              </div>
              <span className={styles.panelMeta}>Priority sorted</span>
            </div>

            <div className={styles.list}>
              {reports.map((report) => (
                <div key={report.target} className={styles.listCard}>
                  <div className={styles.listTop}>
                    <h3>{report.type}</h3>
                    <span
                      className={`${styles.priorityChip} ${
                        report.priority === "High"
                          ? styles.high
                          : report.priority === "Medium"
                            ? styles.medium
                            : styles.low
                      }`}
                    >
                      {report.priority}
                    </span>
                  </div>
                  <p className={styles.detailRow}>
                    <strong>Target:</strong> {report.target}
                  </p>
                  <p className={styles.detailRow}>
                    <strong>Status:</strong> {report.status}
                  </p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className={styles.lowerGrid}>
          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.cardLabel}>Recent Users</p>
                <h2>Watch onboarding quality.</h2>
              </div>
            </div>

            <div className={styles.list}>
              {recentUsers.map((user) => (
                <div key={user.name} className={styles.simpleCard}>
                  <div className={styles.listTop}>
                    <h3>{user.name}</h3>
                    <span className={styles.userRole}>{user.role}</span>
                  </div>
                  <p className={styles.detailRow}>
                    <strong>Status:</strong> {user.status}
                  </p>
                  <p className={styles.detailRow}>{user.note}</p>
                </div>
              ))}
            </div>
          </article>

          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.cardLabel}>Categories</p>
                <h2>Current v1 craft scope.</h2>
              </div>
            </div>

            <div className={styles.categoryWrap}>
              {categories.map((category) => (
                <span key={category} className={styles.categoryChip}>
                  {category}
                </span>
              ))}
            </div>

            <div className={styles.categoryAction}>
              <button type="button">Add category later</button>
            </div>
          </article>

          <article className={`${styles.panel} ${styles.notesPanel}`}>
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.cardLabel}>Trust Notes</p>
                <h2>What the admin should protect first.</h2>
              </div>
            </div>

            <ul className={styles.noteList}>
              {notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </article>
        </section>
      </section>
    </main>
  );
}
