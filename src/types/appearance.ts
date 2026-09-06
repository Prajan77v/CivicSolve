export type ThemeMode = 'light' | 'dark' | 'system'
export type AccentKey =
  | 'ocean-blue'
  | 'civic-green'
  | 'indigo'
  | 'amber'
  | 'rose'
  | 'slate'
  | 'neon-cyan'
  | 'royal-purple'
  | 'sunset-orange'
  | 'emerald-mint'
  | 'custom'
export type DensityMode = 'compact' | 'comfortable' | 'spacious'
export type MotionMode = 'full' | 'reduced' | 'off'

export interface AccentPreset {
  key: AccentKey
  name: string
  label: string
  description: string
  hex: string
}

export const ACCENT_PRESETS: AccentPreset[] = [
  {
    key: 'ocean-blue',
    name: 'Ocean Blue',
    label: 'Ocean Blue',
    description: 'Crisp civic municipal blue',
    hex: '#2563eb',
  },
  {
    key: 'civic-green',
    name: 'Civic Green',
    label: 'Civic Green',
    description: 'Clean ecological sustainability emerald',
    hex: '#059669',
  },
  {
    key: 'indigo',
    name: 'Indigo',
    label: 'Indigo',
    description: 'Academic engineering & research',
    hex: '#6366f1',
  },
  {
    key: 'amber',
    name: 'Amber',
    label: 'Amber',
    description: 'Urgency & infrastructure telemetry',
    hex: '#d97706',
  },
  {
    key: 'rose',
    name: 'Rose',
    label: 'Rose',
    description: 'Public health & social outreach',
    hex: '#e11d48',
  },
  {
    key: 'slate',
    name: 'Slate',
    label: 'Slate',
    description: 'Minimalist editorial monochrome',
    hex: '#475569',
  },
  {
    key: 'neon-cyan',
    name: 'Electric Cyan',
    label: 'Electric Cyan',
    description: 'High-contrast vibrant tech azure',
    hex: '#06b6d4',
  },
  {
    key: 'royal-purple',
    name: 'Royal Purple',
    label: 'Royal Purple',
    description: 'Prestigious national governance',
    hex: '#8b5cf6',
  },
  {
    key: 'sunset-orange',
    name: 'Sunset Orange',
    label: 'Sunset Orange',
    description: 'Dynamic civic problem urgency',
    hex: '#f97316',
  },
  {
    key: 'emerald-mint',
    name: 'Emerald Mint',
    label: 'Emerald Mint',
    description: 'Luminous sustainability green',
    hex: '#10b981',
  },
]

export interface AppearanceSettingsData {
  theme: ThemeMode
  accentKey: AccentKey
  customColor: string | null
  density: DensityMode
  motion: MotionMode
}

export const DEFAULT_APPEARANCE_SETTINGS: AppearanceSettingsData = {
  theme: 'system',
  accentKey: 'ocean-blue',
  customColor: '#2563eb',
  density: 'comfortable',
  motion: 'full',
}

export interface ComputedAccentColors {
  accent: string
  hover: string
  light: string
  border: string
  foreground: string
  glow: string
}

export function isValidHex(hex: string): boolean {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex)
}

export function normalizeHex(hex: string): string {
  if (!isValidHex(hex)) return '#2563eb'
  if (hex.length === 4) {
    return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
  }
  return hex.toLowerCase()
}

export function computeAccentColors(hexInput: string): ComputedAccentColors {
  const hex = normalizeHex(hexInput)
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  // Relative luminance calculation for accessibility
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  const foreground = luminance > 0.65 ? '#0f172a' : '#ffffff'

  // Darker shade for hover state
  const hoverR = Math.max(0, Math.floor(r * 0.85))
  const hoverG = Math.max(0, Math.floor(g * 0.85))
  const hoverB = Math.max(0, Math.floor(b * 0.85))
  const hover = `#${hoverR.toString(16).padStart(2, '0')}${hoverG.toString(16).padStart(2, '0')}${hoverB.toString(16).padStart(2, '0')}`

  return {
    accent: hex,
    hover,
    light: `rgba(${r}, ${g}, ${b}, 0.15)`,
    border: `rgba(${r}, ${g}, ${b}, 0.35)`,
    foreground,
    glow: `rgba(${r}, ${g}, ${b}, 0.25)`,
  }
}
