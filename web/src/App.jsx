import Layout          from './components/Layout/Layout';
import PlantMascot     from './components/PlantMascot/PlantMascot';
import PlantName       from './components/PlantName/PlantName';
import StatusBadge     from './components/StatusBadge/StatusBadge';
import SensorCard      from './components/SensorCard/SensorCard';
import ConnectionBanner from './components/ConnectionBanner/ConnectionBanner';
import { useSensorData } from './hooks/useSensorData';
import { usePlantName }  from './hooks/usePlantName';
import styles from './App.module.css';

import thermometerIcon from './assets/images/termometer+.png';
import soilIcon        from './assets/images/tint.png';
import windIcon        from './assets/images/wind.png';
import energyIcon      from './assets/images/energy.png';

const ALL_GOOD = {
  key: 'ok',
  text: 'Tudo certo!',
  color: 'var(--color-green)',
  textColor: 'var(--color-dark-green)',
};

export default function App() {
  const { sensorData, warnings, healthLevel, status, percents } = useSensorData();
  const { name, setName, isEditing, toggleEdit } = usePlantName();

  const displayWarnings = warnings.length > 0 ? warnings : [ALL_GOOD];

  return (
    <Layout
      hero={
        <ConnectionBanner status={status} />
      }
      mascot={
        <>
          <PlantMascot healthLevel={healthLevel} />
          <PlantName
            name={name}
            isEditing={isEditing}
            onToggleEdit={toggleEdit}
            onNameChange={setName}
          />
        </>
      }
    >
      {/* Status badges */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <span className={styles.sectionLabel}>Status</span>
          <div className={styles.sectionBar} />
        </div>
        <div className={styles.badgeRow}>
          {displayWarnings.map((w) => (
            <StatusBadge key={w.key} text={w.text} color={w.color} textColor={w.textColor} />
          ))}
        </div>
      </div>

      {/* Sensor grid */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <span className={styles.sectionLabel}>Sensores</span>
          <div className={styles.sectionBar} />
        </div>
        <div className={styles.grid}>
          <SensorCard
            icon={thermometerIcon}
            label="Temperatura"
            value={sensorData?.temperatura}
            percent={percents.temp}
            unit="°C"
            fillColor="var(--color-red)"
            iconBg="rgba(249, 111, 111, 0.12)"
            delay={0}
          />
          <SensorCard
            icon={soilIcon}
            label="Umidade do solo"
            value={sensorData?.umidade_solo}
            percent={percents.soil}
            unit="%"
            fillColor="var(--color-greenblue)"
            iconBg="rgba(163, 244, 255, 0.2)"
            delay={80}
          />
          <SensorCard
            icon={windIcon}
            label="Umidade do ar"
            value={sensorData?.umidade_ar}
            percent={percents.air}
            unit="%"
            fillColor="var(--color-blue)"
            iconBg="rgba(149, 211, 255, 0.2)"
            delay={160}
          />
          <SensorCard
            icon={energyIcon}
            label="Bateria"
            value={sensorData?.nivel_bateria}
            percent={percents.battery}
            unit="%"
            fillColor="var(--color-green)"
            iconBg="rgba(137, 229, 94, 0.15)"
            delay={240}
          />
        </div>
      </div>
    </Layout>
  );
}
