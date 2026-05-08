// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

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
    <html lang="en">
      <body className="bg-bg text-white font-body antialiased min-h-screen">
        {children}
      </body>
    </html>
  )
}
