const UNITS = ['', 'k', 'M', 'G', 'T', 'P'];

const getUnitIndex = (value: number) => {
  // Eliminate simple case
  if (value < 99.5) {
    return 0;
  }

  // Only 0 ~ 99 can be represented for two digits.
  // So divide it by 100 first.
  const valueDivided = value / 100;

  // And apply log2() to get binary digits.
  // Then convert it to the unit index. (2^10 === 1024)
  let desiredUnitIndex = Math.floor(Math.log2(valueDivided) / 10);
  desiredUnitIndex = Math.max(0, desiredUnitIndex);

  // Compensate first `value / 100`
  desiredUnitIndex += 1;

  // Prevent the number is being `100` when rounded.
  if (value / 2 ** (desiredUnitIndex * 10) >= 99.5) {
    desiredUnitIndex += 1;
  }

  // Clamp to the units range
  return Math.max(0, Math.min(desiredUnitIndex, UNITS.length - 1));
};

export const formatNumberByUnit = (value: number) => {
  const targetUnitIndex = getUnitIndex(value);
  const unit = UNITS[targetUnitIndex];
  const unitlessNumber = value / 2 ** (targetUnitIndex * 10);
  if (unitlessNumber >= 99.5) {
    return `99+${unit}`;
  }

  if (unitlessNumber >= 10) {
    return `${Math.round(unitlessNumber)}${unit}`;
  }

  return `${unitlessNumber.toFixed(1)}${unit}`;
};
