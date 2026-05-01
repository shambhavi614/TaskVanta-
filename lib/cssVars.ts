// CSS variable helper to avoid inline style syntax errors
export const cssVar = (varName: string) => `var(${varName})`

// Common spacing values
export const space = {
  1: 'var(--space-1)',
  2: 'var(--space-2)',
  3: 'var(--space-3)',
  4: 'var(--space-4)',
  5: 'var(--space-5)',
  6: 'var(--space-6)',
  8: 'var(--space-8)',
  10: 'var(--space-10)',
  12: 'var(--space-12)',
  16: 'var(--space-16)',
}

// Common radius values
export const radius = {
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  xl: 'var(--radius-xl)',
  full: 'var(--radius-full)',
}

// Common colors
export const colors = {
  bgPrimary: 'var(--bg-primary)',
  bgSecondary: 'var(--bg-secondary)',
  bgCard: 'var(--bg-card)',
  bgElevated: 'var(--bg-elevated)',
  bgHover: 'var(--bg-hover)',
  
  borderSubtle: 'var(--border-subtle)',
  borderHover: 'var(--border-hover)',
  borderFocus: 'var(--border-focus)',
  
  textPrimary: 'var(--text-primary)',
  textSecondary: 'var(--text-secondary)',
  textMuted: 'var(--text-muted)',
  textDisabled: 'var(--text-disabled)',
  
  accentGreen: 'var(--accent-green)',
  accentGreenHover: 'var(--accent-green-hover)',
  accentGreenLight: 'var(--accent-green-light)',
  accentBlue: 'var(--accent-blue)',
  accentBlueLight: 'var(--accent-blue-light)',
  accentPurple: 'var(--accent-purple)',
  accentPurpleLight: 'var(--accent-purple-light)',
  accentOrange: 'var(--accent-orange)',
  accentOrangeLight: 'var(--accent-orange-light)',
  accentRed: 'var(--accent-red)',
  accentRedLight: 'var(--accent-red-light)',
  accentCyan: 'var(--accent-cyan)',
}

// Common shadows
export const shadows = {
  sm: 'var(--shadow-sm)',
  md: 'var(--shadow-md)',
  lg: 'var(--shadow-lg)',
  xl: 'var(--shadow-xl)',
}
