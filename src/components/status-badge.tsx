import type { UiColorConfig } from '@/lib/types/ui'
import { Badge } from './ui/badge'
import { cn } from '@/lib/utils'
import { snakeCaseToTitleCase } from '@/lib/string-utils'

interface StatusBadgeProps {
  label: string
  colors: UiColorConfig
  className?: string
}

export default function StatusBadge({
  label,
  colors,
  className,
}: StatusBadgeProps) {
  const { background, foreground } = colors
  return (
    <Badge className={cn(background, foreground, className)}>
      {snakeCaseToTitleCase(label).toUpperCase()}
    </Badge>
  )
}
