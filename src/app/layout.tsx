import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'
import SessionProvider from '@/components/providers/session-provider'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'CivicSolve — Intelligent Societal Problem-Solving Platform',
  description: 'Connect societal challenges with universities, students, and industry to create measurable impact. SIH26043.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  return (
    <html lang="en" className="dark">
      <body>
        <SessionProvider session={session}>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#1e293b',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#f1f5f9',
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  )
}
