import DebouncedInput from '@/components/debounced-input'
import SortPopover from '@/components/sort-popover'
import type { SortDirection } from '@/lib/types/ui'
import { SORTABLE_TEAM_FIELDS } from '@/lib/types/team'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import type { MyTeamsIndexSearchParams } from '..'

export default function TeamTableFilters() {
  const { name } = useSearch({
    from: '/_main/my-teams/',
  })

  const navigate = useNavigate()
  const setName = (newName: string | number) => {
    navigate({
      to: '.',
      replace: true,
      search: (prev: MyTeamsIndexSearchParams) => ({
        ...prev,
        name: newName.toString(),
        page: 1,
      }),
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
      search: (prev: MyTeamsIndexSearchParams) => ({
        ...prev,
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
      search: (prev: MyTeamsIndexSearchParams) => {
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
        value={name ?? ''}
        onChange={setName}
        placeholder="Search teams..."
        debounce={500}
      />

      <SortPopover
        onSortValueChange={onSortValueChange}
        onDirectionValueChange={onDirectionValueChange}
        sortValue={popoverSortValues.sort}
        directionValue={popoverSortValues.direction}
        sortableFields={SORTABLE_TEAM_FIELDS}
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



