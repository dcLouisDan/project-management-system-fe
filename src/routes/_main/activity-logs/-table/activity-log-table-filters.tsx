import DebouncedInput from '@/components/debounced-input'
import SortPopover from '@/components/sort-popover'
import type { SortDirection } from '@/lib/types/ui'
import { SORTABLE_ACTIVITY_LOG_FIELDS } from '@/lib/types/activity-log'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import type { ActivityLogsIndexSearchParams } from '..'

export default function ActivityLogTableFilters() {
  const { description, sort, direction } = useSearch({
    from: '/_main/activity-logs/',
  })

  const navigate = useNavigate()
  const setDescription = (newDescription: string | number) => {
    navigate({
      to: '.',
      replace: true,
      search: (prev: ActivityLogsIndexSearchParams) => ({
        ...prev,
        description: newDescription.toString(),
        page: 1, // Reset to first page when description filter changes
      }),
    })
  }

  const [popoverSortValues, setPopoverSortValues] = useState<{
    sort?: string
    direction?: SortDirection
  }>({
    sort: sort ?? 'id',
    direction: direction ?? 'desc',
  })

  // Sync sort values when URL params change
  useEffect(() => {
    setPopoverSortValues({
      sort: sort ?? 'id',
      direction: direction ?? 'desc',
    })
  }, [sort, direction])

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
      search: (prev: ActivityLogsIndexSearchParams) => ({
        ...prev,
        sort,
        direction,
        page: 1, // Reset to first page when sort changes
      }),
    })
  }
  const onPopoverSortClear = () => {
    setPopoverSortValues({})
    navigate({
      to: '.',
      replace: true,
      search: (prev: ActivityLogsIndexSearchParams) => {
        const { sort, direction, ...rest } = prev
        return {
          ...rest,
          page: 1, // Reset to first page when sort is cleared
        }
      },
    })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <DebouncedInput
        value={description ?? ''}
        onChange={setDescription}
        placeholder="Search by description..."
        debounce={500}
      />
      <SortPopover
        onSortValueChange={onSortValueChange}
        onDirectionValueChange={onDirectionValueChange}
        sortValue={popoverSortValues.sort}
        directionValue={popoverSortValues.direction}
        sortableFields={SORTABLE_ACTIVITY_LOG_FIELDS}
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

