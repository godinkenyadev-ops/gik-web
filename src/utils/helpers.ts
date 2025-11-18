export const sanitizeInput = (value: string): string => value.trim();

export const isValidEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const isValidPhone = (value: string): boolean =>
  /^[+\d][\d\s-]{6,14}$/.test(value);

export const createReference = (prefix: string): string =>
  `${prefix}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1_000)}`;
