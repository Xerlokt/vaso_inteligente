import styles from './SensorCard.module.css';

export default function SensorCard({ icon, label, value, percent, unit, fillColor, iconBg, delay = 0 }) {
  const displayValue = value != null ? Math.round(value) : '—';

  return (
    <div
      className={styles.card}
      style={{ animationDelay: `${delay}ms`, '--icon-bg': iconBg, '--fill-color': fillColor }}
    >
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <img className={styles.icon} src={icon} alt={label} />
        </div>
        <span className={styles.label}>{label}</span>
      </div>

      <div className={styles.valueRow}>
        <span className={styles.value}>{displayValue}</span>
        <span className={styles.unit}>{unit}</span>
      </div>

      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
