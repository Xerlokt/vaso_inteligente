import { THRESHOLDS } from '../constants/thresholds';

/** @typedef {{ text: string, color: string, textColor: string, key: string }} Warning */
/** @typedef {0 | 30 | 60 | 100} HealthLevel */

/**
 * @param {{ umidade_solo: number, temperatura: number, umidade_ar: number }} data
 * @returns {Warning[]}
 */
export function computeWarnings(data) {
  const warnings = [];

  if (data.umidade_solo < THRESHOLDS.SOIL_LOW) {
    warnings.push({
      key: 'soil',
      text: 'Preciso de mais água',
      color: 'var(--color-greenblue)',
      textColor: 'var(--color-dark-greenblue)',
    });
  }

  if (data.umidade_ar < THRESHOLDS.AIR_LOW) {
    warnings.push({
      key: 'air',
      text: 'Está muito seco',
      color: 'var(--color-yellow)',
      textColor: 'var(--color-dark-yellow)',
    });
  }

  if (data.temperatura > THRESHOLDS.TEMP_HIGH) {
    warnings.push({
      key: 'hot',
      text: 'Está muito quente',
      color: 'var(--color-red)',
      textColor: 'var(--color-dark-red)',
    });
  } else if (data.temperatura < THRESHOLDS.TEMP_LOW) {
    warnings.push({
      key: 'cold',
      text: 'Está muito frio',
      color: 'var(--color-blue)',
      textColor: 'var(--color-dark-blue)',
    });
  }

  return warnings;
}

/**
 * @param {Warning[]} warnings
 * @returns {HealthLevel}
 */
export function computeHealthLevel(warnings) {
  if (warnings.length === 0) return 100;
  if (warnings.length === 1) return 60;
  if (warnings.length === 2) return 30;
  return 0;
}

/**
 * @param {number} value
 * @param {number} max
 * @returns {number} 0–100
 */
export function toPercent(value, max) {
  return Math.min(100, Math.max(0, (value / max) * 100));
}
