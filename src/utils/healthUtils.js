import { THRESHOLDS } from '../constants/thresholds';
import { colors } from '../style/style';

export function computeWarnings(data) {
  const warnings = [];

  if (data.umidade_solo < THRESHOLDS.SOIL_LOW) {
    warnings.push({ key: 'soil', text: 'Preciso de mais água', color: colors.greenblue, textColor: colors.darkGreenblue });
  }
  if (data.umidade_ar < THRESHOLDS.AIR_LOW) {
    warnings.push({ key: 'air', text: 'Está muito seco', color: colors.yellow, textColor: colors.darkYellow });
  }
  if (data.temperatura > THRESHOLDS.TEMP_HIGH) {
    warnings.push({ key: 'hot', text: 'Está muito quente', color: colors.red, textColor: colors.darkRed });
  } else if (data.temperatura < THRESHOLDS.TEMP_LOW) {
    warnings.push({ key: 'cold', text: 'Está muito frio', color: colors.blue, textColor: colors.darkBlue });
  }

  return warnings;
}

export function computeHealthLevel(warnings) {
  if (warnings.length === 0) return 100;
  if (warnings.length === 1) return 60;
  if (warnings.length === 2) return 30;
  return 0;
}

export function toPercent(value, max) {
  return `${Math.min(100, Math.max(0, (value / max) * 100))}%`;
}
