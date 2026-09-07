import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Toaster } from 'sonner'
import SessionProvider from '@/components/providers/session-provider'
import { AppearanceProvider } from '@/components/providers/appearance-provider'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'CivicSolve — Intelligent Societal Problem-Solving Platform',
  description: 'Connect societal challenges with universities, students, and industry to create measurable impact. SIH26043.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#08090c' },
  ],
}

const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('civicsolve_appearance_settings');
    var settings = stored ? JSON.parse(stored) : null;
    var theme = settings && settings.theme ? settings.theme : 'system';
    var density = settings && settings.density ? settings.density : 'comfortable';
    var motion = settings && settings.motion ? settings.motion : 'full';
    var accentKey = settings && settings.accentKey ? settings.accentKey : 'ocean-blue';
    var customColor = settings && settings.customColor ? settings.customColor : null;

    var isDark = theme === 'dark' || (theme === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    var resolvedTheme = isDark ? 'dark' : 'light';

    var root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-resolved-theme', resolvedTheme);
    root.setAttribute('data-density', density);
    root.setAttribute('data-motion', motion);
    root.style.colorScheme = resolvedTheme;

    var presets = {
      'ocean-blue': '#2563eb',
      'civic-green': '#059669',
      'indigo': '#6366f1',
      'amber': '#d97706',
      'rose': '#e11d48',
      'slate': '#475569'
    };
    var hex = (accentKey === 'custom' && customColor) ? customColor : (presets[accentKey] || '#2563eb');
    var r = parseInt(hex.slice(1, 3), 16) || 37;
    var g = parseInt(hex.slice(3, 5), 16) || 99;
    var b = parseInt(hex.slice(5, 7), 16) || 235;
    var lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    var fg = lum > 0.65 ? '#0f172a' : '#ffffff';

    root.style.setProperty('--accent-color', hex);
    root.style.setProperty('--accent-foreground', fg);
    root.style.setProperty('--accent-light', 'rgba(' + r + ',' + g + ',' + b + ',0.15)');
    root.style.setProperty('--accent-border', 'rgba(' + r + ',' + g + ',' + b + ',0.35)');
  } catch (e) {}
})();
`

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body suppressHydrationWarning>
        <SessionProvider session={session}>
          <AppearanceProvider>
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: 'var(--surface-raised, #1e293b)',
                  border: '1px solid var(--border, rgba(255,255,255,0.1))',
                  color: 'var(--foreground, #f1f5f9)',
                },
              }}
            />
          </AppearanceProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
