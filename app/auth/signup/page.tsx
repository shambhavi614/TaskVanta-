'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signUp, signInWithGoogle } from '@/lib/firebase/auth'
import { createDocument, getDocument, COLLECTIONS } from '@/lib/firebase/firestore'
import { motion } from 'framer-motion'
import { AnimatedContainer } from '@/components/AnimatedContainer'
import { AnimatedButton } from '@/components/AnimatedButton'
import { space } from '@/lib/cssVars'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    const { user, error: signUpError } = await signUp(email, password, fullName)

    if (signUpError) {
      setError(signUpError)
      setLoading(false)
      return
    }

    if (user) {
      await createDocument(
        COLLECTIONS.USERS,
        {
          email: user.email || '',
          fullName: fullName || 'User',
          avatarUrl: null,
        },
        user.uid
      )

      router.push('/dashboard')
      router.refresh()
    }
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    setError('')

    const { user, error } = await signInWithGoogle()

    if (error) {
      setError(error)
      setGoogleLoading(false)
      return
    }

    if (user) {
      const { data: existingProfile } = await getDocument(
        COLLECTIONS.USERS,
        user.uid
      )

      if (!existingProfile) {
        await createDocument(
          COLLECTIONS.USERS,
          {
            email: user.email || '',
            fullName: user.displayName || 'User',
            avatarUrl: user.photoURL || null,
          },
          user.uid
        )
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
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        overflow: 'hidden',
        position: 'relative',

        background: `
          radial-gradient(circle at 10% 20%, rgba(59,130,246,.35), transparent 25%),
          radial-gradient(circle at 85% 15%, rgba(236,72,153,.28), transparent 25%),
          radial-gradient(circle at 70% 80%, rgba(16,185,129,.28), transparent 25%),
          linear-gradient(135deg,#0f172a,#111827,#1e1b4b)
        `,
      }}
    >
      {/* Animated Blobs */}
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        style={{
          position: 'absolute',
          width: 380,
          height: 380,
          borderRadius: '50%',
          background: 'rgba(59,130,246,.18)',
          filter: 'blur(90px)',
          top: -100,
          left: -80,
        }}
      />

      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        style={{
          position: 'absolute',
          width: 360,
          height: 360,
          borderRadius: '50%',
          background: 'rgba(236,72,153,.14)',
          filter: 'blur(90px)',
          bottom: -80,
          right: -70,
        }}
      />

      {/* Card */}
      <AnimatedContainer
        animation="scaleIn"
        delay={0.2}
        style={{
          width: '100%',
          maxWidth: 460,
          padding: 34,
          borderRadius: 26,

          background: 'rgba(255,255,255,.08)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',

          border: '1px solid rgba(255,255,255,.12)',

          boxShadow:
            '0 25px 60px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.08)',

          position: 'relative',
          zIndex: 5,
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ y: -18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1
            style={{
              fontSize: 34,
              fontWeight: 900,
              textAlign: 'center',
              marginBottom: 8,

              background:
                'linear-gradient(90deg,#60a5fa,#a78bfa,#f472b6,#34d399)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Create Account ✨
          </h1>

          <p
            style={{
              textAlign: 'center',
              color: 'rgba(255,255,255,.70)',
              fontSize: 14,
              marginBottom: 28,
            }}
          >
            Join TaskFlow and start smarter work today
          </p>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={{
              padding: 12,
              borderRadius: 14,
              marginBottom: 14,
              background: 'rgba(239,68,68,.12)',
              border: '1px solid rgba(239,68,68,.35)',
              color: '#fca5a5',
              fontSize: 13,
            }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          {[
            {
              label: 'Full Name',
              value: fullName,
              set: setFullName,
              type: 'text',
            },
            {
              label: 'Email',
              value: email,
              set: setEmail,
              type: 'email',
            },
            {
              label: 'Password',
              value: password,
              set: setPassword,
              type: 'password',
            },
          ].map((field, i) => (
            <motion.div
              key={field.label}
              initial={{ x: -25, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.25 + i * 0.12 }}
              style={{ marginBottom: 16 }}
            >
              <label
                style={{
                  display: 'block',
                  marginBottom: 7,
                  fontSize: 13,
                  fontWeight: 700,
                  color: 'rgba(255,255,255,.80)',
                }}
              >
                {field.label}
              </label>

              <input
                type={field.type}
                required
                value={field.value}
                onChange={(e) => field.set(e.target.value)}
                placeholder={`Enter ${field.label}`}
                style={{
                  width: '100%',
                  padding: '14px 15px',
                  borderRadius: 14,

                  background: 'rgba(255,255,255,.06)',
                  border: '1px solid rgba(255,255,255,.12)',

                  color: '#fff',
                  fontSize: 14,
                  outline: 'none',
                  transition: '0.3s',
                }}
                onFocus={(e) => {
                  e.target.style.border =
                    '1px solid rgba(96,165,250,.75)'
                  e.target.style.boxShadow =
                    '0 0 0 4px rgba(59,130,246,.12)'
                }}
                onBlur={(e) => {
                  e.target.style.border =
                    '1px solid rgba(255,255,255,.12)'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </motion.div>
          ))}

          {/* Button */}
          <AnimatedButton
            type="submit"
            disabled={loading || googleLoading}
            style={{
              width: '100%',
              marginTop: 8,
              background:
                'linear-gradient(135deg,#3b82f6,#8b5cf6,#ec4899)',
              color: '#fff',
              borderRadius: 14,
              fontWeight: 800,
              boxShadow: '0 15px 35px rgba(139,92,246,.35)',
            }}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
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
            <div
              style={{
                flex: 1,
                height: 1,
                background: 'rgba(255,255,255,.10)',
              }}
            />
            <span
              style={{
                fontSize: 12,
                color: 'rgba(255,255,255,.55)',
              }}
            >
              OR
            </span>
            <div
              style={{
                flex: 1,
                height: 1,
                background: 'rgba(255,255,255,.10)',
              }}
            />
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading || googleLoading}
            style={{
              width: '100%',
              padding: 14,
              borderRadius: 14,

              background: 'rgba(255,255,255,.06)',
              border: '1px solid rgba(255,255,255,.12)',

              color: '#fff',
              fontWeight: 700,
              cursor: 'pointer',
              transition: '.3s',
            }}
          >
            🔵 {googleLoading ? 'Signing up...' : 'Continue with Google'}
          </button>

          {/* Footer */}
          <p
            style={{
              textAlign: 'center',
              marginTop: 18,
              fontSize: 13,
              color: 'rgba(255,255,255,.65)',
            }}
          >
            Already have an account?{' '}
            <Link
              href="/auth/login"
              style={{
                color: '#60a5fa',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Sign in
            </Link>
          </p>
        </form>
      </AnimatedContainer>
    </div>
  )
}