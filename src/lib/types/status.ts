import type { BasicSelectItem } from '@/components/basic-select'
import { snakeCaseToTitleCase } from '../string-utils'
import type { UiColorConfig } from './ui'

export type ProgressStatus =
  | 'not_started'
  | 'assigned'
  | 'in_progress'
  | 'awaiting_review'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'completed'
  | 'on_hold'
  | 'cancelled'

export const progrestStatusArr: ProgressStatus[] = [
  'not_started',
  'assigned',
  'in_progress',
  'awaiting_review',
  'under_review',
  'approved',
  'rejected',
  'completed',
  'on_hold',
  'cancelled',
]

export const getProgressStatusOptions = (
  category: 'all' | 'milestone' | 'review' = 'milestone',
): BasicSelectItem[] => {
  if (category == 'milestone') {
    return [
      'not_started',
      'in_progress',
      'completed',
      'on_hold',
      'cancelled',
    ].map((status) => ({
      value: status,
      label: snakeCaseToTitleCase(status),
    }))
  }

  if (category == 'review') {
    return ['awaiting_review', 'under_review', 'approved', 'rejected'].map(
      (status) => ({
        value: status,
        label: snakeCaseToTitleCase(status),
      }),
    )
  }

  return progrestStatusArr.map((status) => ({
    value: status,
    label: snakeCaseToTitleCase(status),
  }))
}

export const statusColorMap: Record<ProgressStatus, UiColorConfig> = {
  not_started: {
    background: 'bg-accent',
    foreground: 'text-accent-foreground',
  },
  assigned: {
    background: 'bg-info',
    foreground: 'text-info-foreground',
  },
  in_progress: {
    background: 'bg-info',
    foreground: 'text-info-foreground',
  },
  awaiting_review: {
    background: 'bg-warning',
    foreground: 'text-warning-foreground',
  },
  under_review: {
    background: 'bg-warning',
    foreground: 'text-warning-foreground',
  },
  approved: {
    background: 'bg-success',
    foreground: 'text-success-foreground',
  },
  rejected: {
    background: 'bg-destructive',
    foreground: 'text-white',
  },
  completed: {
    background: 'bg-success',
    foreground: 'text-success-foreground',
  },
  on_hold: {
    background: 'bg-warning',
    foreground: 'text-warning-foreground',
  },
  cancelled: {
    background: 'bg-destructive',
    foreground: 'text-white',
  },
}
