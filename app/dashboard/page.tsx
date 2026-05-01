'use client'

export const dynamic = 'force-dynamic'

import { space, radius, colors, shadows } from '@/lib/cssVars'

import { useState, useEffect, useMemo, memo } from 'react'
import { getDashboardStats } from '@/lib/firebase/tasks'
import { getProjects } from '@/lib/firebase/projects'
import { useAuth } from '@/lib/firebase/AuthContext'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { AnimatedContainer } from '@/components/AnimatedContainer'

// Memoized stat card component
const StatCard = memo(({ stat, index }: { stat: any; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 25, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.45, delay: 0.15 + index * 0.08 }}
    whileHover={{
      y: -8,
      scale: 1.02,
      boxShadow: '0 18px 45px rgba(0,0,0,0.18)',
    }}
    style={{
      background: 'linear-gradient(145deg, rgba(255,255,255,0.96), rgba(247,250,252,0.92))',
      border: '1px solid rgba(255,255,255,0.55)',
      borderRadius: radius.lg,
      padding: space[5],
      transition: 'all 0.25s ease',
      boxShadow: '0 10px 28px rgba(0,0,0,0.08)',
      backdropFilter: 'blur(12px)',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        position: 'absolute',
        top: -30,
        right: -30,
        width: 90,
        height: 90,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${stat.color}25, transparent 70%)`,
      }}
    />

    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: space[3],
        position: 'relative',
        zIndex: 2,
      }}
    >
      <span
        style={{
          fontSize: 12,
          color: colors.textMuted,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        {stat.label}
      </span>

      <motion.span
        whileHover={{ rotate: 8, scale: 1.08 }}
        style={{
          width: 38,
          height: 38,
          borderRadius: 14,
          background: `linear-gradient(135deg, ${stat.color}22, ${stat.color}08)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          color: stat.color,
          fontWeight: 700,
          border: `1px solid ${stat.color}33`,
          boxShadow: `0 6px 18px ${stat.color}22`,
        }}
      >
        {stat.icon}
      </motion.span>
    </div>

    <motion.div
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{
        duration: 0.45,
        delay: 0.22 + index * 0.08,
        type: 'spring',
        stiffness: 180,
      }}
      style={{
        fontSize: 38,
        fontWeight: 900,
        color: stat.color,
        letterSpacing: '-0.03em',
        position: 'relative',
        zIndex: 2,
      }}
    >
      {stat.value}
    </motion.div>
  </motion.div>
))

StatCard.displayName = 'StatCard'

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    todoTasks: 0,
    inProgressTasks: 0,
    doneTasks: 0,
    overdueTasks: 0,
  })
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!user) return

      const [statsData, projectsData] = await Promise.all([
        getDashboardStats(),
        getProjects(),
      ])

      setStats(statsData)
      setProjects(projectsData)
      setLoading(false)
    }

    if (user) load()
  }, [user])

  const recentProjects = useMemo(() => projects.slice(0, 4), [projects])

  const statCards = useMemo(
    () => [
      {
        label: 'Total Projects',
        value: stats.totalProjects,
        color: colors.accentBlue,
        icon: '◫',
      },
      {
        label: 'Total Tasks',
        value: stats.totalTasks,
        color: colors.accentGreen,
        icon: '✓',
      },
      {
        label: 'In Progress',
        value: stats.inProgressTasks,
        color: colors.accentOrange,
        icon: '◎',
      },
      {
        label: 'Overdue',
        value: stats.overdueTasks,
        color: colors.accentRed,
        icon: '!',
      },
    ],
    [stats]
  )

  const handleExportData = () => {
    try {
      const csvRows = []

      csvRows.push('Dashboard Report')
      csvRows.push(`Generated: ${new Date().toLocaleString()}`)
      csvRows.push(`User: ${user?.email || 'Unknown'}`)
      csvRows.push('')

      csvRows.push('STATISTICS SUMMARY')
      csvRows.push('Metric,Value')
      csvRows.push(`Total Projects,${stats.totalProjects}`)
      csvRows.push(`Total Tasks,${stats.totalTasks}`)
      csvRows.push(`To Do Tasks,${stats.todoTasks}`)
      csvRows.push(`In Progress Tasks,${stats.inProgressTasks}`)
      csvRows.push(`Done Tasks,${stats.doneTasks}`)
      csvRows.push(`Overdue Tasks,${stats.overdueTasks}`)
      csvRows.push('')

      csvRows.push('PROJECTS LIST')
      csvRows.push('Project Name,Total Tasks,Members')

      projects.forEach((project) => {
        csvRows.push(
          `"${project.name}",${project.task_count || 0},${
            project.member_count || 0
          }`
        )
      })

      const csvContent = csvRows.join('\n')
      const blob = new Blob([csvContent], {
        type: 'text/csv;charset=utf-8;',
      })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)

      link.setAttribute('href', url)
      link.setAttribute(
        'download',
        `dashboard-report-${new Date().toISOString().split('T')[0]}.csv`
      )
      link.style.visibility = 'hidden'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export data. Please try again.')
    }
  }

  if (loading) {
    return (
      <div>
        <div
          style={{
            width: 280,
            height: 36,
            borderRadius: radius.md,
            background: '#edf2f7',
            marginBottom: space[8],
          }}
        />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(220px, 1fr))',
            gap: space[4],
            marginBottom: space[8],
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                repeat: Infinity,
                duration: 1.2,
                delay: i * 0.15,
              }}
              style={{
                height: 130,
                borderRadius: radius.lg,
                background: '#edf2f7',
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Welcome */}
      <AnimatedContainer animation="fadeInUp" delay={0.1}>
        <div
          style={{
            marginBottom: space[8],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: space[4],
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 34,
                fontWeight: 900,
                marginBottom: space[1],
                letterSpacing: '-0.03em',
                background:
                  'linear-gradient(90deg,#0f172a,#2563eb,#10b981)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Welcome back, {user?.displayName || 'User'} 👋
            </h1>

            <p
              style={{
                color: colors.textMuted,
                fontSize: 15,
              }}
            >
              Here's an overview of your projects and tasks.
            </p>
          </div>

          <motion.button
            whileHover={{
              scale: 1.04,
              y: -2,
              boxShadow: '0 14px 30px rgba(16,185,129,0.25)',
            }}
            whileTap={{ scale: 0.96 }}
            onClick={handleExportData}
            style={{
              padding: '12px 22px',
              background:
                'linear-gradient(135deg,#10b981,#059669)',
              color: '#fff',
              border: 'none',
              borderRadius: 14,
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: space[2],
            }}
          >
            <span>📥</span> Export Data
          </motion.button>
        </div>
      </AnimatedContainer>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(220px, 1fr))',
          gap: space[4],
          marginBottom: space[8],
        }}
      >
        {statCards.map((s, i) => (
          <StatCard key={s.label} stat={s} index={i} />
        ))}
      </div>

      {/* Task Status Breakdown */}
      {stats.totalTasks > 0 && (
        <AnimatedContainer animation="fadeInUp" delay={0.6}>
          <div
            style={{
              background:
                'linear-gradient(145deg,#ffffff,#f8fafc)',
              border: '1px solid rgba(255,255,255,0.6)',
              borderRadius: radius.lg,
              padding: space[5],
              marginBottom: space[8],
              boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
            }}
          >
            <h2
              style={{
                fontSize: 18,
                fontWeight: 800,
                marginBottom: space[4],
              }}
            >
              Task Breakdown
            </h2>

            <div
              style={{
                display: 'flex',
                gap: 4,
                height: 14,
                borderRadius: 999,
                overflow: 'hidden',
                marginBottom: space[3],
                background: '#edf2f7',
              }}
            >
              {stats.doneTasks > 0 && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      (stats.doneTasks / stats.totalTasks) * 100
                    }%`,
                  }}
                  transition={{ duration: 0.7 }}
                  style={{
                    background:
                      'linear-gradient(90deg,#10b981,#34d399)',
                  }}
                />
              )}

              {stats.inProgressTasks > 0 && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      (stats.inProgressTasks / stats.totalTasks) *
                      100
                    }%`,
                  }}
                  transition={{ duration: 0.8 }}
                  style={{
                    background:
                      'linear-gradient(90deg,#f59e0b,#fbbf24)',
                  }}
                />
              )}

              {stats.todoTasks > 0 && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      (stats.todoTasks / stats.totalTasks) * 100
                    }%`,
                  }}
                  transition={{ duration: 0.9 }}
                  style={{
                    background:
                      'linear-gradient(90deg,#94a3b8,#cbd5e1)',
                  }}
                />
              )}
            </div>

            <div
              style={{
                display: 'flex',
                gap: space[5],
                fontSize: 13,
                color: colors.textMuted,
                flexWrap: 'wrap',
              }}
            >
              <span>🟢 Done ({stats.doneTasks})</span>
              <span>🟠 In Progress ({stats.inProgressTasks})</span>
              <span>⚪ To Do ({stats.todoTasks})</span>
            </div>
          </div>
        </AnimatedContainer>
      )}

      {/* Bottom Grid */}
      <div className="dashboard-grid">
        <AnimatedContainer animation="fadeInUp" delay={0.7}>
          <div
            style={{
              background:
                'linear-gradient(145deg,#ffffff,#f8fafc)',
              borderRadius: radius.lg,
              padding: space[5],
              boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: space[4],
              }}
            >
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                }}
              >
                Recent Projects
              </h2>

              <Link
                href="/dashboard/projects"
                style={{
                  fontSize: 13,
                  color: colors.accentGreen,
                  textDecoration: 'none',
                  fontWeight: 700,
                }}
              >
                View all →
              </Link>
            </div>

            {recentProjects.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: `${space[8]} 0`,
                  color: colors.textMuted,
                  fontSize: 14,
                }}
              >
                No projects yet.
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: space[3],
                }}
              >
                {recentProjects.map((p: any, i: number) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.7 + i * 0.08,
                    }}
                    whileHover={{
                      x: 6,
                      scale: 1.01,
                    }}
                  >
                    <Link
                      href={`/dashboard/projects/${p.id}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: `${space[3]} ${space[4]}`,
                        borderRadius: 14,
                        background: '#f8fafc',
                        textDecoration: 'none',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 15,
                            fontWeight: 700,
                            color: colors.textPrimary,
                          }}
                        >
                          {p.name}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: colors.textMuted,
                          }}
                        >
                          {p.task_count} tasks ·{' '}
                          {p.member_count} members
                        </div>
                      </div>

                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: '5px 10px',
                          borderRadius: 999,
                          background:
                            p.user_role === 'admin'
                              ? '#ede9fe'
                              : '#dbeafe',
                          color:
                            p.user_role === 'admin'
                              ? '#7c3aed'
                              : '#2563eb',
                        }}
                      >
                        {p.user_role}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </AnimatedContainer>

        <AnimatedContainer animation="fadeInUp" delay={0.8}>
          <div
            style={{
              background:
                'linear-gradient(145deg,#ffffff,#f8fafc)',
              borderRadius: radius.lg,
              padding: space[5],
              boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
            }}
          >
            <h2
              style={{
                fontSize: 18,
                fontWeight: 800,
                marginBottom: space[4],
              }}
            >
              Quick Actions
            </h2>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: space[3],
              }}
            >
              {[
                {
                  href: '/dashboard/projects/new',
                  label: 'New Project',
                  icon: '+',
                  bg: 'linear-gradient(135deg,#10b981,#059669)',
                  color: '#fff',
                },
                {
                  href: '/dashboard/projects',
                  label: 'Browse Projects',
                  icon: '◫',
                  bg: '#f8fafc',
                  color: '#0f172a',
                },
                {
                  href: '/dashboard/settings',
                  label: 'Settings',
                  icon: '⚙',
                  bg: '#f8fafc',
                  color: '#0f172a',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{
                    scale: 1.03,
                    y: -2,
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    href={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: space[3],
                      padding: `${space[4]} ${space[4]}`,
                      borderRadius: 14,
                      background: item.bg,
                      textDecoration: 'none',
                      fontSize: 14,
                      fontWeight: 700,
                      color: item.color,
                      border:
                        item.bg === '#f8fafc'
                          ? '1px solid #e2e8f0'
                          : 'none',
                    }}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedContainer>
      </div>
    </div>
  )
}