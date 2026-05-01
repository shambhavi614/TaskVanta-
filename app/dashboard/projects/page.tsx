'use client'

export const dynamic = 'force-dynamic'

import { space, radius, colors, shadows } from '@/lib/cssVars'

import { useState, useEffect, memo } from 'react'
import { getProjects } from '@/lib/firebase/projects'
import { useAuth } from '@/lib/firebase/AuthContext'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { AnimatedContainer } from '@/components/AnimatedContainer'
import { AnimatedButton } from '@/components/AnimatedButton'

// Memoized project card component
const ProjectCard = memo(({ project, index }: { project: any; index: number }) => {
  const progress = project.task_count > 0
    ? Math.round((project.done_count / project.task_count) * 100)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.15 + index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{
        y: -10,
        scale: 1.02,
        rotateX: 2,
        boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
      }}
      style={{ perspective: 1000 }}
    >
      <Link
        href={`/dashboard/projects/${project.id}`}
        style={{
          background: 'linear-gradient(145deg, #0f172a, #111827)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: radius.lg,
          padding: space[5],
          textDecoration: 'none',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          backdropFilter: 'blur(12px)',
          transition: 'all 0.3s ease',
        }}
      >
        {/* glow background */}
        <div style={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 120,
          height: 120,
          background: 'radial-gradient(circle, rgba(59,130,246,0.25), transparent 70%)',
          filter: 'blur(20px)',
        }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: space[3] }}>
          <h3 style={{
            fontSize: 18,
            fontWeight: 800,
            color: '#fff',
            letterSpacing: '-0.02em',
            flex: 1,
          }}>
            {project.name}
          </h3>

          <span style={{
            fontSize: 10,
            fontWeight: 800,
            padding: '6px 12px',
            borderRadius: 999,
            background: project.user_role === 'admin'
              ? 'rgba(168,85,247,0.15)'
              : 'rgba(59,130,246,0.15)',
            color: project.user_role === 'admin' ? '#c084fc' : '#60a5fa',
            border: '1px solid rgba(255,255,255,0.1)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            {project.user_role}
          </span>
        </div>

        {project.description && (
          <p style={{
            fontSize: 14,
            color: 'rgba(255,255,255,0.65)',
            marginBottom: space[4],
            lineHeight: 1.6,
          }}>
            {project.description}
          </p>
        )}

        <div style={{ marginTop: 'auto' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: space[2],
            fontSize: 12,
            color: 'rgba(255,255,255,0.6)',
            fontWeight: 600,
          }}>
            <span>{project.task_count} tasks</span>
            <span>{progress}% complete</span>
          </div>

          <div style={{
            height: 8,
            borderRadius: 999,
            background: 'rgba(255,255,255,0.08)',
            overflow: 'hidden',
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.3 + index * 0.08 }}
              style={{
                height: '100%',
                borderRadius: 999,
                background: 'linear-gradient(90deg,#22c55e,#3b82f6,#8b5cf6)',
              }}
            />
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: space[2],
            marginTop: space[3],
            fontSize: 12,
            color: 'rgba(255,255,255,0.6)',
          }}>
            <span>👥 {project.member_count} members</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
})

ProjectCard.displayName = 'ProjectCard'

export default function ProjectsPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!user) return
      const data = await getProjects()
      setProjects(data)
      setLoading(false)
    }

    if (user) load()
  }, [user])

  if (loading) {
    return (
      <div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            width: 240,
            height: 36,
            borderRadius: radius.md,
            background: 'rgba(255,255,255,0.08)',
            marginBottom: space[8],
          }}
        />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: space[4],
        }}>
          {[1, 2, 3].map(i => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              style={{
                height: 220,
                borderRadius: radius.lg,
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <AnimatedContainer animation="fadeInUp" delay={0.1}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: space[8],
          flexWrap: 'wrap',
          gap: space[4],
        }}>
          <div>
            <h1 style={{
              fontSize: 34,
              fontWeight: 900,
              background: 'linear-gradient(90deg,#22c55e,#3b82f6,#8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Projects
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15 }}>
              Manage your projects and collaborate with your team.
            </p>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/dashboard/projects/new" style={{
              padding: '14px 28px',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              color: '#000',
              background: 'linear-gradient(90deg,#22c55e,#3b82f6)',
              textDecoration: 'none',
              boxShadow: '0 10px 30px rgba(34,197,94,0.3)',
            }}>
              + New Project
            </Link>
          </motion.div>
        </div>
      </AnimatedContainer>

      {projects.length === 0 ? (
        <AnimatedContainer animation="scaleIn" delay={0.3}>
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: 20,
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{ fontSize: 56, marginBottom: 20 }}
            >
              📁
            </motion.div>

            <h3 style={{ fontSize: 20, fontWeight: 800 }}>No projects yet</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 20 }}>
              Create your first project to get started.
            </p>
          </div>
        </AnimatedContainer>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: space[4],
        }}>
          {projects.map((project: any, i: number) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}