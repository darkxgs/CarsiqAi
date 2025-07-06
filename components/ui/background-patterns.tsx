"use client"

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface BackgroundPatternProps {
  children?: ReactNode
  className?: string
  variant?: 'dots' | 'grid' | 'waves' | 'gradient' | 'mesh' | 'geometric'
  opacity?: number
  animated?: boolean
}

export function BackgroundPattern({
  children,
  className,
  variant = 'gradient',
  opacity = 0.1,
  animated = true
}: BackgroundPatternProps) {
  const patternClasses = {
    dots: 'bg-[radial-gradient(circle_at_1px_1px,rgb(255,255,255,0.15)_1px,transparent_0)] bg-[size:20px_20px]',
    grid: 'bg-[linear-gradient(rgb(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgb(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]',
    waves: 'bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-cyan-50/30',
    gradient: 'bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10',
    mesh: 'bg-[conic-gradient(from_0deg_at_50%_50%,rgb(59,130,246,0.1),rgb(139,92,246,0.1),rgb(6,182,212,0.1),rgb(59,130,246,0.1))]',
    geometric: 'bg-[radial-gradient(ellipse_at_center,rgb(59,130,246,0.1)_0%,transparent_50%),radial-gradient(ellipse_at_80%_20%,rgb(139,92,246,0.1)_0%,transparent_50%),radial-gradient(ellipse_at_20%_80%,rgb(6,182,212,0.1)_0%,transparent_50%)]'
  }

  const animationClasses = animated ? {
    dots: 'animate-pulse',
    grid: 'animate-pulse',
    waves: 'animate-gradient-shift',
    gradient: 'animate-gradient-shift',
    mesh: 'animate-spin',
    geometric: 'animate-float'
  } : {}

  return (
    <div 
      className={cn(
        'absolute inset-0 pointer-events-none',
        patternClasses[variant],
        animated && animationClasses[variant],
        className
      )}
      style={{ 
        opacity,
        animationDuration: variant === 'mesh' ? '20s' : variant === 'geometric' ? '8s' : '6s'
      }}
    >
      {children}
    </div>
  )
}

// Floating Orbs Background
export function FloatingOrbs({ className, count = 5 }: { className?: string; count?: number }) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-xl animate-float"
          style={{
            width: `${Math.random() * 200 + 100}px`,
            height: `${Math.random() * 200 + 100}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${Math.random() * 10 + 10}s`
          }}
        />
      ))}
    </div>
  )
}

// Gradient Mesh Background
export function GradientMesh({ className }: { className?: string }) {
  return (
    <div className={cn('absolute inset-0 pointer-events-none', className)}>
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-purple-500/10 animate-gradient-shift" />
      <div className="absolute inset-0 bg-gradient-to-bl from-cyan-500/10 via-transparent to-pink-500/10 animate-gradient-shift" style={{ animationDelay: '2s' }} />
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-red-500/10 animate-gradient-shift" style={{ animationDelay: '4s' }} />
    </div>
  )
}

// Particle Field Background
export function ParticleField({ className, density = 'medium' }: { className?: string; density?: 'low' | 'medium' | 'high' }) {
  const particleCount = {
    low: 20,
    medium: 50,
    high: 100
  }

  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      {Array.from({ length: particleCount[density] }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-current rounded-full animate-pulse opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${Math.random() * 2 + 2}s`
          }}
        />
      ))}
    </div>
  )
}

// Hexagon Pattern Background
export function HexagonPattern({ className }: { className?: string }) {
  return (
    <div className={cn('absolute inset-0 pointer-events-none opacity-10', className)}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hexagons" x="0" y="0" width="100" height="87" patternUnits="userSpaceOnUse">
            <polygon 
              points="50,5 85,25 85,65 50,85 15,65 15,25" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1"
              opacity="0.3"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexagons)" className="animate-pulse" />
      </svg>
    </div>
  )
}

// Modern Glass Effect
export function GlassEffect({ 
  children, 
  className,
  blur = 'md',
  opacity = 'medium'
}: { 
  children: ReactNode; 
  className?: string;
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  opacity?: 'low' | 'medium' | 'high';
}) {
  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl'
  }

  const opacityClasses = {
    low: 'bg-white/5 dark:bg-black/5',
    medium: 'bg-white/10 dark:bg-black/10',
    high: 'bg-white/20 dark:bg-black/20'
  }

  return (
    <div className={cn(
      'relative',
      blurClasses[blur],
      opacityClasses[opacity],
      'border border-white/10 dark:border-white/5',
      'shadow-xl shadow-black/5',
      className
    )}>
      {children}
    </div>
  )
}

// Animated Border Gradient
export function AnimatedBorderGradient({ 
  children, 
  className,
  colors = ['from-blue-500', 'via-purple-500', 'to-cyan-500']
}: { 
  children: ReactNode; 
  className?: string;
  colors?: string[];
}) {
  return (
    <div className={cn('relative p-px rounded-xl', className)}>
      <div className={`absolute inset-0 bg-gradient-to-r ${colors.join(' ')} rounded-xl animate-gradient-shift`} style={{ backgroundSize: '400% 400%' }} />
      <div className="relative bg-white dark:bg-gray-900 rounded-xl">
        {children}
      </div>
    </div>
  )
}

// Spotlight Effect
export function SpotlightEffect({ className }: { className?: string }) {
  return (
    <div className={cn('absolute inset-0 pointer-events-none', className)}>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-radial from-blue-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-radial from-cyan-500/20 via-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
    </div>
  )
}

// Circuit Board Pattern
export function CircuitPattern({ className }: { className?: string }) {
  return (
    <div className={cn('absolute inset-0 pointer-events-none opacity-10', className)}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="circuit" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <g stroke="currentColor" strokeWidth="1" fill="none">
              <circle cx="40" cy="40" r="3" fill="currentColor" />
              <line x1="40" y1="0" x2="40" y2="37" />
              <line x1="40" y1="43" x2="40" y2="80" />
              <line x1="0" y1="40" x2="37" y2="40" />
              <line x1="43" y1="40" x2="80" y2="40" />
              <circle cx="20" cy="20" r="2" fill="currentColor" opacity="0.6" />
              <circle cx="60" cy="60" r="2" fill="currentColor" opacity="0.6" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit)" className="animate-pulse" />
      </svg>
    </div>
  )
}
