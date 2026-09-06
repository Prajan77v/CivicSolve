'use client'

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import {
  ThemeMode,
  AccentKey,
  DensityMode,
  MotionMode,
  AppearanceSettingsData,
  DEFAULT_APPEARANCE_SETTINGS,
  ACCENT_PRESETS,
  ComputedAccentColors,
  computeAccentColors,
  isValidHex,
} from '@/types/appearance'

interface AppearanceContextType {
  theme: ThemeMode
  accentKey: AccentKey
  customColor: string | null
  density: DensityMode
  motion: MotionMode
  resolvedTheme: 'light' | 'dark'
  computedAccent: ComputedAccentColors
  setTheme: (t: ThemeMode) => void
  setAccentKey: (k: AccentKey, customHex?: string) => void
  setCustomColor: (hex: string) => void
  setDensity: (d: DensityMode) => void
  setMotion: (m: MotionMode) => void
  resetToDefault: () => void
  isLoaded: boolean
}

const STORAGE_KEY = 'civicsolve_appearance_settings'

const AppearanceContext = createContext<AppearanceContextType | undefined>(undefined)

export function useAppearance() {
  const context = useContext(AppearanceContext)
  if (!context) {
    throw new Error('useAppearance must be used within an AppearanceProvider')
  }
  return context
}

function applyDOMAttributes(
  theme: ThemeMode,
  resolvedTheme: 'light' | 'dark',
  density: DensityMode,
  motion: MotionMode,
  computedAccent: ComputedAccentColors
) {
  if (typeof document === 'undefined') return

  const root = document.documentElement

  // Theme classes & attributes
  root.classList.remove('light', 'dark')
  root.classList.add(resolvedTheme)
  root.setAttribute('data-theme', theme)
  root.setAttribute('data-resolved-theme', resolvedTheme)
  root.style.colorScheme = resolvedTheme

  // Density attribute
  root.setAttribute('data-density', density)

  // Motion attribute
  root.setAttribute('data-motion', motion)

  // Accent CSS Variables
  root.style.setProperty('--accent-color', computedAccent.accent)
  root.style.setProperty('--accent-hover', computedAccent.hover)
  root.style.setProperty('--accent-light', computedAccent.light)
  root.style.setProperty('--accent-border', computedAccent.border)
  root.style.setProperty('--accent-foreground', computedAccent.foreground)
  root.style.setProperty('--accent-glow', computedAccent.glow)

  // Backwards compatibility tokens
  root.style.setProperty('--primary', computedAccent.accent)
  root.style.setProperty('--primary-hover', computedAccent.hover)
}

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()

  const [theme, setThemeState] = useState<ThemeMode>(DEFAULT_APPEARANCE_SETTINGS.theme)
  const [accentKey, setAccentKeyState] = useState<AccentKey>(DEFAULT_APPEARANCE_SETTINGS.accentKey)
  const [customColor, setCustomColorState] = useState<string | null>(DEFAULT_APPEARANCE_SETTINGS.customColor)
  const [density, setDensityState] = useState<DensityMode>(DEFAULT_APPEARANCE_SETTINGS.density)
  const [motion, setMotionState] = useState<MotionMode>(DEFAULT_APPEARANCE_SETTINGS.motion)
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(true)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  // Resolve system color scheme
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    setSystemPrefersDark(mq.matches)

    const handler = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Calculate resolved theme
  const resolvedTheme: 'light' | 'dark' = useMemo(() => {
    if (theme === 'system') {
      return systemPrefersDark ? 'dark' : 'light'
    }
    return theme
  }, [theme, systemPrefersDark])

  // Calculate accent hex code
  const activeAccentHex = useMemo(() => {
    if (accentKey === 'custom' && customColor && isValidHex(customColor)) {
      return customColor
    }
    const preset = ACCENT_PRESETS.find((p) => p.key === accentKey)
    return preset ? preset.hex : '#2563eb'
  }, [accentKey, customColor])

  // Compute accent variations and accessible contrast
  const computedAccent = useMemo(() => {
    return computeAccentColors(activeAccentHex)
  }, [activeAccentHex])

  // Initial load from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<AppearanceSettingsData>
        if (parsed.theme) setThemeState(parsed.theme)
        if (parsed.accentKey) setAccentKeyState(parsed.accentKey)
        if (parsed.customColor) setCustomColorState(parsed.customColor)
        if (parsed.density) setDensityState(parsed.density)
        if (parsed.motion) setMotionState(parsed.motion)
      }
    } catch (e) {
      console.error('Failed to read appearance settings from localStorage', e)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Sync from backend when authenticated
  useEffect(() => {
    if (!session?.user?.email) return
    let isMounted = true

    async function fetchServerSettings() {
      try {
        const res = await fetch('/api/settings/appearance')
        if (res.ok) {
          const data: AppearanceSettingsData = await res.json()
          if (!isMounted) return
          if (data.theme) setThemeState(data.theme)
          if (data.accentKey) setAccentKeyState(data.accentKey)
          if (data.customColor) setCustomColorState(data.customColor)
          if (data.density) setDensityState(data.density)
          if (data.motion) setMotionState(data.motion)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        }
      } catch (err) {
        console.error('Failed to load server appearance settings', err)
      }
    }

    fetchServerSettings()
    return () => {
      isMounted = false
    }
  }, [session?.user?.email])

  // Apply DOM attributes & CSS variables whenever state or resolvedTheme changes
  useEffect(() => {
    applyDOMAttributes(theme, resolvedTheme, density, motion, computedAccent)
  }, [theme, resolvedTheme, density, motion, computedAccent])

  // Persist settings helper
  const persistSettings = useCallback(
    (nextSettings: AppearanceSettingsData) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSettings))
      }
      if (session?.user?.email) {
        fetch('/api/settings/appearance', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nextSettings),
        }).catch((err) => console.error('Error persisting appearance to server:', err))
      }
    },
    [session?.user?.email]
  )

  const setTheme = useCallback(
    (newTheme: ThemeMode) => {
      setThemeState(newTheme)
      persistSettings({
        theme: newTheme,
        accentKey,
        customColor,
        density,
        motion,
      })
    },
    [accentKey, customColor, density, motion, persistSettings]
  )

  const setAccentKey = useCallback(
    (newAccentKey: AccentKey, customHex?: string) => {
      setAccentKeyState(newAccentKey)
      const nextCustomColor = customHex ?? customColor
      if (customHex) {
        setCustomColorState(customHex)
      }
      persistSettings({
        theme,
        accentKey: newAccentKey,
        customColor: nextCustomColor,
        density,
        motion,
      })
    },
    [theme, customColor, density, motion, persistSettings]
  )

  const setCustomColor = useCallback(
    (hex: string) => {
      setCustomColorState(hex)
      setAccentKeyState('custom')
      persistSettings({
        theme,
        accentKey: 'custom',
        customColor: hex,
        density,
        motion,
      })
    },
    [theme, density, motion, persistSettings]
  )

  const setDensity = useCallback(
    (newDensity: DensityMode) => {
      setDensityState(newDensity)
      persistSettings({
        theme,
        accentKey,
        customColor,
        density: newDensity,
        motion,
      })
    },
    [theme, accentKey, customColor, motion, persistSettings]
  )

  const setMotion = useCallback(
    (newMotion: MotionMode) => {
      setMotionState(newMotion)
      persistSettings({
        theme,
        accentKey,
        customColor,
        density,
        motion: newMotion,
      })
    },
    [theme, accentKey, customColor, density, persistSettings]
  )

  const resetToDefault = useCallback(() => {
    setThemeState(DEFAULT_APPEARANCE_SETTINGS.theme)
    setAccentKeyState(DEFAULT_APPEARANCE_SETTINGS.accentKey)
    setCustomColorState(DEFAULT_APPEARANCE_SETTINGS.customColor)
    setDensityState(DEFAULT_APPEARANCE_SETTINGS.density)
    setMotionState(DEFAULT_APPEARANCE_SETTINGS.motion)
    persistSettings(DEFAULT_APPEARANCE_SETTINGS)
  }, [persistSettings])

  return (
    <AppearanceContext.Provider
      value={{
        theme,
        accentKey,
        customColor,
        density,
        motion,
        resolvedTheme,
        computedAccent,
        setTheme,
        setAccentKey,
        setCustomColor,
        setDensity,
        setMotion,
        resetToDefault,
        isLoaded,
      }}
    >
      {children}
    </AppearanceContext.Provider>
  )
}
