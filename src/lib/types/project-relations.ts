import type { BasicSelectItem } from '@/components/basic-select'
import { snakeCaseToTitleCase } from '../string-utils'

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
