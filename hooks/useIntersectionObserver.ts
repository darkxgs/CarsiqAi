import { useEffect, useRef, useState } from 'react'

interface UseIntersectionObserverOptions {
  threshold?: number | number[]
  rootMargin?: string
  root?: Element | null
  freezeOnceVisible?: boolean
}

export function useIntersectionObserver({
  threshold = 0.1,
  rootMargin = '0px',
  root = null,
  freezeOnceVisible = false
}: UseIntersectionObserverOptions = {}) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasBeenVisible, setHasBeenVisible] = useState(false)
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting
        setIsVisible(isIntersecting)

        if (isIntersecting && !hasBeenVisible) {
          setHasBeenVisible(true)
        }

        // If freezeOnceVisible and element has been visible, disconnect observer
        if (freezeOnceVisible && hasBeenVisible && isIntersecting) {
          observer.disconnect()
        }
      },
      {
        threshold,
        rootMargin,
        root
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin, root, freezeOnceVisible, hasBeenVisible])

  return {
    ref,
    isVisible,
    hasBeenVisible
  }
}

// Hook for multiple elements with staggered animations
export function useStaggeredIntersectionObserver(
  elementsCount: number,
  options: UseIntersectionObserverOptions = {}
) {
  const [visibilityMap, setVisibilityMap] = useState<Record<number, boolean>>({})
  const refs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    refs.current.forEach((element, index) => {
      if (!element) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          const isIntersecting = entry.isIntersecting
          setVisibilityMap(prev => ({
            ...prev,
            [index]: isIntersecting
          }))
        },
        {
          threshold: options.threshold || 0.1,
          rootMargin: options.rootMargin || '0px',
          root: options.root || null
        }
      )

      observer.observe(element)
      observers.push(observer)
    })

    return () => {
      observers.forEach(observer => observer.disconnect())
    }
  }, [elementsCount])

  const setRef = (index: number) => (element: HTMLElement | null) => {
    refs.current[index] = element
  }

  return {
    setRef,
    visibilityMap
  }
}
