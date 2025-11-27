import DebouncedInput from '@/components/debounced-input'
import FiltersPopover, {
  type FilterOptions,
} from '@/components/filters-popover'
import SortPopover from '@/components/sort-popover'
import type { FetchTasksParams } from '@/lib/api/tasks'
import { priorityLevelOptions } from '@/lib/types/priority'
import { getProgressStatusOptions } from '@/lib/types/status'
import { SORTABLE_TASKS_FIELDS } from '@/lib/types/task'
import type { SortDirection } from '@/lib/types/ui'
import { useState } from 'react'

interface ProjectTasksTableFiltersProps {
  params: FetchTasksParams
  setParams: (params: FetchTasksParams) => void
}

const popoverFilters: FilterOptions[] = [
  {
    label: 'Status',
    key: 'status',
    items: getProgressStatusOptions('all'),
  },
  {
    label: 'Priority',
    key: 'priority',
    items: priorityLevelOptions,
  },
]

export default function ProjectTasksTableFilters({
  params,
  setParams,
}: ProjectTasksTableFiltersProps) {
  const { title } = params
  const setName = (newName: string | number) => {
    setParams({ ...params, title: newName.toString() })
  }

  const [popoverFilterValues, setPopoverFilterValues] = useState<
    Record<string, string[]>
  >({
    status: [],
    priority: [],
  })

  const onPopoverFiltersSubmit = () => {
    const newFilterValues: Record<string, string> = {}
    popoverFilters.forEach((filter) => {
      if (['status', 'priority'].includes(filter.key)) {
        newFilterValues[filter.key] = popoverFilterValues[filter.key].join(',')
      }
    })
    setParams({
      ...params,
      ...newFilterValues,
    })
  }

  const onPopoverFiltersClear = () => {
    setPopoverFilterValues({})
    setParams({
      ...params,
      page: 1,
      status: undefined,
      priority: undefined,
    })
  }

  const [popoverSortValues, setPopoverSortValues] = useState<{
    sort?: string
    direction?: SortDirection
  }>({
    sort: 'id',
    direction: 'asc',
  })

  const onSortValueChange = (value: string | undefined) =>
    setPopoverSortValues((prev) => ({ ...prev, sort: value }))
  const onDirectionValueChange = (value: string | undefined) =>
    setPopoverSortValues((prev) =>
      value
        ? { ...prev, direction: value as SortDirection }
        : { ...prev, direction: undefined },
    )
  const onPopoverSortSubmit = (sort?: string, direction?: SortDirection) => {
    setParams({
      ...params,
      sort,
      direction,
    })
  }
  const onPopoverSortClear = () => {
    setPopoverSortValues({})
    setParams({
      ...params,
      sort: undefined,
      direction: undefined,
    })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <DebouncedInput
        value={title ?? ''}
        onChange={setName}
        placeholder="Search task..."
        debounce={500}
      />
      <FiltersPopover
        filters={popoverFilters}
        value={popoverFilterValues}
        onValueChange={setPopoverFilterValues}
        onSubmit={onPopoverFiltersSubmit}
        onClear={onPopoverFiltersClear}
      />
      <SortPopover
        onSortValueChange={onSortValueChange}
        onDirectionValueChange={onDirectionValueChange}
        sortValue={popoverSortValues.sort}
        directionValue={popoverSortValues.direction}
        sortableFields={SORTABLE_TASKS_FIELDS}
        onSubmit={() =>
          onPopoverSortSubmit(
            popoverSortValues.sort,
            popoverSortValues.direction,
          )
        }
        onClear={onPopoverSortClear}
      />
    </div>
  )
}
