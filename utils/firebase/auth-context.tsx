'use client'
// utils/firebase/auth-context.tsx
import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from './client'

interface AuthContextType {
  user: User | null
  profile: any | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({ user: null, profile: null, loading: true })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (u) {
        const snap = await getDoc(doc(db, 'profiles', u.uid))
        setProfile(snap.exists() ? snap.data() : null)
        // Store session cookie for server-side auth
        const token = await u.getIdToken()
        await fetch('/api/auth/session', { method: 'POST', body: JSON.stringify({ token }), headers: { 'Content-Type': 'application/json' } })
      } else {
        setProfile(null)
        await fetch('/api/auth/session', { method: 'DELETE' })
      }
      setLoading(false)
    })
    return () => unsub()
  }, [])

  return <AuthContext.Provider value={{ user, profile, loading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
