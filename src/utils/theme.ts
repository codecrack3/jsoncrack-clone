import { ThemeColors } from '../types';

/**
 * Light theme colors
 */
export const lightTheme: ThemeColors = {
  background: '#ffffff',
  backgroundSecondary: '#f8fafc',
  graphBackground: '#f1f5f9',
  graphGrid: '#e2e8f0',
  nodeColors: {
    object: { bg: '#eef2ff', border: '#6366f1', text: '#4338ca' },
    array: { bg: '#f5f3ff', border: '#8b5cf6', text: '#6d28d9' },
    string: { bg: '#f0fdf4', border: '#22c55e', text: '#15803d' },
    number: { bg: '#fffbeb', border: '#f59e0b', text: '#b45309' },
    boolean: { bg: '#eff6ff', border: '#3b82f6', text: '#1d4ed8' },
    null: { bg: '#f9fafb', border: '#6b7280', text: '#374151' },
  },
  edge: '#94a3b8',
  text: '#1e293b',
  textSecondary: '#64748b',
};

/**
 * Dark theme colors
 */
export const darkTheme: ThemeColors = {
  background: '#0f172a',
  backgroundSecondary: '#1e293b',
  graphBackground: '#1e293b',
  graphGrid: '#334155',
  nodeColors: {
    object: { bg: '#312e81', border: '#818cf8', text: '#c7d2fe' },
    array: { bg: '#4c1d95', border: '#a78bfa', text: '#ddd6fe' },
    string: { bg: '#14532d', border: '#4ade80', text: '#bbf7d0' },
    number: { bg: '#78350f', border: '#fbbf24', text: '#fef3c7' },
    boolean: { bg: '#1e3a8a', border: '#60a5fa', text: '#bfdbfe' },
    null: { bg: '#374151', border: '#9ca3af', text: '#e5e7eb' },
  },
  edge: '#64748b',
  text: '#f1f5f9',
  textSecondary: '#94a3b8',
};

/**
 * Get theme colors based on mode
 */
export function getThemeColors(isDark: boolean): ThemeColors {
  return isDark ? darkTheme : lightTheme;
}
