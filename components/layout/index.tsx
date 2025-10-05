'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface PageContainerProps {
  children: ReactNode
  className?: string
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen bg-gradient-subtle ${className}`}
    >
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </motion.div>
  )
}

interface HeaderProps {
  title: string
  subtitle?: string
  className?: string
}

export function Header({ title, subtitle, className = '' }: HeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`text-center mb-12 ${className}`}
    >
      <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        {title}
      </h1>
      {subtitle && (
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}

interface SectionProps {
  children: ReactNode
  title?: string
  className?: string
}

export function Section({ children, title, className = '' }: SectionProps) {
  return (
    <section className={`mb-12 ${className}`}>
      {title && (
        <h2 className="font-serif text-2xl font-semibold text-gray-900 mb-6">
          {title}
        </h2>
      )}
      {children}
    </section>
  )
}

interface GridProps {
  children: ReactNode
  cols?: 1 | 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Grid({ children, cols = 3, gap = 'md', className = '' }: GridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }
  
  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8'
  }
  
  return (
    <div className={`grid ${gridCols[cols]} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  )
}
