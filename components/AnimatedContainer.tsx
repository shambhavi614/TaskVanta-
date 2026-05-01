'use client'

import { motion, Variants } from 'framer-motion'
import { ReactNode } from 'react'

const animations: Record<string, Variants> = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  fadeInUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  fadeInDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
  slideInLeft: {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  },
  slideInRight: {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
  },
}

interface AnimatedContainerProps {
  children: ReactNode
  animation?: keyof typeof animations
  delay?: number
  duration?: number
  className?: string
  style?: React.CSSProperties
}

export function AnimatedContainer({
  children,
  animation = 'fadeInUp',
  delay = 0,
  duration = 0.5,
  className,
  style,
}: AnimatedContainerProps) {
  return (
    <motion.div
      variants={animations[animation]}
      initial="hidden"
      animate="visible"
      transition={{ 
        duration, 
        delay, 
        ease: [0.25, 0.1, 0.25, 1],
        type: 'tween'
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}
