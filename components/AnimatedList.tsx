'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    }
  },
}

interface AnimatedListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
  keyExtractor: (item: T, index: number) => string
  className?: string
  style?: React.CSSProperties
}

export function AnimatedList<T>({
  items,
  renderItem,
  keyExtractor,
  className,
  style,
}: AnimatedListProps<T>) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
      style={style}
    >
      {items.map((item, index) => (
        <motion.div key={keyExtractor(item, index)} variants={itemVariants}>
          {renderItem(item, index)}
        </motion.div>
      ))}
    </motion.div>
  )
}
