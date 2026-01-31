import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
		keyframes: {
			'accordion-down': {
				from: {
					height: '0'
				},
				to: {
					height: 'var(--radix-accordion-content-height)'
				}
			},
			'accordion-up': {
				from: {
					height: 'var(--radix-accordion-content-height)'
				},
				to: {
					height: '0'
				}
			},
			'fade-in': {
				from: {
					opacity: '0',
					transform: 'translateY(20px)'
				},
				to: {
					opacity: '1',
					transform: 'translateY(0)'
				}
			},
			'slide-up': {
				from: {
					opacity: '0',
					transform: 'translateY(50px)'
				},
				to: {
					opacity: '1',
					transform: 'translateY(0)'
				}
			},
			'slide-in-left': {
				from: {
					opacity: '0',
					transform: 'translateX(-50px)'
				},
				to: {
					opacity: '1',
					transform: 'translateX(0)'
				}
			},
			'slide-in-right': {
				from: {
					opacity: '0',
					transform: 'translateX(50px)'
				},
				to: {
					opacity: '1',
					transform: 'translateX(0)'
				}
			},
			'scale-in': {
				from: {
					opacity: '0',
					transform: 'scale(0.8)'
				},
				to: {
					opacity: '1',
					transform: 'scale(1)'
				}
			},
			'rotate-in': {
				from: {
					opacity: '0',
					transform: 'rotate(-180deg) scale(0.8)'
				},
				to: {
					opacity: '1',
					transform: 'rotate(0deg) scale(1)'
				}
			},
			'gradient-shift': {
				'0%': {
					backgroundPosition: '0% 50%'
				},
				'50%': {
					backgroundPosition: '100% 50%'
				},
				'100%': {
					backgroundPosition: '0% 50%'
				}
			},
			'gradient-wave': {
				'0%': {
					backgroundPosition: '0% 50%',
					backgroundSize: '100% 100%'
				},
				'25%': {
					backgroundPosition: '100% 50%',
					backgroundSize: '150% 150%'
				},
				'50%': {
					backgroundPosition: '50% 100%',
					backgroundSize: '200% 200%'
				},
				'75%': {
					backgroundPosition: '0% 50%',
					backgroundSize: '150% 150%'
				},
				'100%': {
					backgroundPosition: '0% 50%',
					backgroundSize: '100% 100%'
				}
			},
			'morph': {
				'0%': {
					borderRadius: '50% 20% 30% 40%',
					transform: 'scale(1) rotate(0deg)'
				},
				'25%': {
					borderRadius: '30% 50% 20% 40%',
					transform: 'scale(1.1) rotate(90deg)'
				},
				'50%': {
					borderRadius: '40% 30% 50% 20%',
					transform: 'scale(0.9) rotate(180deg)'
				},
				'75%': {
					borderRadius: '20% 40% 30% 50%',
					transform: 'scale(1.05) rotate(270deg)'
				},
				'100%': {
					borderRadius: '50% 20% 30% 40%',
					transform: 'scale(1) rotate(360deg)'
				}
			},
			'float': {
				'0%, 100%': {
					transform: 'translateY(0px)'
				},
				'50%': {
					transform: 'translateY(-10px)'
				}
			},
			'float-slow': {
				'0%, 100%': {
					transform: 'translateY(0px)'
				},
				'50%': {
					transform: 'translateY(-15px)'
				}
			},
			'shimmer': {
				'0%': {
					backgroundPosition: '-200% 0'
				},
				'100%': {
					backgroundPosition: '200% 0'
				}
			},
			'glow': {
				'0%, 100%': {
					boxShadow: '0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.3), 0 0 60px rgba(59, 130, 246, 0.1)'
				},
				'33%': {
					boxShadow: '0 0 20px rgba(139, 92, 246, 0.5), 0 0 40px rgba(139, 92, 246, 0.3), 0 0 60px rgba(139, 92, 246, 0.1)'
				},
				'66%': {
					boxShadow: '0 0 20px rgba(6, 182, 212, 0.5), 0 0 40px rgba(6, 182, 212, 0.3), 0 0 60px rgba(6, 182, 212, 0.1)'
				}
			},
			'bounce-custom': {
				'0%, 20%, 53%, 80%, 100%': {
					transform: 'translate3d(0, 0, 0)'
				},
				'40%, 43%': {
					transform: 'translate3d(0, -30px, 0)'
				},
				'70%': {
					transform: 'translate3d(0, -15px, 0)'
				},
				'90%': {
					transform: 'translate3d(0, -4px, 0)'
				}
			},
			'pulse-ring': {
				'0%': {
					transform: 'scale(0.33)',
					opacity: '1'
				},
				'80%, 100%': {
					transform: 'scale(1)',
					opacity: '0'
				}
			},
			'card-flip': {
				'0%': {
					transform: 'perspective(600px) rotateY(-90deg)',
					opacity: '0'
				},
				'100%': {
					transform: 'perspective(600px) rotateY(0deg)',
					opacity: '1'
				}
			},
			'text-reveal': {
				'0%': {
					opacity: '0',
					transform: 'translateY(30px)',
					clipPath: 'inset(100% 0 0 0)'
				},
				'100%': {
					opacity: '1',
					transform: 'translateY(0)',
					clipPath: 'inset(0 0 0 0)'
				}
			},
			'scroll': {
				'0%': {
					transform: 'translateX(0)'
				},
				'100%': {
					transform: 'translateX(-50%)'
				}
			}
		},
		animation: {
			'accordion-down': 'accordion-down 0.2s ease-out',
			'accordion-up': 'accordion-up 0.2s ease-out',
			'fade-in': 'fade-in 0.6s ease-out',
			'slide-up': 'slide-up 0.8s ease-out',
			'slide-in-left': 'slide-in-left 0.8s ease-out',
			'slide-in-right': 'slide-in-right 0.8s ease-out',
			'scale-in': 'scale-in 0.6s ease-out',
			'rotate-in': 'rotate-in 0.8s ease-out',
			'gradient-shift': 'gradient-shift 3s ease infinite',
			'gradient-wave': 'gradient-wave 8s ease-in-out infinite',
			'morph': 'morph 10s ease-in-out infinite',
			'float': 'float 3s ease-in-out infinite',
			'float-slow': 'float-slow 4s ease-in-out infinite',
			'shimmer': 'shimmer 2s ease-in-out infinite',
			'glow': 'glow 3s ease-in-out infinite',
			'bounce-custom': 'bounce-custom 2s ease-in-out infinite',
			'pulse-ring': 'pulse-ring 1.25s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
			'card-flip': 'card-flip 0.8s ease-out',
			'text-reveal': 'text-reveal 0.8s ease-out',
			'scroll': 'scroll 20s linear infinite'
		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
