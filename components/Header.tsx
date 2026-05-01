'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from '@/lib/firebase/auth'
import { motion, AnimatePresence } from 'framer-motion'
import { space, radius, colors, shadows } from '@/lib/cssVars'

interface HeaderProps {
  user: { displayName?: string | null; email: string | null }
  onMenuClick?: () => void
}

function getDisplayName(displayName: string | null | undefined, email: string | null) {
  return displayName || email?.split('@')[0] || 'User'
}

export default function Header({ user, onMenuClick }: HeaderProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    setSigningOut(true)
    await signOut()
    router.push('/auth/login')
    router.refresh()
  }

  const displayName = getDisplayName(user.displayName, user.email)

  const initials = displayName
    .split(' ')
    .map((n: string) => n[0] || '')
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <header
      style={{
        height: 74,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `0 ${space[6]}`,
        position: 'sticky',
        top: 0,
        zIndex: 60,

        background: `
          linear-gradient(135deg,
          rgba(255,255,255,0.78),
          rgba(255,255,255,0.55))
        `,
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',

        borderBottom: '1px solid rgba(255,255,255,0.6)',
        boxShadow: '0 10px 35px rgba(15,23,42,0.08)',
      }}
    >
      {/* Glow Line */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 1,
          background:
            'linear-gradient(90deg, transparent, #3b82f6, #8b5cf6, transparent)',
        }}
      />

      {/* MOBILE MENU */}
      {onMenuClick && (
        <motion.button
          whileHover={{ scale: 1.08, rotate: 2 }}
          whileTap={{ scale: 0.94 }}
          onClick={onMenuClick}
          className="mobile-menu-btn"
          style={{
            display: 'none',
            width: 42,
            height: 42,
            borderRadius: 14,
            border: '1px solid rgba(255,255,255,0.6)',
            background:
              'linear-gradient(135deg,#ffffff,#eff6ff)',
            color: '#334155',
            fontSize: 18,
            cursor: 'pointer',
            boxShadow: '0 8px 18px rgba(59,130,246,0.10)',
          }}
        >
          ☰
        </motion.button>
      )}

      {/* LEFT SIDE */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 14,
            background:
              'linear-gradient(135deg,#3b82f6,#8b5cf6,#10b981)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 900,
            fontSize: 16,
            boxShadow: '0 10px 24px rgba(59,130,246,0.25)',
          }}
        >
          T
        </div>

        <div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 900,
              letterSpacing: '-0.03em',
              background:
                'linear-gradient(90deg,#2563eb,#7c3aed,#10b981)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            TaskVanta
          </div>

          <div
            style={{
              fontSize: 11,
              color: '#64748b',
              marginTop: 1,
              fontWeight: 600,
            }}
          >
            Smart Workspace
          </div>
        </div>
      </motion.div>

      {/* USER SECTION */}
      <div style={{ position: 'relative' }}>
        <motion.button
          onClick={() => setShowMenu(!showMenu)}
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: space[3],
            padding: '8px 12px',
            borderRadius: 18,
            border: '1px solid rgba(255,255,255,0.6)',

            background:
              'linear-gradient(135deg,#ffffff,#f8fafc)',

            cursor: 'pointer',
            boxShadow: '0 10px 24px rgba(15,23,42,0.06)',
          }}
        >
          {/* Avatar */}
          <motion.div
            whileHover={{ rotate: 8 }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 14,
              background:
                'linear-gradient(135deg,#3b82f6,#8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 13,
              fontWeight: 900,
              boxShadow: '0 8px 20px rgba(59,130,246,0.25)',
            }}
          >
            {initials}
          </motion.div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: '#0f172a',
                lineHeight: 1.1,
              }}
            >
              {displayName}
            </span>

            <span
              style={{
                fontSize: 11,
                color: '#64748b',
                fontWeight: 600,
              }}
            >
              Online
            </span>
          </div>

          <motion.span
            animate={{ rotate: showMenu ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            style={{
              fontSize: 10,
              color: '#64748b',
            }}
          >
            ▼
          </motion.span>
        </motion.button>

        {/* DROPDOWN */}
        <AnimatePresence>
          {showMenu && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMenu(false)}
                style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 40,
                }}
              />

              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.94 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  marginTop: 12,
                  minWidth: 260,
                  zIndex: 50,

                  background:
                    'linear-gradient(135deg,#ffffff,#f8fafc)',

                  border: '1px solid rgba(255,255,255,0.7)',
                  borderRadius: 22,
                  boxShadow: '0 30px 60px rgba(15,23,42,0.12)',
                  overflow: 'hidden',
                }}
              >
                {/* TOP USER INFO */}
                <div
                  style={{
                    padding: 18,
                    background:
                      'linear-gradient(135deg,#eff6ff,#f5f3ff)',
                    borderBottom: '1px solid #e2e8f0',
                  }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                      color: '#0f172a',
                      marginBottom: 4,
                    }}
                  >
                    {displayName}
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      color: '#64748b',
                      wordBreak: 'break-all',
                    }}
                  >
                    {user.email}
                  </div>
                </div>

                {/* MENU ITEMS */}
                <div style={{ padding: 10 }}>
                  <motion.button
                    whileHover={{
                      x: 4,
                      backgroundColor: '#eff6ff',
                    }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 14,
                      border: 'none',
                      background: 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontWeight: 700,
                      color: '#334155',
                      fontSize: 14,
                    }}
                  >
                    👤 Profile
                  </motion.button>

                  <motion.button
                    whileHover={{
                      x: 4,
                      backgroundColor: '#f8fafc',
                    }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 14,
                      border: 'none',
                      background: 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontWeight: 700,
                      color: '#334155',
                      fontSize: 14,
                    }}
                  >
                    ⚙ Settings
                  </motion.button>

                  <motion.button
                    onClick={handleSignOut}
                    disabled={signingOut}
                    whileHover={{
                      x: 4,
                      backgroundColor: '#fef2f2',
                    }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 14,
                      border: 'none',
                      background: 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontWeight: 800,
                      color: '#dc2626',
                      fontSize: 14,
                      marginTop: 4,
                    }}
                  >
                    {signingOut ? 'Signing out...' : '🚪 Sign out'}
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* MOBILE */}
      <style jsx>{`
        @media (max-width: 1024px) {
          .mobile-menu-btn {
            display: flex !important;
            align-items: center;
            justify-content: center;
          }
        }
      `}</style>
    </header>
  )
}