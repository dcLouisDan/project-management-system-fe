import DebouncedInput from '@/components/debounced-input'
import FiltersPopover, {
  type FilterOptions,
} from '@/components/filters-popover'
import SortPopover from '@/components/sort-popover'
import { priorityLevelOptions } from '@/lib/types/priority'
import { getProgressStatusOptions } from '@/lib/types/status'
import { SORTABLE_TASKS_FIELDS } from '@/lib/types/task'
import type { SortDirection } from '@/lib/types/ui'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import type { MyTasksIndexSearchParams } from '..'

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

export default function TaskTableFilters() {
  const { title, status, priority } = useSearch({
    from: '/_main/tasks/my-tasks/',
  })

  const navigate = useNavigate()
  const setTitle = (newTitle: string | number) => {
    navigate({
      to: '.',
      replace: true,
      search: (prev) => ({
        ...(prev as MyTasksIndexSearchParams),
        title: newTitle.toString(),
        page: 1,
      }),
    })
  }

  const [popoverFilterValues, setPopoverFilterValues] = useState<
    Record<string, string[]>
  >({
    status: status ? [status] : [],
    priority: priority ? [priority] : [],
  })

  const onPopoverFiltersSubmit = () => {
    navigate({
      to: '.',
      replace: true,
      search: (prev) => {
        const params = prev as MyTasksIndexSearchParams
        return {
          ...params,
          status: popoverFilterValues.status?.[0],
          priority: popoverFilterValues.priority?.[0],
          page: 1,
        } as MyTasksIndexSearchParams
      },
    })
  }

  const onPopoverFiltersClear = () => {
    setPopoverFilterValues({ status: [], priority: [] })
    navigate({
      to: '.',
      replace: true,
      search: (prev) => {
        const { status, priority, ...rest } = prev
        return {
          ...rest,
          page: 1,
        }
      },
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
    navigate({
      to: '.',
      replace: true,
      search: (prev) => ({
        ...(prev as MyTasksIndexSearchParams),
        sort,
        direction,
        page: 1,
      }),
    })
  }
  const onPopoverSortClear = () => {
    setPopoverSortValues({})
    navigate({
      to: '.',
      replace: true,
      search: (prev) => {
        const { sort, direction, ...rest } = prev
        return {
          ...rest,
          page: 1,
        }
      },
    })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <DebouncedInput
        value={title ?? ''}
        onChange={setTitle}
        placeholder="Search tasks..."
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

