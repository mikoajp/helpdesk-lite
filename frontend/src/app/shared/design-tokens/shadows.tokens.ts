// Design Tokens - Shadows
// Modern shadow system for elevation and depth
export const ShadowTokens = {
  // Elevation shadows
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  
  // Inner shadows
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  
  // Colored shadows
  primary: '0 10px 15px -3px rgba(37, 99, 235, 0.2), 0 4px 6px -4px rgba(37, 99, 235, 0.1)',
  success: '0 10px 15px -3px rgba(22, 163, 74, 0.2), 0 4px 6px -4px rgba(22, 163, 74, 0.1)',
  warning: '0 10px 15px -3px rgba(245, 158, 11, 0.2), 0 4px 6px -4px rgba(245, 158, 11, 0.1)',
  error: '0 10px 15px -3px rgba(220, 38, 38, 0.2), 0 4px 6px -4px rgba(220, 38, 38, 0.1)',
  
  // None
  none: 'none',
} as const;

export type ShadowToken = typeof ShadowTokens;
