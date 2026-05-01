'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function HomePage() {
  return (
    <div
      style={{
        background:
          'linear-gradient(135deg,#f8fafc 0%,#eef2ff 35%,#ecfeff 70%,#ffffff 100%)',
        minHeight: '100vh',
        color: '#0f172a',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* FLOATING BACKGROUND BLOBS */}
      <div
        style={{
          position: 'absolute',
          top: -120,
          left: -120,
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'rgba(59,130,246,0.12)',
          filter: 'blur(50px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -120,
          right: -120,
          width: 340,
          height: 340,
          borderRadius: '50%',
          background: 'rgba(16,185,129,0.12)',
          filter: 'blur(50px)',
        }}
      />

      {/* NAV */}
      <nav
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <motion.div
          whileHover={{ scale: 1.03 }}
          style={{ display: 'flex', alignItems: 'center', gap: 12 }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              background: 'linear-gradient(135deg,#2563eb,#14b8a6)',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: 18,
              color: '#fff',
              boxShadow: '0 12px 25px rgba(37,99,235,0.18)',
            }}
          >
            T
          </div>

          <span style={{ fontSize: 22, fontWeight: 900 }}>
            <span style={{ color: '#2563eb' }}>Task</span>
            <span style={{ color: '#14b8a6' }}>Vanta</span>
          </span>
        </motion.div>

        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <Link
            href="/auth/login"
            style={{
              padding: '10px 18px',
              fontSize: 14,
              fontWeight: 700,
              color: '#334155',
              textDecoration: 'none',
              borderRadius: 10,
            }}
          >
            Sign In
          </Link>

          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/auth/signup"
              style={{
                padding: '12px 22px',
                background: 'linear-gradient(135deg,#2563eb,#14b8a6)',
                color: '#fff',
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 800,
                textDecoration: 'none',
                boxShadow: '0 12px 24px rgba(37,99,235,0.20)',
              }}
            >
              Start Free Trial
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* HERO */}
      <section
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '90px 24px 60px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div
            style={{
              display: 'inline-block',
              padding: '8px 18px',
              borderRadius: 999,
              background: '#ffffff',
              border: '1px solid #dbeafe',
              color: '#2563eb',
              fontSize: 13,
              fontWeight: 800,
              marginBottom: 24,
              boxShadow: '0 10px 25px rgba(0,0,0,0.04)',
            }}
          >
            🚀 Trusted by Smart Teams
          </div>

          <h1
            style={{
              fontSize: 'clamp(38px,5vw,64px)',
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: 20,
              letterSpacing: '-0.03em',
            }}
          >
            Smarter{' '}
            <span
              style={{
                background: 'linear-gradient(90deg,#2563eb,#14b8a6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Project Management
            </span>
            <br />
            for Modern Teams
          </h1>

          <p
            style={{
              fontSize: 18,
              color: '#64748b',
              maxWidth: 700,
              margin: '0 auto 38px',
              lineHeight: 1.8,
            }}
          >
            Manage tasks, monitor progress, and collaborate with your team in one
            elegant platform designed for productivity.
          </p>

          <div
            style={{
              display: 'flex',
              gap: 14,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/auth/signup"
                style={{
                  display: 'inline-block',
                  padding: '15px 34px',
                  background: 'linear-gradient(135deg,#2563eb,#14b8a6)',
                  color: '#fff',
                  borderRadius: 14,
                  fontSize: 16,
                  fontWeight: 800,
                  textDecoration: 'none',
                  boxShadow: '0 16px 30px rgba(37,99,235,0.18)',
                }}
              >
                Start Free Trial
              </Link>
            </motion.div>

            <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/auth/login"
                style={{
                  display: 'inline-block',
                  padding: '15px 28px',
                  background: '#ffffff',
                  color: '#0f172a',
                  borderRadius: 14,
                  fontSize: 16,
                  fontWeight: 800,
                  textDecoration: 'none',
                  border: '1px solid #e2e8f0',
                }}
              >
                Live Demo
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* DASHBOARD CARD */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          style={{
            marginTop: 70,
            padding: 26,
            borderRadius: 24,
            background: 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(18px)',
            border: '1px solid rgba(255,255,255,0.7)',
            boxShadow: '0 20px 45px rgba(15,23,42,0.08)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
              gap: 18,
            }}
          >
            {[
              { title: 'Projects', value: '24', color: '#14b8a6' },
              { title: 'Tasks', value: '156', color: '#2563eb' },
              { title: 'Team Members', value: '12', color: '#8b5cf6' },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6, scale: 1.02 }}
                style={{
                  padding: 22,
                  borderRadius: 18,
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontSize: 14, color: '#64748b' }}>{item.title}</div>
                <div
                  style={{
                    fontSize: 34,
                    fontWeight: 900,
                    color: item.color,
                    marginTop: 6,
                  }}
                >
                  {item.value}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '70px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <h2
            style={{
              fontSize: 42,
              fontWeight: 900,
              marginBottom: 10,
            }}
          >
            Why TaskVanta?
          </h2>

          <p
            style={{
              color: '#64748b',
              fontSize: 16,
              maxWidth: 620,
              margin: '0 auto',
            }}
          >
            A clean, fast and examiner-impressive platform for teamwork.
          </p>

          <div
            style={{
              marginTop: 50,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
              gap: 24,
            }}
          >
            {[
              {
                icon: '📊',
                title: 'Smart Tracking',
                desc: 'Track every task with clean dashboards.',
              },
              {
                icon: '⚡',
                title: 'Realtime Speed',
                desc: 'Instant updates for all team members.',
              },
              {
                icon: '👥',
                title: 'Easy Collaboration',
                desc: 'Assign work and grow productivity.',
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8 }}
                style={{
                  padding: 30,
                  borderRadius: 22,
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 16px 35px rgba(0,0,0,0.05)',
                }}
              >
                <div style={{ fontSize: 42 }}>{f.icon}</div>
                <h3
                  style={{
                    marginTop: 14,
                    fontSize: 20,
                    fontWeight: 800,
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    color: '#64748b',
                    fontSize: 15,
                    lineHeight: 1.7,
                    marginTop: 8,
                  }}
                >
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          padding: 40,
          textAlign: 'center',
          color: '#64748b',
          borderTop: '1px solid #e2e8f0',
          background: 'rgba(255,255,255,0.6)',
        }}
      >
        © 2026 TaskVanta • Built for High Performance Teams
      </footer>
    </div>
  )
}