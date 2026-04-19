import styles from './PlantMascot.module.css';

const healthClass = {
  100: styles.health100,
  60:  styles.health60,
  30:  styles.health30,
  0:   styles.health0,
};

/* SVG plant — 4 leaf variants driven by healthLevel */
function PlantSvg({ health }) {
  const stemColor    = health >= 60 ? '#277005' : health >= 30 ? '#5A7A2A' : '#8B6914';
  const leafColor    = health >= 60 ? '#89E55E' : health >= 30 ? '#A8C855' : '#C4A84A';
  const leafDark     = health >= 60 ? '#4CAF1C' : health >= 30 ? '#7A9E1A' : '#9E7A14';
  const flowerColor  = health === 100 ? '#C172FF' : 'transparent';

  return (
    <svg viewBox="0 0 80 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Stem */}
      <path d="M40 95 Q38 70 40 50 Q42 30 40 15" stroke={stemColor} strokeWidth="3.5" strokeLinecap="round"/>

      {/* Left leaf */}
      <path d="M40 65 Q22 55 18 38 Q28 42 40 55" fill={leafColor}/>
      <path d="M40 65 Q29 55 25 42" stroke={leafDark} strokeWidth="1" strokeLinecap="round"/>

      {/* Right leaf */}
      <path d="M40 50 Q58 40 62 23 Q52 27 40 40" fill={leafColor}/>
      <path d="M40 50 Q51 40 55 27" stroke={leafDark} strokeWidth="1" strokeLinecap="round"/>

      {/* Second left leaf (only healthy) */}
      {health >= 60 && (
        <path d="M40 38 Q25 28 22 14 Q32 18 40 30" fill={leafColor} opacity="0.8"/>
      )}

      {/* Flower (only 100%) */}
      {health === 100 && (
        <g transform="translate(40, 13)">
          <circle cx="0" cy="0" r="5" fill={flowerColor}/>
          <circle cx="0" cy="-9" r="4" fill="#FFDF6D" opacity="0.9"/>
          <circle cx="9" cy="0" r="4" fill="#FFDF6D" opacity="0.9"/>
          <circle cx="0" cy="9" r="4" fill="#FFDF6D" opacity="0.9"/>
          <circle cx="-9" cy="0" r="4" fill="#FFDF6D" opacity="0.9"/>
          <circle cx="0" cy="0" r="5" fill={flowerColor}/>
        </g>
      )}

      {/* Drooping top for wilted state */}
      {health === 0 && (
        <path d="M40 15 Q44 10 42 5" stroke={stemColor} strokeWidth="2.5" strokeLinecap="round"/>
      )}
    </svg>
  );
}

export default function PlantMascot({ healthLevel }) {
  const cls = healthClass[healthLevel] ?? styles.health100;

  return (
    <div className={`${styles.wrapper} ${cls}`}>
      <div className={styles.ring} />
      <div className={styles.soil}>
        <div className={styles.soilDots}>
          <div className={styles.dot}/>
          <div className={styles.dot}/>
          <div className={styles.dot}/>
        </div>
      </div>
      <div className={styles.svg}>
        <PlantSvg health={healthLevel} />
      </div>
    </div>
  );
}
