'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn, signInWithGoogle } from '@/lib/firebase/auth'
import { createDocument, getDocument, COLLECTIONS } from '@/lib/firebase/firestore'
import { motion } from 'framer-motion'
import { AnimatedContainer } from '@/components/AnimatedContainer'
import { AnimatedButton } from '@/components/AnimatedButton'
import { space, radius, colors, shadows } from '@/lib/cssVars'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { user, error: signInError } = await signIn(email, password)

    if (signInError) {
      setError(signInError)
      setLoading(false)
      return
    }

    if (user) {
      router.push('/dashboard')
      router.refresh()
    }
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    setError('')

    const { user, error: signInError } = await signInWithGoogle()

    if (signInError) {
      setError(signInError)
      setGoogleLoading(false)
      return
    }

    if (user) {
      const { data: existingProfile } = await getDocument(COLLECTIONS.USERS, user.uid)

      if (!existingProfile) {
        await createDocument(COLLECTIONS.USERS, {
          email: user.email || '',
          fullName: user.displayName || 'User',
          avatarUrl: user.photoURL || null,
        }, user.uid)
      }

      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: space[5],
        position: 'relative',
        overflow: 'hidden',

        background: `
          radial-gradient(circle at 10% 20%, rgba(59,130,246,0.18), transparent 28%),
          radial-gradient(circle at 90% 80%, rgba(168,85,247,0.18), transparent 28%),
          radial-gradient(circle at 50% 0%, rgba(16,185,129,0.12), transparent 25%),
          linear-gradient(135deg,#f8fafc,#eef2ff,#ffffff)
        `,
      }}
    >
      {/* Floating Glow Balls */}
      <motion.div
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 6 }}
        style={{
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(59,130,246,0.15)',
          filter: 'blur(90px)',
          top: -80,
          left: -80,
        }}
      />

      <motion.div
        animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 7 }}
        style={{
          position: 'absolute',
          width: 280,
          height: 280,
          borderRadius: '50%',
          background: 'rgba(139,92,246,0.14)',
          filter: 'blur(90px)',
          bottom: -80,
          right: -80,
        }}
      />

      {/* Card */}
      <AnimatedContainer
        animation="scaleIn"
        delay={0.2}
        style={{
          width: '100%',
          maxWidth: 460,
          padding: space[8],
          borderRadius: 28,
          position: 'relative',
          zIndex: 2,

          background: 'rgba(255,255,255,0.75)',
          backdropFilter: 'blur(22px)',
          WebkitBackdropFilter: 'blur(22px)',

          border: '1px solid rgba(255,255,255,0.7)',
          boxShadow: '0 25px 80px rgba(15,23,42,0.12)',
        }}
      >
        {/* Top Glow Border */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 28,
            padding: 1,
            background:
              'linear-gradient(135deg,rgba(59,130,246,0.35),rgba(139,92,246,0.25),rgba(16,185,129,0.25))',
            WebkitMask:
              'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            pointerEvents: 'none',
          }}
        />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            style={{
              width: 62,
              height: 62,
              borderRadius: 18,
              margin: '0 auto 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              fontWeight: 800,
              color: '#fff',
              background: 'linear-gradient(135deg,#2563eb,#8b5cf6,#10b981)',
              boxShadow: '0 18px 35px rgba(37,99,235,0.22)',
            }}
          >
            T
          </div>

          <h1
            style={{
              fontSize: 32,
              fontWeight: 900,
              textAlign: 'center',
              marginBottom: 8,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(90deg,#2563eb,#8b5cf6,#10b981)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Welcome Back 👋
          </h1>

          <p
            style={{
              textAlign: 'center',
              fontSize: 14,
              color: '#64748b',
              marginBottom: 30,
            }}
          >
            Login to continue managing your projects
          </p>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: 12,
              borderRadius: 14,
              marginBottom: 18,
              background: '#fff1f2',
              border: '1px solid #fecdd3',
              color: '#e11d48',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{ marginBottom: 16 }}
          >
            <label
              style={{
                display: 'block',
                fontSize: 13,
                color: '#334155',
                marginBottom: 6,
                fontWeight: 700,
              }}
            >
              Email Address
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: '100%',
                padding: '14px 15px',
                borderRadius: 14,
                background: '#ffffff',
                border: '1px solid #dbeafe',
                fontSize: 14,
                color: '#0f172a',
                outline: 'none',
                transition: '0.25s',
                boxShadow: '0 3px 10px rgba(0,0,0,0.03)',
              }}
              onFocus={(e) => {
                e.target.style.border = '1px solid #3b82f6'
                e.target.style.boxShadow = '0 0 0 4px rgba(59,130,246,0.12)'
              }}
              onBlur={(e) => {
                e.target.style.border = '1px solid #dbeafe'
                e.target.style.boxShadow = '0 3px 10px rgba(0,0,0,0.03)'
              }}
            />
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            style={{ marginBottom: 16 }}
          >
            <label
              style={{
                display: 'block',
                fontSize: 13,
                color: '#334155',
                marginBottom: 6,
                fontWeight: 700,
              }}
            >
              Password
            </label>

            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              style={{
                width: '100%',
                padding: '14px 15px',
                borderRadius: 14,
                background: '#ffffff',
                border: '1px solid #ede9fe',
                fontSize: 14,
                color: '#0f172a',
                outline: 'none',
                transition: '0.25s',
                boxShadow: '0 3px 10px rgba(0,0,0,0.03)',
              }}
              onFocus={(e) => {
                e.target.style.border = '1px solid #8b5cf6'
                e.target.style.boxShadow = '0 0 0 4px rgba(139,92,246,0.12)'
              }}
              onBlur={(e) => {
                e.target.style.border = '1px solid #ede9fe'
                e.target.style.boxShadow = '0 3px 10px rgba(0,0,0,0.03)'
              }}
            />
          </motion.div>

          {/* Sign In */}
          <AnimatedButton
            type="submit"
            disabled={loading || googleLoading}
            style={{
              width: '100%',
              marginTop: 10,
              background: 'linear-gradient(135deg,#2563eb,#8b5cf6)',
              color: '#fff',
              fontWeight: 800,
              borderRadius: 14,
              boxShadow: '0 18px 35px rgba(59,130,246,0.22)',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </AnimatedButton>

          {/* Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              margin: '18px 0',
            }}
          >
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
            <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>
              OR
            </span>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
          </div>

          {/* Google */}
          <motion.button
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading || googleLoading}
            style={{
              width: '100%',
              padding: 13,
              borderRadius: 14,
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              color: '#0f172a',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(0,0,0,0.04)',
            }}
          >
            🔵 {googleLoading ? 'Signing in...' : 'Continue with Google'}
          </motion.button>

          {/* Footer */}
          <p
            style={{
              textAlign: 'center',
              marginTop: 20,
              fontSize: 13,
              color: '#64748b',
            }}
          >
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/signup"
              style={{
                color: '#2563eb',
                fontWeight: 800,
                textDecoration: 'none',
              }}
            >
              Sign up
            </Link>
          </p>
        </form>
      </AnimatedContainer>
    </div>
  )
}