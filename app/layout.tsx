// app/layout.tsx
import type { Metadata } from 'next'
import { DM_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-body' })
const jetBrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', weight: ['400', '500'] })

export const metadata: Metadata = {
  title: 'Torus AI — Build anything. Ship everything.',
  description: 'AI-powered project planning. Get the exact tools, architecture, and prompts to build your idea — phase by phase.',
  keywords: ['AI', 'project planning', 'build plans', 'developer tools', 'prompts'],
  openGraph: {
    title: 'Torus AI',
    description: 'Build anything. Ship everything.',
    type: 'website',
  },
}

import ThemeProvider from '@/components/ThemeProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${jetBrainsMono.variable}`}>
      <body className="bg-bg text-text font-body antialiased min-h-screen theme-transition">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
