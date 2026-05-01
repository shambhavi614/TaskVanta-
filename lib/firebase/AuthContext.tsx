'use client'

import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { User, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)

      // Set auth cookie for middleware
      if (user) {
        document.cookie = `auth-token=${user.uid}; path=/; max-age=604800; SameSite=Lax` // 7 days
      } else {
        document.cookie = 'auth-token=; path=/; max-age=0; SameSite=Lax' // Clear cookie
      }
    })

    return () => unsubscribe()
  }, [])

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({ user, loading }), [user, loading])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
