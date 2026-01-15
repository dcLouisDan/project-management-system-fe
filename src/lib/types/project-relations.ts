import type { BasicSelectItem } from '@/components/basic-select'
import { snakeCaseToTitleCase } from '../string-utils'
import type { ProgressStatus } from './status'

export type ProjectRelation =
  | 'blocks'
  | 'requires'
  | 'follows'
  | 'relates_to'
  | 'duplicate_of'
  | 'parent_of'

export const projectRelationsArr: ProjectRelation[] = [
  'blocks',
  'requires',
  'follows',
  'relates_to',
  'duplicate_of',
  'parent_of',
]

export const projectRelationOptions: BasicSelectItem[] =
  projectRelationsArr.map((relation) => ({
    value: relation,
    label: snakeCaseToTitleCase(relation),
  }))

export interface ProjectRelationsSyncItem {
  id: number
  relation_type: ProjectRelation
}

export interface ProjectRelationsSync {
  tasks: ProjectRelationsSyncItem[]
  milestones: ProjectRelationsSyncItem[]
}

export interface ProjectRelationsGraphItem {
  target: string //Ex: "\App\Models\Task_1"
  target_status: ProgressStatus
  type: ProjectRelation
}

export type ProjectRelationsGraph = Record<string, ProjectRelationsGraphItem[]>