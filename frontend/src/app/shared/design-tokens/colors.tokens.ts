// Design Tokens - Colors
export const ColorTokens = {
  // Primary colors
  primary: {
    main: '#3f51b5',
    light: '#757de8',
    dark: '#002984',
    contrast: '#ffffff',
  },
  
  // Status colors
  status: {
    open: '#2196f3',
    inProgress: '#ff9800',
    resolved: '#4caf50',
    closed: '#9e9e9e',
  },
  
  // Priority colors
  priority: {
    low: '#4caf50',
    medium: '#ff9800',
    high: '#f44336',
  },
  
  // Semantic colors
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
  
  // Neutral colors
  neutral: {
    white: '#ffffff',
    black: '#000000',
    gray: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
  },
  
  // Text colors
  text: {
    primary: 'rgba(0, 0, 0, 0.87)',
    secondary: 'rgba(0, 0, 0, 0.6)',
    disabled: 'rgba(0, 0, 0, 0.38)',
    hint: 'rgba(0, 0, 0, 0.38)',
  },
  
  // Background colors
  background: {
    default: '#fafafa',
    paper: '#ffffff',
    dark: '#303030',
  },
} as const;

export type ColorToken = typeof ColorTokens;
