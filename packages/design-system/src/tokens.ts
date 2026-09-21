// References to the values defined in tokens.css, for code that needs token names.
export const spacing = {
  xs: 'var(--space-xs)', sm: 'var(--space-sm)', md: 'var(--space-md)',
  lg: 'var(--space-lg)', xl: 'var(--space-xl)',
} as const

export const radius = {
  sm: 'var(--radius-sm)', md: 'var(--radius-md)', lg: 'var(--radius-lg)',
} as const

export const colors = {
  ink: 'var(--color-ink)', muted: 'var(--color-muted)', accent: 'var(--color-accent)',
  surface: 'var(--color-surface)', canvas: 'var(--color-canvas)',
} as const

export const typography = {
  display: 'var(--font-display)', sans: 'var(--font-sans)', mono: 'var(--font-mono)',
} as const

export const shadows = { page: 'var(--shadow-page)' } as const
