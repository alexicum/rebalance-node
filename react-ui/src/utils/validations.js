export const required = value => (value && value.length === 0 ? 'Required' : null);

export const isInt = value => (Number.isNaN(Number.parseInt(value, 10)) ? 'Integer required' : null);

export const intInRange = (value, min, max) => {
  const result = isInt(value);

  if (result) return result;

  const intValue = Number.parseInt(value, 10);
  return (intValue < min) || (intValue > max) ?
    `Number should be in range: (${min}, ${max})` : null;
};

export const intMin = (value, min) => (
  isInt(value) || Number.parseInt(value, 10) < min
    ? `Should be more than ${min}`
    : null
);

export const isAlpha = value => (!/^[a-zA-Zа-яА-Я]+$/.test(value) ? 'Only letters supported' : null);

export const isPhone = value => (!/\+7 \([1-9]{3}\) \d{3}-\d{4}/.test(value) ? 'Incorrect phone format' : null);
