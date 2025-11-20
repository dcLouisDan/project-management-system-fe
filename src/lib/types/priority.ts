import type { BasicSelectItem } from '@/components/basic-select'
import { snakeCaseToTitleCase } from '../string-utils'

export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent'

export const priorityLevelsArr: PriorityLevel[] = [
  'low',
  'medium',
  'high',
  'urgent',
]

export const priorityLevelOptions: BasicSelectItem[] = priorityLevelsArr.map(
  (level) => ({ value: level, label: snakeCaseToTitleCase(level) }),
)

export interface PriorityColorConfig {
  background: string
  foreground: string
}

export const priorityColorMap: Record<PriorityLevel, PriorityColorConfig> = {
  low: {
    background: 'bg-success',
    foreground: 'text-success-foreground',
  },
  medium: {
    background: 'bg-info',
    foreground: 'text-info-foreground',
  },
  high: {
    background: 'bg-success',
    foreground: 'text-success-foreground',
  },
  urgent: {
    background: 'bg-destructive',
    foreground: 'text-white',
  },
}
