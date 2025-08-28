"use client"

import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { cn } from '@/lib/utils'
import { ReactNode, CSSProperties } from 'react'

interface AnimatedContainerProps {
  children: ReactNode
  className?: string
  animation?: 'fadeIn' | 'slideUp' | 'slideInLeft' | 'slideInRight' | 'scaleIn' | 'rotateIn'
  delay?: number
  duration?: number
  threshold?: number
  once?: boolean
  style?: CSSProperties
}

const animationClasses = {
  fadeIn: 'animate-in fade-in-0 duration-700',
  slideUp: 'animate-in slide-in-from-bottom-6 duration-700',
  slideInLeft: 'animate-in slide-in-from-left-6 duration-700',
  slideInRight: 'animate-in slide-in-from-right-6 duration-700',
  scaleIn: 'animate-in zoom-in-95 duration-700',
  rotateIn: 'animate-in spin-in-180 duration-700'
}

export function AnimatedContainer({
  children,
  className,
  animation = 'fadeIn',
  delay = 0,
  duration = 700,
  threshold = 0.1,
  once = true,
  style
}: AnimatedContainerProps) {
  const { ref, hasBeenVisible } = useIntersectionObserver({
    threshold,
    freezeOnceVisible: once
  })

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all ease-out',
        hasBeenVisible ? animationClasses[animation] : 'opacity-0',
        className
      )}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
        ...style
      }}
    >
      {children}
    </div>
  )
}

// Staggered animation for multiple children
interface StaggeredContainerProps {
  children: ReactNode[]
  className?: string
  animation?: 'fadeIn' | 'slideUp' | 'slideInLeft' | 'slideInRight' | 'scaleIn'
  staggerDelay?: number
  baseDelay?: number
  threshold?: number
}

export function StaggeredContainer({
  children,
  className,
  animation = 'fadeIn',
  staggerDelay = 100,
  baseDelay = 0,
  threshold = 0.1
}: StaggeredContainerProps) {
  const { ref, hasBeenVisible } = useIntersectionObserver({
    threshold,
    freezeOnceVisible: true
  })

  return (
    <div ref={ref} className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className={cn(
            'transition-all ease-out',
            hasBeenVisible ? animationClasses[animation] : 'opacity-0'
          )}
          style={{
            animationDelay: `${baseDelay + index * staggerDelay}ms`
          }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

// Parallax scroll effect
interface ParallaxContainerProps {
  children: ReactNode
  className?: string
  speed?: number
  direction?: 'up' | 'down' | 'left' | 'right'
}

export function ParallaxContainer({
  children,
  className,
  speed = 0.5,
  direction = 'up'
}: ParallaxContainerProps) {
  const { ref, isVisible } = useIntersectionObserver({
    threshold: 0
  })

  const getTransform = () => {
    if (!isVisible) return 'translate3d(0, 0, 0)'
    
    const offset = window.scrollY * speed
    
    switch (direction) {
      case 'up':
        return `translate3d(0, ${-offset}px, 0)`
      case 'down':
        return `translate3d(0, ${offset}px, 0)`
      case 'left':
        return `translate3d(${-offset}px, 0, 0)`
      case 'right':
        return `translate3d(${offset}px, 0, 0)`
      default:
        return 'translate3d(0, 0, 0)'
    }
  }

  return (
    <div
      ref={ref}
      className={cn('transition-transform will-change-transform', className)}
      style={{
        transform: getTransform()
      }}
    >
      {children}
    </div>
  )
}
