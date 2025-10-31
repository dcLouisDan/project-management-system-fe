import { cn } from '@/lib/utils'
import { ScrollText } from 'lucide-react'

export default function AppLogo({
  className,
  size = 24,
  padding = 4,
}: {
  className?: string
  size?: number
  padding?: number
}) {
  const containerSize = `${size + 2}px`
  const iconSize = `${size}px`
  return (
    <div
      className={cn(
        'bg-primary text-primary-foreground flex items-center justify-center rounded-md',
        className,
      )}
      style={{
        height: containerSize,
        width: containerSize,
        padding: `${padding}px`,
      }}
    >
      <ScrollText
        style={{
          height: iconSize,
          width: iconSize,
        }}
      />
    </div>
  )
}
