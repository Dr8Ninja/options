import styles from "./page.module.css";
export default function Home() {
  return (
    <div className={styles.home}>
      <section aria-labelledby="welcome-title">
        <p className={styles.eyebrow}>Options / Learning foundations</p>
        <h1 id="welcome-title">
          Understand the contract.
          <br />
          Then explore the possibilities.
        </h1>
        <p className={styles.lead}>
          A field guide to options, built around clear explanations, careful
          practice and evidence of learning.
        </p>
        <p className={styles.note}>
          The course is in preparation. Reviewed lessons and learner accounts
          are not available yet.
        </p>
      </section>
      <aside className={styles.preparation} aria-labelledby="preparation-title">
        <span className={styles.label}>In preparation</span>
        <h2 id="preparation-title">Start with the foundations</h2>
        <p>
          Rights and obligations. Cash flows and risk. A careful sequence before
          more complex ideas.
        </p>
        <div className={styles.divider} />
        <p>
          Learning material will appear here after its content and review checks
          are complete.
        </p>
      </aside>
    </div>
  );
}
