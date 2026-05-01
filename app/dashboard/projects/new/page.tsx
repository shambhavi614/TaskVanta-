'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { createProject } from '@/lib/firebase/projects'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { AnimatedContainer } from '@/components/AnimatedContainer'
import { AnimatedButton } from '@/components/AnimatedButton'
import { space, radius, colors, shadows } from '@/lib/cssVars'

export default function NewProjectPage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    setError('')

    const result = await createProject(name.trim(), description.trim())

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    if (result.data) {
      router.push(`/dashboard/projects/${result.data.id}`)
      router.refresh()
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <AnimatedContainer animation="fadeInUp" delay={0.1}>
        <motion.div whileHover={{ x: -4 }}>
          <Link href="/dashboard/projects" style={{
            display: 'inline-flex', alignItems: 'center', gap: space[2],
            color: colors.textMuted, fontSize: 14, textDecoration: 'none',
            marginBottom: space[6], fontWeight: 500,
          }}>
            ← Back to Projects
          </Link>
        </motion.div>
      </AnimatedContainer>

      <AnimatedContainer animation="scaleIn" delay={0.2}>
        <div style={{
          background: colors.bgCard, 
          border: `2px solid ${colors.borderSubtle}`,
          borderRadius: radius.xl, 
          padding: space[8],
          boxShadow: shadows.md,
        }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: space[1], letterSpacing: '-0.02em' }}>Create New Project</h1>
          <p style={{ color: colors.textMuted, fontSize: 15, marginBottom: space[6] }}>
            Create a project and start adding tasks and team members.
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: `${space[3]} ${space[4]}`, borderRadius: radius.md, marginBottom: space[5],
                background: colors.accentRedLight, border: '1px solid rgba(239,68,68,0.3)',
                color: colors.accentRed, fontSize: 14,
              }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              style={{ marginBottom: space[4] }}
            >
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: colors.textSecondary, marginBottom: space[2] }}>
                Project Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Marketing Website"
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              style={{ marginBottom: space[6] }}
            >
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: colors.textSecondary, marginBottom: space[2] }}>
                Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's this project about? (optional)"
                style={{
                  width: '100%', 
                  padding: `${space[3]} ${space[4]}`, 
                  borderRadius: radius.md,
                  background: colors.bgSecondary, 
                  border: `2px solid ${colors.borderSubtle}`,
                  color: colors.textPrimary, 
                  fontSize: 15, 
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                }}
                onFocus={(e) => e.target.style.borderColor = colors.accentGreen}
                onBlur={(e) => e.target.style.borderColor = colors.borderSubtle}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              style={{ display: 'flex', gap: space[3], justifyContent: 'flex-end' }}
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link href="/dashboard/projects" style={{
                  padding: `${space[3]} ${space[5]}`, borderRadius: radius.md, fontSize: 14, fontWeight: 500,
                  color: colors.textSecondary, border: `1px solid ${colors.borderSubtle}`,
                  textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
                  background: colors.bgElevated,
                }}>
                  Cancel
                </Link>
              </motion.div>
              <AnimatedButton
                type="submit"
                disabled={loading || !name.trim()}
                variant="primary"
                size="md"
              >
                {loading ? 'Creating...' : 'Create Project'}
              </AnimatedButton>
            </motion.div>
          </form>
        </div>
      </AnimatedContainer>
    </div>
  )
}
