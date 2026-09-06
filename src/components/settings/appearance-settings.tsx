'use client'

import React, { useState, useEffect } from 'react'
import {
  Sun,
  Moon,
  Laptop,
  Check,
  RotateCcw,
  Sparkles,
  Zap,
  Sliders,
  Maximize2,
  Minimize2,
  Eye,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  TrendingUp,
  Activity,
  Layers,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAppearance } from '@/components/providers/appearance-provider'
import {
  ThemeMode,
  AccentKey,
  DensityMode,
  MotionMode,
  ACCENT_PRESETS,
  isValidHex,
} from '@/types/appearance'
import { cn } from '@/lib/utils'

export default function AppearanceSettings() {
  const {
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
  } = useAppearance()

  const [customHexInput, setCustomHexInput] = useState(customColor || '#2563eb')
  const [customHexError, setCustomHexError] = useState<string | null>(null)

  useEffect(() => {
    if (customColor) {
      setCustomHexInput(customColor)
    }
  }, [customColor])

  const handleCustomHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setCustomHexInput(val)
    if (isValidHex(val)) {
      setCustomHexError(null)
      setCustomColor(val)
    } else {
      setCustomHexError('Please enter a valid hex code (e.g. #059669 or #2563eb)')
    }
  }

  const handleReset = () => {
    resetToDefault()
    setCustomHexInput('#2563eb')
    setCustomHexError(null)
    toast.success('Appearance settings restored to system defaults')
  }

  return (
    <div className="space-y-10">
      {/* SECTION 1: THEME */}
      <section aria-labelledby="theme-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 id="theme-heading" className="text-base font-bold text-white flex items-center gap-2">
              <Sun className="h-4 w-4 text-blue-400" />
              Interface Theme
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select an interface mode or automatically follow your operating system appearance.
            </p>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded border border-slate-700 bg-slate-800/80 text-slate-300">
            Active: <span className="font-bold text-white uppercase">{theme}</span> ({resolvedTheme})
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Light Theme Card */}
          <button
            type="button"
            role="radio"
            aria-checked={theme === 'light'}
            data-testid="theme-light-btn"
            onClick={() => setTheme('light')}
            className={cn(
              'group relative flex flex-col p-3 rounded-xl border text-left transition-all',
              theme === 'light'
                ? 'border-blue-500 bg-blue-500/10 shadow-md ring-1 ring-blue-500/50'
                : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-850'
            )}
          >
            {/* Visual Mini Mockup */}
            <div className="w-full h-24 rounded-lg bg-[#ffffff] border border-slate-200 p-2.5 flex flex-col justify-between overflow-hidden shadow-inner mb-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-slate-300" />
                  <div className="h-1.5 w-12 rounded bg-slate-200" />
                </div>
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: computedAccent.accent }} />
              </div>
              <div className="space-y-1 py-1">
                <div className="h-2 w-20 rounded bg-slate-800" />
                <div className="h-1.5 w-28 rounded bg-slate-300" />
              </div>
              <div className="flex items-center gap-1 pt-1">
                <div className="h-3 w-10 rounded text-[7px] text-white flex items-center justify-center font-bold" style={{ backgroundColor: computedAccent.accent }}>
                  Action
                </div>
                <div className="h-3 w-8 rounded bg-slate-100 border border-slate-200" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn(
                  'h-4 w-4 rounded-full border flex items-center justify-center transition-colors',
                  theme === 'light' ? 'border-blue-500 bg-blue-600 text-white' : 'border-slate-600 bg-slate-800'
                )}>
                  {theme === 'light' && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                </div>
                <div>
                  <span className="text-xs font-semibold text-white block">Light</span>
                  <span className="text-[10px] text-slate-400">Clean professional day mode</span>
                </div>
              </div>
            </div>
          </button>

          {/* Dark Theme Card */}
          <button
            type="button"
            role="radio"
            aria-checked={theme === 'dark'}
            data-testid="theme-dark-btn"
            onClick={() => setTheme('dark')}
            className={cn(
              'group relative flex flex-col p-3 rounded-xl border text-left transition-all',
              theme === 'dark'
                ? 'border-blue-500 bg-blue-500/10 shadow-md ring-1 ring-blue-500/50'
                : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-850'
            )}
          >
            {/* Visual Mini Mockup */}
            <div className="w-full h-24 rounded-lg bg-[#08090c] border border-slate-800 p-2.5 flex flex-col justify-between overflow-hidden shadow-inner mb-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-slate-700" />
                  <div className="h-1.5 w-12 rounded bg-slate-700" />
                </div>
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: computedAccent.accent }} />
              </div>
              <div className="space-y-1 py-1">
                <div className="h-2 w-20 rounded bg-slate-200" />
                <div className="h-1.5 w-28 rounded bg-slate-600" />
              </div>
              <div className="flex items-center gap-1 pt-1">
                <div className="h-3 w-10 rounded text-[7px] text-white flex items-center justify-center font-bold" style={{ backgroundColor: computedAccent.accent }}>
                  Action
                </div>
                <div className="h-3 w-8 rounded bg-slate-800 border border-slate-700" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn(
                  'h-4 w-4 rounded-full border flex items-center justify-center transition-colors',
                  theme === 'dark' ? 'border-blue-500 bg-blue-600 text-white' : 'border-slate-600 bg-slate-800'
                )}>
                  {theme === 'dark' && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                </div>
                <div>
                  <span className="text-xs font-semibold text-white block">Dark</span>
                  <span className="text-[10px] text-slate-400">Deep obsidian night workspace</span>
                </div>
              </div>
            </div>
          </button>

          {/* System Theme Card */}
          <button
            type="button"
            role="radio"
            aria-checked={theme === 'system'}
            data-testid="theme-system-btn"
            onClick={() => setTheme('system')}
            className={cn(
              'group relative flex flex-col p-3 rounded-xl border text-left transition-all',
              theme === 'system'
                ? 'border-blue-500 bg-blue-500/10 shadow-md ring-1 ring-blue-500/50'
                : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-850'
            )}
          >
            {/* Visual Mini Mockup: Split Light/Dark */}
            <div className="w-full h-24 rounded-lg border border-slate-800 flex overflow-hidden shadow-inner mb-3">
              <div className="w-1/2 h-full bg-white p-2 flex flex-col justify-between border-r border-slate-200">
                <div className="h-1.5 w-10 rounded bg-slate-300" />
                <div className="h-2 w-14 rounded bg-slate-800" />
                <div className="h-3 w-8 rounded text-[6px] text-white flex items-center justify-center font-bold" style={{ backgroundColor: computedAccent.accent }}>
                  Day
                </div>
              </div>
              <div className="w-1/2 h-full bg-[#08090c] p-2 flex flex-col justify-between">
                <div className="h-1.5 w-10 rounded bg-slate-700 ml-auto" />
                <div className="h-2 w-14 rounded bg-slate-200 ml-auto" />
                <div className="h-3 w-8 rounded text-[6px] text-white flex items-center justify-center font-bold ml-auto" style={{ backgroundColor: computedAccent.accent }}>
                  Night
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn(
                  'h-4 w-4 rounded-full border flex items-center justify-center transition-colors',
                  theme === 'system' ? 'border-blue-500 bg-blue-600 text-white' : 'border-slate-600 bg-slate-800'
                )}>
                  {theme === 'system' && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                </div>
                <div>
                  <span className="text-xs font-semibold text-white block">System</span>
                  <span className="text-[10px] text-slate-400">Match operating system preference</span>
                </div>
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* SECTION 2: ACCENT PALETTE */}
      <section aria-labelledby="accent-heading" className="space-y-4">
        <div>
          <h2 id="accent-heading" className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-400" />
            Accent Palette
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Choose an accent color that coordinates primary buttons, links, progress, and active telemetry.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {ACCENT_PRESETS.map((preset) => {
            const isSelected = accentKey === preset.key
            return (
              <button
                key={preset.key}
                type="button"
                role="radio"
                aria-checked={isSelected}
                data-testid={`accent-${preset.key}-btn`}
                onClick={() => setAccentKey(preset.key)}
                className={cn(
                  'flex flex-col items-center p-3 rounded-xl border text-center transition-all group',
                  isSelected
                    ? 'border-white/30 bg-slate-850 shadow-md ring-2 ring-offset-2 ring-offset-[#08090c]'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-850'
                )}
                style={isSelected ? { borderColor: preset.hex, outlineColor: preset.hex } : undefined}
              >
                <div
                  className="h-9 w-9 rounded-xl flex items-center justify-center shadow-md mb-2 transition-transform group-hover:scale-105"
                  style={{ backgroundColor: preset.hex }}
                >
                  {isSelected && <Check className="h-4 w-4 stroke-[3]" style={{ color: '#ffffff' }} />}
                </div>
                <span className="text-xs font-semibold text-white truncate w-full">{preset.label}</span>
                <span className="text-[10px] font-mono text-slate-400 mt-0.5">{preset.hex}</span>
              </button>
            )
          })}
        </div>

        {/* SECTION 3: CUSTOM ACCENT */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-semibold text-white">Custom Accent Color</span>
            </div>
            <span className="text-[11px] text-slate-400">WCAG Luminance Auto-Calibrated</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex items-center gap-2">
              <input
                type="color"
                aria-label="Custom color picker"
                value={isValidHex(customHexInput) ? customHexInput : '#2563eb'}
                onChange={(e) => {
                  setCustomHexInput(e.target.value)
                  setCustomHexError(null)
                  setCustomColor(e.target.value)
                }}
                className="h-9 w-9 rounded-lg border border-slate-700 cursor-pointer bg-transparent p-0 overflow-hidden"
              />
              <input
                type="text"
                data-testid="custom-hex-input"
                aria-label="Custom hex code"
                value={customHexInput}
                onChange={handleCustomHexChange}
                placeholder="#059669"
                className="h-9 w-28 rounded-lg border border-slate-700 bg-slate-950 px-2.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              type="button"
              data-testid="apply-custom-accent-btn"
              onClick={() => {
                if (isValidHex(customHexInput)) {
                  setCustomColor(customHexInput)
                  toast.success(`Custom accent ${customHexInput} applied`)
                }
              }}
              className="h-9 px-3 rounded-lg text-xs font-semibold text-white transition-all shadow-sm"
              style={{
                backgroundColor: computedAccent.accent,
                color: computedAccent.foreground,
              }}
            >
              Apply Custom Color
            </button>

            {/* Accessibility badge */}
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 ml-auto">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Contrasting text: </span>
              <span className="font-mono font-bold text-white px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
                {computedAccent.foreground === '#ffffff' ? 'White (#fff)' : 'Dark Slate (#0f172a)'}
              </span>
            </div>
          </div>

          {customHexError && (
            <p className="text-[11px] text-rose-400">{customHexError}</p>
          )}
        </div>
      </section>

      {/* SECTION 4: INTERFACE DENSITY */}
      <section aria-labelledby="density-heading" className="space-y-4">
        <div>
          <h2 id="density-heading" className="text-base font-bold text-white flex items-center gap-2">
            <Minimize2 className="h-4 w-4 text-blue-400" />
            Interface Density
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Adjust information density, padding, table row height, and card margins across the platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Compact */}
          <button
            type="button"
            role="radio"
            aria-checked={density === 'compact'}
            data-testid="density-compact-btn"
            onClick={() => setDensity('compact')}
            className={cn(
              'flex flex-col p-3 rounded-xl border text-left transition-all',
              density === 'compact'
                ? 'border-blue-500 bg-blue-500/10 shadow-md ring-1 ring-blue-500/50'
                : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-850'
            )}
          >
            {/* Visual Miniature lines */}
            <div className="w-full h-16 rounded-lg bg-slate-950 border border-slate-800 p-2 space-y-1 mb-2.5">
              <div className="h-1.5 w-full rounded bg-slate-700" />
              <div className="h-1.5 w-5/6 rounded bg-slate-800" />
              <div className="h-1.5 w-4/6 rounded bg-slate-800" />
              <div className="h-1.5 w-full rounded bg-slate-800" />
            </div>

            <div className="flex items-center gap-2">
              <div className={cn(
                'h-4 w-4 rounded-full border flex items-center justify-center transition-colors',
                density === 'compact' ? 'border-blue-500 bg-blue-600 text-white' : 'border-slate-600 bg-slate-800'
              )}>
                {density === 'compact' && <Check className="h-2.5 w-2.5 stroke-[3]" />}
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">Compact</span>
                <span className="text-[10px] text-slate-400">High information density, condensed tables</span>
              </div>
            </div>
          </button>

          {/* Comfortable */}
          <button
            type="button"
            role="radio"
            aria-checked={density === 'comfortable'}
            data-testid="density-comfortable-btn"
            onClick={() => setDensity('comfortable')}
            className={cn(
              'flex flex-col p-3 rounded-xl border text-left transition-all',
              density === 'comfortable'
                ? 'border-blue-500 bg-blue-500/10 shadow-md ring-1 ring-blue-500/50'
                : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-850'
            )}
          >
            {/* Visual Miniature lines */}
            <div className="w-full h-16 rounded-lg bg-slate-950 border border-slate-800 p-2 space-y-2 mb-2.5">
              <div className="h-2 w-full rounded bg-slate-700" />
              <div className="h-2 w-4/5 rounded bg-slate-800" />
              <div className="h-2 w-3/5 rounded bg-slate-800" />
            </div>

            <div className="flex items-center gap-2">
              <div className={cn(
                'h-4 w-4 rounded-full border flex items-center justify-center transition-colors',
                density === 'comfortable' ? 'border-blue-500 bg-blue-600 text-white' : 'border-slate-600 bg-slate-800'
              )}>
                {density === 'comfortable' && <Check className="h-2.5 w-2.5 stroke-[3]" />}
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">Comfortable (Default)</span>
                <span className="text-[10px] text-slate-400">Balanced padding and optimal readability</span>
              </div>
            </div>
          </button>

          {/* Spacious */}
          <button
            type="button"
            role="radio"
            aria-checked={density === 'spacious'}
            data-testid="density-spacious-btn"
            onClick={() => setDensity('spacious')}
            className={cn(
              'flex flex-col p-3 rounded-xl border text-left transition-all',
              density === 'spacious'
                ? 'border-blue-500 bg-blue-500/10 shadow-md ring-1 ring-blue-500/50'
                : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-850'
            )}
          >
            {/* Visual Miniature lines */}
            <div className="w-full h-16 rounded-lg bg-slate-950 border border-slate-800 p-2.5 space-y-3 mb-2.5">
              <div className="h-2.5 w-full rounded bg-slate-700" />
              <div className="h-2.5 w-3/5 rounded bg-slate-800" />
            </div>

            <div className="flex items-center gap-2">
              <div className={cn(
                'h-4 w-4 rounded-full border flex items-center justify-center transition-colors',
                density === 'spacious' ? 'border-blue-500 bg-blue-600 text-white' : 'border-slate-600 bg-slate-800'
              )}>
                {density === 'spacious' && <Check className="h-2.5 w-2.5 stroke-[3]" />}
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">Spacious</span>
                <span className="text-[10px] text-slate-400">Generous whitespace for presentations</span>
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* SECTION 5: MOTION */}
      <section aria-labelledby="motion-heading" className="space-y-4">
        <div>
          <h2 id="motion-heading" className="text-base font-bold text-white flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-400" />
            Motion & Transitions
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure animations and visual effects. Respects system prefers-reduced-motion settings.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Full Motion */}
          <button
            type="button"
            role="radio"
            aria-checked={motion === 'full'}
            data-testid="motion-full-btn"
            onClick={() => setMotion('full')}
            className={cn(
              'flex flex-col p-3 rounded-xl border text-left transition-all',
              motion === 'full'
                ? 'border-blue-500 bg-blue-500/10 shadow-md ring-1 ring-blue-500/50'
                : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-850'
            )}
          >
            <div className="flex items-center gap-2">
              <div className={cn(
                'h-4 w-4 rounded-full border flex items-center justify-center transition-colors',
                motion === 'full' ? 'border-blue-500 bg-blue-600 text-white' : 'border-slate-600 bg-slate-800'
              )}>
                {motion === 'full' && <Check className="h-2.5 w-2.5 stroke-[3]" />}
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">Full Motion</span>
                <span className="text-[10px] text-slate-400">Micro-interactions and fluid animations</span>
              </div>
            </div>
          </button>

          {/* Reduced Motion */}
          <button
            type="button"
            role="radio"
            aria-checked={motion === 'reduced'}
            data-testid="motion-reduced-btn"
            onClick={() => setMotion('reduced')}
            className={cn(
              'flex flex-col p-3 rounded-xl border text-left transition-all',
              motion === 'reduced'
                ? 'border-blue-500 bg-blue-500/10 shadow-md ring-1 ring-blue-500/50'
                : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-850'
            )}
          >
            <div className="flex items-center gap-2">
              <div className={cn(
                'h-4 w-4 rounded-full border flex items-center justify-center transition-colors',
                motion === 'reduced' ? 'border-blue-500 bg-blue-600 text-white' : 'border-slate-600 bg-slate-800'
              )}>
                {motion === 'reduced' && <Check className="h-2.5 w-2.5 stroke-[3]" />}
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">Reduced Motion</span>
                <span className="text-[10px] text-slate-400">Minimal animations, snappy transitions</span>
              </div>
            </div>
          </button>

          {/* Off */}
          <button
            type="button"
            role="radio"
            aria-checked={motion === 'off'}
            data-testid="motion-off-btn"
            onClick={() => setMotion('off')}
            className={cn(
              'flex flex-col p-3 rounded-xl border text-left transition-all',
              motion === 'off'
                ? 'border-blue-500 bg-blue-500/10 shadow-md ring-1 ring-blue-500/50'
                : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-850'
            )}
          >
            <div className="flex items-center gap-2">
              <div className={cn(
                'h-4 w-4 rounded-full border flex items-center justify-center transition-colors',
                motion === 'off' ? 'border-blue-500 bg-blue-600 text-white' : 'border-slate-600 bg-slate-800'
              )}>
                {motion === 'off' && <Check className="h-2.5 w-2.5 stroke-[3]" />}
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">Off</span>
                <span className="text-[10px] text-slate-400">Zero transitions, instant rendering</span>
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* SECTION 6: LIVE PREVIEW PANEL */}
      <section aria-labelledby="preview-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 id="preview-heading" className="text-base font-bold text-white flex items-center gap-2">
              <Eye className="h-4 w-4 text-blue-400" />
              Live Workspace Preview
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time demonstration showing current theme, accent palette, density, and animation behavior.
            </p>
          </div>
          <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-800/60 border border-slate-700">
            Density: {density} | Theme: {resolvedTheme}
          </span>
        </div>

        {/* The Live Preview Container */}
        <div
          data-testid="appearance-preview-card"
          className="rounded-2xl border border-slate-800 bg-[#0f131a] p-5 shadow-xl space-y-4 transition-all"
        >
          {/* Preview Card Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <div
                className="h-6 w-6 rounded-md flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: computedAccent.accent, color: computedAccent.foreground }}
              >
                <Layers className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs font-bold text-white tracking-tight">CivicSolve Platform</span>
              <span className="text-[10px] font-mono text-slate-500">SIH26043</span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-semibold tracking-wider"
                style={{
                  backgroundColor: computedAccent.light,
                  color: computedAccent.accent,
                  border: `1px solid ${computedAccent.border}`,
                }}
              >
                <Activity className="h-3 w-3" />
                HIGH PRIORITY
              </span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <MapPin className="h-3 w-3 text-rose-400" />
                Nashik, MH
              </span>
            </div>
          </div>

          {/* Challenge title & summary */}
          <div className="space-y-1.5">
            <h3 className="text-sm sm:text-base font-bold text-white">
              Solar Fluoride Adsorption & Autonomous IoT Water Grid
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated telemetry detects elevated fluoride levels across rural supply bores, triggering automated adsorbent regeneration cycles.
            </p>
          </div>

          {/* Telemetry Bar demonstrating Accent and Motion */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Fluoride Adsorption Target</span>
              <span className="font-semibold text-white">84% Efficiency</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  motion === 'full' && 'animate-pulse'
                )}
                style={{
                  width: '84%',
                  backgroundColor: computedAccent.accent,
                }}
              />
            </div>
          </div>

          {/* Interactive buttons in preview */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <button
              type="button"
              data-testid="preview-primary-btn"
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-transform active:scale-[0.98]"
              style={{
                backgroundColor: computedAccent.accent,
                color: computedAccent.foreground,
              }}
            >
              View Challenge Spec
            </button>

            <button
              type="button"
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 border border-slate-700 bg-slate-800/80 hover:bg-slate-750 transition-colors"
            >
              Telemetry Logs
            </button>

            <div className="ml-auto text-[10px] text-slate-500 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Prisma Persistent</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: RESET TO DEFAULT */}
      <section className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-bold text-white">Reset Appearance Customization</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Restores theme to System, accent to Ocean Blue, density to Comfortable, and motion to Full.
          </p>
        </div>

        <button
          type="button"
          data-testid="reset-appearance-btn"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-750 hover:text-white transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset to Default
        </button>
      </section>
    </div>
  )
}
