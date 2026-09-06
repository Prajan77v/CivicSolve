'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface LayoutContextType {
  isAiOpen: boolean
  setAiOpen: (open: boolean) => void
  toggleAi: () => void
  isCommandPaletteOpen: boolean
  setCommandPaletteOpen: (open: boolean) => void
  toggleCommandPalette: () => void
  isMobileSidebarOpen: boolean
  setMobileSidebarOpen: (open: boolean) => void
  toggleMobileSidebar: () => void
  unreadNotificationsCount: number
  setUnreadNotificationsCount: (count: number) => void
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [isAiOpen, setAiOpen] = useState(false)
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(4)

  // Listen for Ctrl+K or Cmd+K globally
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCommandPaletteOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <LayoutContext.Provider
      value={{
        isAiOpen,
        setAiOpen,
        toggleAi: () => setAiOpen((prev) => !prev),
        isCommandPaletteOpen,
        setCommandPaletteOpen,
        toggleCommandPalette: () => setCommandPaletteOpen((prev) => !prev),
        isMobileSidebarOpen,
        setMobileSidebarOpen,
        toggleMobileSidebar: () => setMobileSidebarOpen((prev) => !prev),
        unreadNotificationsCount,
        setUnreadNotificationsCount,
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

export function useLayout() {
  const context = useContext(LayoutContext)
  if (!context) {
    return {
      isAiOpen: false,
      setAiOpen: () => {},
      toggleAi: () => {},
      isCommandPaletteOpen: false,
      setCommandPaletteOpen: () => {},
      toggleCommandPalette: () => {},
      isMobileSidebarOpen: false,
      setMobileSidebarOpen: () => {},
      toggleMobileSidebar: () => {},
      unreadNotificationsCount: 0,
      setUnreadNotificationsCount: () => {},
    }
  }
  return context
}
