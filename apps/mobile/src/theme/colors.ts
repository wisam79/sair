/**
 * Sair Design System — Colors
 * Primary: Premium Green #16A34A / #0A5C36
 * Secondary: Dark Charcoal #2D2D2D
 *
 * Enhanced palette with gradient stops, rich surfaces, and accent tones.
 */

export const Colors = {
  // Primary — Premium Green
  primary: '#16A34A',
  primaryLight: '#4ADE80',
  primaryDark: '#15803D',
  primarySurface: '#F0FDF4', // very light green background
  primaryDeep: '#0A5C36', // deep forest green for headers

  // Gradient stops (headers, buttons, accents)
  primaryGradientStart: '#0A5C36',
  primaryGradientMid: '#0E7A48',
  primaryGradientEnd: '#16A34A',

  // Secondary — Dark Charcoal
  secondary: '#2D2D2D',
  secondaryLight: '#3D3D3D',
  secondaryDark: '#1A1A1A', // used as dark screen background

  // Surfaces
  background: '#F7F5F2', // warm off-white for light screens (slightly warmer)
  backgroundDark: '#161616', // login / dark screens (deeper)
  surface: '#FFFFFF', // cards
  surfaceMuted: '#F3F0EC', // subtle card variant
  surfaceElevated: '#FFFFFF', // elevated cards (with stronger shadow)

  // Text
  text: '#1A1A1A',
  textSecondary: '#4A4A4A', // slightly darker for better readability
  textMuted: '#8A8A8A',
  textOnPrimary: '#FFFFFF', // text on green buttons
  textOnDark: '#FFFFFF', // text on dark backgrounds

  // Status
  success: '#22C55E',
  successSurface: '#DCFCE7',
  error: '#EF4444',
  errorSurface: '#FEF2F2',
  warning: '#F59E0B',
  warningSurface: '#FFFBEB',
  info: '#3B82F6',
  infoSurface: '#EFF6FF',

  // Borders
  border: '#E8E5E0',
  borderLight: '#F0EDE8',
  borderFocus: '#16A34A',

  // Misc
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0,0,0,0.55)',
  overlayLight: 'rgba(0,0,0,0.25)',
  transparent: 'transparent',

  // Glassmorphism
  glassWhite: 'rgba(255, 255, 255, 0.12)',
  glassBorder: 'rgba(255, 255, 255, 0.28)',
  glassOverlay: 'rgba(255, 255, 255, 0.05)',
} as const;

export type ColorKey = keyof typeof Colors;
