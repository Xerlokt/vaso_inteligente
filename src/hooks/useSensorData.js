import { useState, useEffect } from 'react';
import { useMqtt } from './useMqtt';
import { computeWarnings, computeHealthLevel, toPercent } from '../utils/healthUtils';
import { TEMP_MAX } from '../constants/thresholds';

const VIDEO_MAP = {
  100: require('../assets/videos/100-seed.mp4'),
  60:  require('../assets/videos/60-seed.mp4'),
  30:  require('../assets/videos/30-seed.mp4'),
  0:   require('../assets/videos/0-seed.mp4'),
};

export function useSensorData() {
  const { lastMessage, status } = useMqtt();

  const [sensorData, setSensorData]   = useState(null);
  const [warnings, setWarnings]       = useState([]);
  const [healthLevel, setHealthLevel] = useState(100);
  const [percents, setPercents]       = useState({ temp: '0%', soil: '0%', air: '0%', battery: '0%' });

  useEffect(() => {
    if (!lastMessage) return;
    try {
      const data = JSON.parse(lastMessage);
      const newWarnings = computeWarnings(data);
      const newHealth   = computeHealthLevel(newWarnings);

      setSensorData(data);
      setWarnings(newWarnings);
      setHealthLevel(newHealth);
      setPercents({
        temp:    toPercent(data.temperatura ?? 0, TEMP_MAX),
        soil:    `${Math.min(100, Math.max(0, data.umidade_solo ?? 0))}%`,
        air:     `${Math.min(100, Math.max(0, data.umidade_ar ?? 0))}%`,
        battery: `${Math.min(100, Math.max(0, data.nivel_bateria ?? 0))}%`,
      });
    } catch (e) {
      console.error('[useSensorData] parse error:', e);
    }
  }, [lastMessage]);

  return { sensorData, warnings, healthLevel, videoSource: VIDEO_MAP[healthLevel], percents, status };
}
