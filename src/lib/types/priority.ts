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
