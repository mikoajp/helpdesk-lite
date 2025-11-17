// Design Tokens - Typography
export const TypographyTokens = {
  fontFamily: {
    primary: '"Roboto", "Helvetica Neue", sans-serif',
    mono: '"Courier New", monospace',
  },
  
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
  },
  
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    bold: 700,
  },
  
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
} as const;

export type TypographyToken = typeof TypographyTokens;
