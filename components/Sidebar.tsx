'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { space, radius, colors } from '@/lib/cssVars'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: '⬡' },
  { name: 'Projects', href: '/dashboard/projects', icon: '◫' },
  { name: 'Settings', href: '/dashboard/settings', icon: '⚙' },
]

interface SidebarProps {
  onClose?: () => void
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: 270,
        zIndex: 50,

        /* 🌈 PREMIUM LIGHT GRADIENT */
        background: `
          linear-gradient(180deg,#ffffff 0%,#f8fafc 35%,#eef2ff 100%)
        `,

        backdropFilter: 'blur(18px)',
        borderRight: '1px solid rgba(255,255,255,0.8)',
        boxShadow: '14px 0 45px rgba(15,23,42,0.08)',

        display: 'flex',
        flexDirection: 'column',
        padding: `${space[6]} ${space[3]}`,
        overflow: 'hidden',
      }}
    >
      {/* Floating Background Glow */}
      <div
        style={{
          position: 'absolute',
          top: -80,
          left: -60,
          width: 220,
          height: 220,
          borderRadius: '50%',
          background: 'rgba(59,130,246,0.14)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: -80,
          right: -60,
          width: 220,
          height: 220,
          borderRadius: '50%',
          background: 'rgba(139,92,246,0.14)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      {/* HEADER */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: space[10],
          position: 'relative',
          zIndex: 2,
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55 }}
        >
          <Link
            href="/dashboard"
            style={{
              fontSize: 24,
              fontWeight: 900,
              textDecoration: 'none',

              background:
                'linear-gradient(90deg,#2563eb,#8b5cf6,#10b981)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',

              display: 'flex',
              alignItems: 'center',
              gap: space[2],
              letterSpacing: '-0.03em',
            }}
          >
            TaskVanta
          </Link>
        </motion.div>

        {onClose && (
          <button
            onClick={onClose}
            className="mobile-close-btn"
            style={{
              display: 'none',
              padding: space[2],
              borderRadius: radius.md,
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              color: '#334155',
              cursor: 'pointer',
              fontSize: 16,
              boxShadow: '0 6px 14px rgba(0,0,0,0.06)',
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* NAV */}
      <nav
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: space[2],
          flex: 1,
          position: 'relative',
          zIndex: 2,
        }}
      >
        {navItems.map((item, i) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href))

          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.08 + i * 0.08 }}
              whileHover={{ x: 6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={item.href}
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: space[3],

                  padding: `${space[3]} ${space[4]}`,
                  borderRadius: 16,

                  fontSize: 15,
                  fontWeight: 700,
                  textDecoration: 'none',

                  color: isActive ? '#0f172a' : '#475569',

                  background: isActive
                    ? 'linear-gradient(135deg,#dbeafe,#ede9fe,#dcfce7)'
                    : 'rgba(255,255,255,0.72)',

                  border: isActive
                    ? '1px solid rgba(99,102,241,0.22)'
                    : '1px solid rgba(226,232,240,0.9)',

                  boxShadow: isActive
                    ? '0 12px 26px rgba(99,102,241,0.14)'
                    : '0 6px 16px rgba(15,23,42,0.04)',

                  transition: 'all 0.28s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  backdropFilter: 'blur(10px)',
                }}
              >
                {/* Hover Shine */}
                <span
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(120deg,transparent,rgba(255,255,255,0.45),transparent)',
                    transform: 'translateX(-120%)',
                    animation: isActive
                      ? 'shine 3s linear infinite'
                      : 'none',
                  }}
                />

                {/* ICON */}
                <span
                  style={{
                    fontSize: 18,
                    position: 'relative',
                    zIndex: 2,
                    color: isActive ? '#2563eb' : '#64748b',
                    filter: isActive
                      ? 'drop-shadow(0 0 8px rgba(37,99,235,0.25))'
                      : 'none',
                  }}
                >
                  {item.icon}
                </span>

                <span style={{ position: 'relative', zIndex: 2 }}>
                  {item.name}
                </span>

                {/* Right Arrow */}
                {isActive && (
                  <span
                    style={{
                      marginLeft: 'auto',
                      fontSize: 14,
                      color: '#2563eb',
                      position: 'relative',
                      zIndex: 2,
                    }}
                  >
                    →
                  </span>
                )}

                {/* Left Active Bar */}
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '18%',
                      bottom: '18%',
                      width: 4,
                      borderRadius: 10,
                      background:
                        'linear-gradient(180deg,#2563eb,#8b5cf6,#10b981)',
                    }}
                  />
                )}
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* FOOTER CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        whileHover={{ y: -3 }}
        style={{
          marginTop: space[6],
          padding: 16,
          borderRadius: 18,
          background:
            'linear-gradient(135deg,#eff6ff,#eef2ff,#f0fdf4)',
          border: '1px solid rgba(226,232,240,0.9)',
          boxShadow: '0 10px 25px rgba(15,23,42,0.05)',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div
          style={{
            fontSize: 13,
            color: '#64748b',
            marginBottom: 6,
            fontWeight: 700,
          }}
        >
          Productivity
        </div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 900,
            background:
              'linear-gradient(90deg,#2563eb,#8b5cf6,#10b981)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Level Up 🚀
        </div>
      </motion.div>

      {/* MOBILE FIX */}
      <style jsx>{`
        @media (max-width: 1024px) {
          .mobile-close-btn {
            display: block !important;
          }
        }

        @keyframes shine {
          0% {
            transform: translateX(-120%);
          }
          100% {
            transform: translateX(130%);
          }
        }
      `}</style>
    </aside>
  )
}