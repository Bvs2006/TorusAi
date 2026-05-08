// app/layout.tsx
import type { Metadata } from 'next'
import { Syne, DM_Sans, DM_Mono } from 'next/font/google'
import './globals.css'

const syne = Syne({ subsets: ['latin'], variable: '--font-display', weight: ['400','600','700','800'] })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-body' })
const dmMono = DM_Mono({ subsets: ['latin'], variable: '--font-mono', weight: ['300','400','500'] })

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <body className="bg-bg text-white font-body antialiased min-h-screen">
        {children}
      </body>
    </html>
  )
}
