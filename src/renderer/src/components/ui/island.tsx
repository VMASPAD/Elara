import React, { useState, useEffect } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'
const IslandVariants = cva(
  'flex items-center  text-secondary rounded-lg transition-all duration-700 ease-in-out fixed backdrop-blur-md',
  {
    variants: {
      variant: {
        default: 'bg-primary',
        destructive: 'bg-destructive',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/60',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline'
      },
      size: { default: '', sm: 'h-8 rounded-md px-3 text-xs', lg: 'h-10 rounded-md px-8' },
      position: {
        top: 'top-[3%] left-1/2 transform -translate-x-1/2',
        bottom: 'bottom-[3%] left-1/2 transform -translate-x-1/2',
        left: 'left-[3%] top-1/2 transform -translate-y-1/2',
        right: 'right-[3%] top-1/2 transform -translate-y-1/2'
      }
    },
    defaultVariants: { variant: 'default', size: 'default', position: 'bottom' }
  }
)
interface IslandProps extends VariantProps<typeof IslandVariants> {
  distance?: number
  className?: string
  children: React.ReactNode
}
const Island = ({
  children,
  distance = 70,
  position = 'bottom',
  className,
  variant,
  size
}: IslandProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isMouseInside, setIsMouseInside] = useState(false)
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event
      const { innerWidth, innerHeight } = window
      const threshold = distance
      switch (position) {
        case 'top':
          setIsVisible(clientY <= threshold)
          break
        case 'bottom':
          setIsVisible(innerHeight - clientY <= threshold)
          break
        case 'left':
          setIsVisible(clientX <= threshold)
          break
        case 'right':
          setIsVisible(innerWidth - clientX <= threshold)
          break
        default:
          setIsVisible(false)
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [distance, position])
  const getTransformClass = () => {
    switch (position) {
      case 'top':
        return isVisible || isMouseInside ? 'translate-y-0' : '-translate-y-full'
      case 'bottom':
        return isVisible || isMouseInside ? 'translate-y-0' : 'translate-y-full'
      case 'left':
        return isVisible || isMouseInside ? 'translate-x-0' : '-translate-x-full'
      case 'right':
        return isVisible || isMouseInside ? 'translate-x-0' : 'translate-x-full'
      default:
        return ''
    }
  }
  return (
    <div
      className={cn(
        IslandVariants({ variant, size, position, className }),
        'z-10',
        isVisible || isMouseInside ? 'opacity-100' : 'opacity-0',
        getTransformClass(),
        'transition-all duration-700 ease-in-out'
      )}
      onMouseEnter={() => setIsMouseInside(true)}
      onMouseLeave={() => setIsMouseInside(false)}
    >
      {' '}
      {children}{' '}
    </div>
  )
}
export default Island
