import { useMemo } from 'react';
import { useMqtt } from './useMqtt';
import { computeWarnings, computeHealthLevel, toPercent } from '../utils/healthUtils';
import { TEMP_MAX } from '../constants/thresholds';

/**
 * @returns {{
 *   sensorData: object | null,
 *   warnings: import('../utils/healthUtils').Warning[],
 *   healthLevel: import('../utils/healthUtils').HealthLevel,
 *   status: string,
 *   percents: { temp: number, soil: number, air: number, battery: number }
 * }}
 */
export function useSensorData() {
  const { lastMessage, status } = useMqtt();

  const sensorData = useMemo(() => {
    if (!lastMessage) return null;
    try {
      return JSON.parse(lastMessage);
    } catch {
      return null;
    }
  }, [lastMessage]);

  const warnings = useMemo(() => {
    if (!sensorData) return [];
    return computeWarnings(sensorData);
  }, [sensorData]);

  const healthLevel = useMemo(() => computeHealthLevel(warnings), [warnings]);

  const percents = useMemo(() => {
    if (!sensorData) return { temp: 0, soil: 0, air: 0, battery: 0 };
    return {
      temp:    toPercent(sensorData.temperatura ?? 0, TEMP_MAX),
      soil:    Math.min(100, Math.max(0, sensorData.umidade_solo ?? 0)),
      air:     Math.min(100, Math.max(0, sensorData.umidade_ar ?? 0)),
      battery: Math.min(100, Math.max(0, sensorData.nivel_bateria ?? 0)),
    };
  }, [sensorData]);

  return { sensorData, warnings, healthLevel, status, percents };
}
