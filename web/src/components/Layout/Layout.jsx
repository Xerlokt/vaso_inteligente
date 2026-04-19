import styles from './Layout.module.css';

export default function Layout({ hero, mascot, children }) {
  return (
    <div className={styles.page}>
      {/* Background atmosphere */}
      <div className={styles.leafTexture} />
      <div className={styles.bgOrbs}>
        <div className={`${styles.orb} ${styles.orb1}`} />
        <div className={`${styles.orb} ${styles.orb2}`} />
        <div className={`${styles.orb} ${styles.orb3}`} />
      </div>

      {/* Hero header */}
      <div className={styles.hero}>
        <div className={styles.heroTop}>
          <span className={styles.logoTag}>Botanix — Vaso Inteligente</span>
          {hero}
        </div>
      </div>

      {/* White content card */}
      <div className={styles.card}>
        <div className={styles.mascotSlot}>{mascot}</div>
        {children}
      </div>
    </div>
  );
}
