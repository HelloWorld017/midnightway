const UNITS = ['', 'k', 'M', 'G', 'T', 'P'];

export const formatNumberByUnit = (value: number) => {
  const desiredUnitIndex = Math.floor((Math.floor(Math.log2(value) * (3 / 10)) + 1) / 3);
  const targetUnitIndex = Math.max(0, Math.min(desiredUnitIndex, UNITS.length - 1));

  const unit = UNITS[targetUnitIndex];
  const unitlessNumber = value / 2 ** (targetUnitIndex * 10);
  if (unitlessNumber > 100) {
    return `99+${unit}`;
  }

  if (unitlessNumber > 10) {
    return `${Math.round(unitlessNumber)}${unit}`;
  }

  return `${unitlessNumber.toFixed(1)}${unit}`;
};
