import type { BasicSelectItem } from '@/components/basic-select'
import { snakeCaseToTitleCase } from '../string-utils'
import type { UiColorConfig } from './ui'

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

export const priorityColorMap: Record<PriorityLevel, UiColorConfig> = {
  low: {
    background: 'bg-success',
    foreground: 'text-success-foreground',
  },
  medium: {
    background: 'bg-info',
    foreground: 'text-info-foreground',
  },
  high: {
    background: 'bg-warning',
    foreground: 'text-warning-foreground',
  },
  urgent: {
    background: 'bg-destructive',
    foreground: 'text-white',
  },
}
