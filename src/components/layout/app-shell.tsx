'use client'

import React from 'react'
import Sidebar from './sidebar'
import Navbar from './navbar'
import AIAssistant from '@/components/ai/ai-assistant'
import CommandPalette from '@/components/search/command-palette'
import BottomNav from './bottom-nav'
import { LayoutProvider } from './layout-context'

interface AppShellProps {
  children: React.ReactNode
}

function AppShellContent({ children }: AppShellProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#08090c] text-slate-100 selection:bg-blue-600/30 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col lg:pl-60 min-h-screen">
        {/* Top Navbar */}
        <Navbar />

        {/* Main View Area */}
        <main className="flex-1 px-3 py-4 sm:px-6 md:py-8 max-w-7xl w-full mx-auto pb-24 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav />

      {/* Global AI Assistant Sliding Drawer */}
      <AIAssistant />

      {/* Global Command Palette (Ctrl + K) */}
      <CommandPalette />
    </div>
  )
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <LayoutProvider>
      <AppShellContent>{children}</AppShellContent>
    </LayoutProvider>
  )
}
export { AppShell }
