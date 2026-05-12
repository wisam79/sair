/**
 * UniRide Design System — Colors
 * Primary: Earthy Orange #C2703E
 * Secondary: Dark Charcoal #2D2D2D
 */

export const Colors = {
  // Primary — Earthy Orange
  primary: '#C2703E',
  primaryLight: '#D4845A',
  primaryDark: '#A85C2E',
  primarySurface: '#FDF0E8', // very light orange background

  // Secondary — Dark Charcoal
  secondary: '#2D2D2D',
  secondaryLight: '#3D3D3D',
  secondaryDark: '#1A1A1A', // used as dark screen background

  // Surfaces
  background: '#F5F2EF', // warm off-white for light screens
  backgroundDark: '#1A1A1A', // login / dark screens
  surface: '#FFFFFF', // cards
  surfaceMuted: '#F5F2EF', // subtle card variant

  // Text
  text: '#1A1A1A',
  textSecondary: '#555555',
  textMuted: '#8A8A8A',
  textOnPrimary: '#FFFFFF', // text on orange buttons
  textOnDark: '#FFFFFF', // text on dark backgrounds

  // Status
  success: '#4CAF50',
  successSurface: '#E8F5E9',
  error: '#E53935',
  errorSurface: '#FFEBEE',
  warning: '#FF9500',
  warningSurface: '#FFF3E0',
  info: '#1976D2',

  // Borders
  border: '#E0DDD8',
  borderFocus: '#C2703E',

  // Misc
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0,0,0,0.5)',
  transparent: 'transparent',
} as const;

export type ColorKey = keyof typeof Colors;
