import styles from './StatusBadge.module.css';

export default function StatusBadge({ text, color, textColor }) {
  return (
    <span
      className={styles.badge}
      style={{ backgroundColor: color, color: textColor }}
    >
      <span className={styles.dot} />
      {text}
    </span>
  );
}
