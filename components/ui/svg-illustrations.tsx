"use client"

import { cn } from '@/lib/utils'

interface SVGProps {
  className?: string
  width?: number
  height?: number
}

// Car Engine SVG Illustration
export function CarEngineIllustration({ className, width = 200, height = 200 }: SVGProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 200"
      className={cn("drop-shadow-lg", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="engineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Engine Block */}
      <rect x="40" y="60" width="120" height="80" rx="8" fill="url(#engineGradient)" filter="url(#glow)" />
      
      {/* Oil Container */}
      <ellipse cx="100" cy="40" rx="25" ry="15" fill="#F59E0B" opacity="0.8" />
      <rect x="85" y="25" width="30" height="25" rx="15" fill="#F59E0B" opacity="0.9" />
      
      {/* Engine Details */}
      <rect x="50" y="70" width="15" height="60" rx="2" fill="#1F2937" opacity="0.7" />
      <rect x="135" y="70" width="15" height="60" rx="2" fill="#1F2937" opacity="0.7" />
      
      {/* Pistons */}
      <circle cx="75" cy="90" r="8" fill="#E5E7EB" />
      <circle cx="100" cy="90" r="8" fill="#E5E7EB" />
      <circle cx="125" cy="90" r="8" fill="#E5E7EB" />
      
      {/* Oil Drop Animation */}
      <g className="animate-bounce">
        <ellipse cx="100" cy="165" rx="8" ry="5" fill="#F59E0B" opacity="0.6" />
      </g>
      
      {/* Sparkles */}
      <g className="animate-pulse">
        <polygon points="30,30 35,40 25,40" fill="#FCD34D" />
        <polygon points="170,50 175,60 165,60" fill="#FCD34D" />
        <polygon points="50,170 55,180 45,180" fill="#FCD34D" />
      </g>
    </svg>
  )
}

// Oil Drop SVG Icon
export function OilDropIcon({ className, width = 24, height = 24 }: SVGProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      className={cn("fill-current", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="dropGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>
      <path 
        d="M12 2L8 10C8 13.31 9.69 16 12 16C14.31 16 16 13.31 16 10L12 2Z"
        fill="url(#dropGradient)"
        className="animate-pulse"
      />
      <ellipse cx="12" cy="20" rx="3" ry="1.5" fill="#D97706" opacity="0.3" />
    </svg>
  )
}

// Car Silhouette SVG
export function CarSilhouette({ className, width = 120, height = 60 }: SVGProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 60"
      className={cn("fill-current", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="carGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1F2937" />
          <stop offset="100%" stopColor="#374151" />
        </linearGradient>
      </defs>
      
      {/* Car Body */}
      <path 
        d="M20 40 L25 25 L35 20 L85 20 L95 25 L100 40 L95 45 L85 50 L35 50 L25 45 Z"
        fill="url(#carGradient)"
      />
      
      {/* Windows */}
      <path 
        d="M30 30 L35 25 L85 25 L90 30 L85 35 L35 35 Z"
        fill="#93C5FD"
        opacity="0.6"
      />
      
      {/* Wheels */}
      <circle cx="35" cy="45" r="8" fill="#1F2937" />
      <circle cx="85" cy="45" r="8" fill="#1F2937" />
      <circle cx="35" cy="45" r="5" fill="#6B7280" />
      <circle cx="85" cy="45" r="5" fill="#6B7280" />
    </svg>
  )
}

// Floating Particle SVG
export function FloatingParticle({ className, width = 8, height = 8 }: SVGProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 8 8"
      className={cn("animate-float", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="4" cy="4" r="3" fill="currentColor" opacity="0.6" />
    </svg>
  )
}

// Gear Icon SVG
export function GearIcon({ className, width = 24, height = 24 }: SVGProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      className={cn("fill-current animate-spin", className)}
      xmlns="http://www.w3.org/2000/svg"
      style={{ animationDuration: '4s' }}
    >
      <defs>
        <linearGradient id="gearGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6B7280" />
          <stop offset="100%" stopColor="#374151" />
        </linearGradient>
      </defs>
      <path 
        d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"
        fill="url(#gearGradient)"
      />
    </svg>
  )
}

// Wave Pattern SVG
export function WavePattern({ className, width = 400, height = 100 }: SVGProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 400 100"
      className={cn("absolute inset-0", className)}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <path 
        d="M0,50 Q100,10 200,50 T400,50 L400,100 L0,100 Z"
        fill="url(#waveGradient)"
        className="animate-gradient-shift"
      />
      <path 
        d="M0,60 Q100,20 200,60 T400,60 L400,100 L0,100 Z"
        fill="url(#waveGradient)"
        opacity="0.5"
        className="animate-gradient-shift"
        style={{ animationDelay: '1s' }}
      />
    </svg>
  )
}

// Abstract Shape Pattern
export function AbstractShapePattern({ className, width = 300, height = 300 }: SVGProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 300 300"
      className={cn("absolute opacity-20", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="shapeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      
      {/* Floating geometric shapes */}
      <circle cx="50" cy="50" r="20" fill="url(#shapeGradient)" className="animate-float" />
      <rect x="200" y="80" width="30" height="30" rx="5" fill="url(#shapeGradient)" className="animate-float" style={{ animationDelay: '0.5s' }} />
      <polygon points="150,30 170,60 130,60" fill="url(#shapeGradient)" className="animate-float" style={{ animationDelay: '1s' }} />
      <ellipse cx="80" cy="200" rx="25" ry="15" fill="url(#shapeGradient)" className="animate-float" style={{ animationDelay: '1.5s' }} />
      <path d="M220,200 Q240,180 260,200 Q240,220 220,200" fill="url(#shapeGradient)" className="animate-float" style={{ animationDelay: '2s' }} />
    </svg>
  )
}

// Success Checkmark Animation
export function AnimatedCheckmark({ className, width = 60, height = 60 }: SVGProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 60 60"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="checkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      
      <circle 
        cx="30" 
        cy="30" 
        r="25" 
        fill="none" 
        stroke="url(#checkGradient)" 
        strokeWidth="3"
        className="animate-in zoom-in-50 duration-500"
      />
      <path 
        d="M20 30 L26 36 L40 22" 
        fill="none" 
        stroke="url(#checkGradient)" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="animate-in fade-in duration-500"
        style={{ animationDelay: '0.3s' }}
      />
    </svg>
  )
}
