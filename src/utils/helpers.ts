export const sanitizeTextInput = (value: string): string => value.trim();

export const validateEmailFormat = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const validatePhoneFormat = (value: string): boolean =>
  /^[+\d][\d\s-]{6,14}$/.test(value);

export const generateUniqueReference = (prefix: string): string =>
  `${prefix}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1_000)}`;
