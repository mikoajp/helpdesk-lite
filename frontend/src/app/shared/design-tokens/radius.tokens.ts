// Design Tokens - Border Radius
export const RadiusTokens = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '16px',
  full: '9999px',
} as const;

export type RadiusToken = typeof RadiusTokens;
