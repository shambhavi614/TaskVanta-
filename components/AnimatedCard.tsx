'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface AnimatedCardProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
  hoverable?: boolean
}

export function AnimatedCard({
  children,
  className,
  style,
  onClick,
  hoverable = true,
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      whileHover={hoverable ? { 
        y: -4,
        boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
        borderColor: 'var(--border-hover)',
      } : {}}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 12,
        padding: 20,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color 0.2s ease',
        ...style,
      }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.div>
  )
}
