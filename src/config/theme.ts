/**
 * Shamy Color Palette & Design Tokens
 * Directly derived from the Design Seeds architectural palette:
 * - Sky Blue (#68A8CF)
 * - Cobalt Blue (#0E4D92)
 * - Deep Burgundy (#481617)
 * - Terracotta Rust (#9E2A22)
 * - Warm Coral Clay (#BD5346)
 * - Soft Blush / Peach (#F3B3A6)
 */

export const THEME_COLORS = {
  // Brand Primary & Accents
  terracotta: {
    DEFAULT: '#9E2A22',
    hover: '#85221B',
    light: '#FBF0EF',
    border: '#E8A39E',
  },
  coral: {
    DEFAULT: '#BD5346',
    hover: '#A94438',
    light: '#FDEEEB',
  },
  cobalt: {
    DEFAULT: '#0E4D92',
    hover: '#093A70',
    light: '#E6EFF7',
    border: '#93BBE0',
  },
  sky: {
    DEFAULT: '#68A8CF',
    hover: '#5496BD',
    light: '#EBF4F9',
  },
  burgundy: {
    DEFAULT: '#481617',
    dark: '#2D0B0C',
    light: '#723435',
  },
  blush: {
    DEFAULT: '#F3B3A6',
    soft: '#F8CFC7',
    light: '#FDF3F1',
    border: '#EAC2BA',
  },
  // Neutrals with warm undertones
  canvas: {
    background: '#FAF4F1',
    surface: '#FFFFFF',
    surfaceSubtle: '#F6EEEA',
    surfaceHover: '#F2E6E1',
    border: '#EBDCD7',
    borderSubtle: '#F2E8E4',
  },
  text: {
    primary: '#301314', // Deep espresso burgundy undertone for sharp readability
    secondary: '#73504F', // Warm muted secondary
    tertiary: '#9D7B7A', // Placeholder / faint
    inverse: '#FFFFFF',
  },
  status: {
    open: { bg: '#EBF4F9', text: '#0E4D92', border: '#68A8CF' },
    locked: { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' },
    ordered: { bg: '#E0E7FF', text: '#3730A3', border: '#A5B4FC' },
    delivered: { bg: '#DCFCE7', text: '#166534', border: '#86EFAC' },
    settling: { bg: '#FDEEEB', text: '#9E2A22', border: '#F3B3A6' },
    completed: { bg: '#E6EFF7', text: '#0E4D92', border: '#93BBE0' },
    cancelled: { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' },
  },
} as const;
