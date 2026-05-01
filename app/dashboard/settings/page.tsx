'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/firebase/AuthContext'
import { getDocument, updateDocument, COLLECTIONS } from '@/lib/firebase/firestore'
import { updateProfile } from 'firebase/auth'
import { motion } from 'framer-motion'
import { AnimatedContainer } from '@/components/AnimatedContainer'
import { AnimatedButton } from '@/components/AnimatedButton'
import { space, radius, colors, shadows } from '@/lib/cssVars'

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    let mounted = true

    async function load() {
      if (!user) { router.push('/auth/login'); return }
      if (!mounted) return

      setEmail(user.email || '')
      setFullName(user.displayName || '')

      // Also load from Firestore
      const { data: profile } = await getDocument(COLLECTIONS.USERS, user.uid)
      if (profile && mounted) {
        setFullName(profile.fullName || '')
      }

      if (mounted) setLoading(false)
    }

    if (user) load()
  }, [user, router])

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user) return

    setSaving(true)
    setError('')
    setSuccess(false)

    try {
      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: fullName
      })

      // Update Firestore profile
      const { error: updateError } = await updateDocument(COLLECTIONS.USERS, user.uid, {
        fullName
      })

      if (updateError) {
        setError(updateError)
      } else {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message)
    }

    setSaving(false)
  }

  if (loading) {
    return (
      <div style={{ maxWidth: 500, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ width: 120, height: 24, borderRadius: radius.sm, background: colors.bgCard, marginBottom: space[8] }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{ height: 300, borderRadius: radius.lg, background: colors.bgCard }}
        />
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <AnimatedContainer animation="fadeInUp" delay={0.1}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: space[1], letterSpacing: '-0.02em' }}>Settings</h1>
        <p style={{ color: colors.textMuted, fontSize: 15, marginBottom: space[8] }}>
          Manage your account settings
        </p>
      </AnimatedContainer>

      <AnimatedContainer animation="fadeInUp" delay={0.2}>
        <div style={{
          background: colors.bgCard, 
          border: `2px solid ${colors.borderSubtle}`,
          borderRadius: radius.lg, 
          padding: space[6], 
          marginBottom: space[4],
          boxShadow: shadows.sm,
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: space[5], letterSpacing: '-0.01em' }}>Profile</h2>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: `${space[3]} ${space[4]}`, borderRadius: radius.md, marginBottom: space[4],
                background: colors.accentRedLight, border: '1px solid rgba(239,68,68,0.3)',
                color: colors.accentRed, fontSize: 14,
              }}
            >{error}</motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: `${space[3]} ${space[4]}`, borderRadius: radius.md, marginBottom: space[4],
                background: colors.accentGreenLight, border: '1px solid rgba(16,185,129,0.3)',
                color: colors.accentGreen, fontSize: 14,
              }}
            >Profile updated!</motion.div>
          )}

          <form onSubmit={handleSave}>
            <div style={{ marginBottom: space[4] }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: colors.textSecondary, marginBottom: space[2] }}>
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{
                  width: '100%', 
                  padding: `${space[3]} ${space[4]}`, 
                  borderRadius: radius.md,
                  background: colors.bgSecondary, 
                  border: `2px solid ${colors.borderSubtle}`,
                  color: colors.textPrimary, 
                  fontSize: 15,
                  outline: 'none',
                  transition: 'all 0.2s ease',
                }}
                onFocus={(e) => e.target.style.borderColor = colors.accentGreen}
                onBlur={(e) => e.target.style.borderColor = colors.borderSubtle}
              />
            </div>

            <div style={{ marginBottom: space[5] }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: colors.textSecondary, marginBottom: space[2] }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                disabled
                style={{
                  width: '100%', 
                  padding: `${space[3]} ${space[4]}`, 
                  borderRadius: radius.md,
                  background: colors.bgPrimary, 
                  border: `2px solid ${colors.borderSubtle}`,
                  color: colors.textMuted, 
                  fontSize: 15, 
                  cursor: 'not-allowed',
                }}
              />
              <p style={{ fontSize: 12, color: colors.textMuted, marginTop: space[1] }}>
                Email cannot be changed
              </p>
            </div>

            <AnimatedButton
              type="submit"
              disabled={saving}
              variant="primary"
              size="lg"
              style={{ width: '100%' }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </AnimatedButton>
          </form>
        </div>
      </AnimatedContainer>

      <AnimatedContainer animation="fadeInUp" delay={0.3}>
        <div style={{
          background: colors.bgCard, 
          border: `2px solid ${colors.borderSubtle}`,
          borderRadius: radius.lg, 
          padding: space[6],
          boxShadow: shadows.sm,
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: space[3], letterSpacing: '-0.01em' }}>Account</h2>
          <div style={{ fontSize: 14, color: colors.textMuted }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: `${space[2]} 0`, borderBottom: `1px solid ${colors.borderSubtle}` }}>
              <span>Status</span>
              <span style={{ color: colors.accentGreen, fontWeight: 600 }}>Active</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: `${space[2]} 0` }}>
              <span>Email Verified</span>
              <span style={{ color: user?.emailVerified ? colors.accentGreen : colors.accentOrange, fontWeight: 600 }}>
                {user?.emailVerified ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>
      </AnimatedContainer>
    </div>
  )
}
