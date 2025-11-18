// Design Tokens - Colors
// Modern color palette with enhanced visual hierarchy
export const ColorTokens = {
  // Primary brand colors - Modern blue gradient
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    main: '#2563eb',
    light: '#60a5fa',
    dark: '#1e40af',
    contrast: '#ffffff',
  },
  
  // Secondary colors - Modern indigo
  secondary: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
    main: '#6366f1',
    light: '#818cf8',
    dark: '#4338ca',
    contrast: '#ffffff',
  },
  
  // Status colors with modern palette
  status: {
    open: {
      main: '#3b82f6',
      light: '#93c5fd',
      dark: '#1e40af',
      bg: '#eff6ff',
      border: '#bfdbfe',
    },
    inProgress: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
      bg: '#fef3c7',
      border: '#fde68a',
    },
    resolved: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
      bg: '#d1fae5',
      border: '#a7f3d0',
    },
    closed: {
      main: '#6b7280',
      light: '#9ca3af',
      dark: '#4b5563',
      bg: '#f3f4f6',
      border: '#e5e7eb',
    },
  },
  
  // Priority colors with clear visual distinction
  priority: {
    low: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
      bg: '#d1fae5',
      border: '#a7f3d0',
      text: '#065f46',
    },
    medium: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
      bg: '#fef3c7',
      border: '#fde68a',
      text: '#92400e',
    },
    high: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
      bg: '#fee2e2',
      border: '#fecaca',
      text: '#991b1b',
    },
    critical: {
      main: '#dc2626',
      light: '#ef4444',
      dark: '#b91c1c',
      bg: '#fef2f2',
      border: '#fee2e2',
      text: '#7f1d1d',
    },
  },
  
  // Semantic colors - expanded palette
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    main: '#16a34a',
    light: '#4ade80',
    dark: '#15803d',
  },
  
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    main: '#f59e0b',
    light: '#fbbf24',
    dark: '#d97706',
  },
  
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    main: '#dc2626',
    light: '#f87171',
    dark: '#b91c1c',
  },
  
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    main: '#2563eb',
    light: '#60a5fa',
    dark: '#1d4ed8',
  },
  
  // Neutral colors - refined gray scale
  neutral: {
    white: '#ffffff',
    black: '#000000',
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
      950: '#030712',
    },
  },
  
  // Text colors with better contrast
  text: {
    primary: '#111827',
    secondary: '#4b5563',
    tertiary: '#6b7280',
    disabled: '#9ca3af',
    inverse: '#ffffff',
    link: '#2563eb',
    linkHover: '#1d4ed8',
  },
  
  // Background colors
  background: {
    default: '#ffffff',
    secondary: '#f9fafb',
    tertiary: '#f3f4f6',
    paper: '#ffffff',
    dark: '#111827',
    darker: '#030712',
    elevated: '#ffffff',
  },
  
  // Border colors
  border: {
    light: '#f3f4f6',
    default: '#e5e7eb',
    medium: '#d1d5db',
    dark: '#9ca3af',
  },
  
  // Overlay colors
  overlay: {
    light: 'rgba(0, 0, 0, 0.05)',
    medium: 'rgba(0, 0, 0, 0.15)',
    dark: 'rgba(0, 0, 0, 0.4)',
    darker: 'rgba(0, 0, 0, 0.7)',
  },
} as const;

export type ColorToken = typeof ColorTokens;
