export const formatNumberByDigits = (value: number, digits = 2) =>
  Math.round(value).toString().padStart(digits, '0');
