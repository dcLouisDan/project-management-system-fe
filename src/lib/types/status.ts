import type { BasicSelectItem } from '@/components/basic-select'
import { snakeCaseToTitleCase } from '../string-utils'

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
