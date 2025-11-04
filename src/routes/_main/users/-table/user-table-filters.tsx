import DebouncedInput from '@/components/debounced-input'
import FiltersPopover, {
  type FilterOptions,
} from '@/components/filters-popover'
import SortPopover from '@/components/sort-popover'
import { RoleSelectItems } from '@/lib/types/role'
import type { SortDirection } from '@/lib/types/ui'
import { SORTABLE_USER_FIELDS } from '@/lib/types/user'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import { string } from 'zod'

const popoverFilters: FilterOptions[] = [
  {
    label: 'Roles',
    key: 'role',
    items: RoleSelectItems,
  },
]

export default function UsersTableFilters() {
  const { name, role } = useSearch({
    from: '/_main/users',
  })

  const navigate = useNavigate()
  const setName = (newName: string | number) => {
    navigate({
      to: '.',
      replace: true,
      search: (prev) => ({
        ...prev,
        name: newName.toString(),
        page: 1, // Reset to first page when name filter changes
      }),
    })
  }

  const [popoverFilterValues, setPopoverFilterValues] = useState<
    Record<string, string[]>
  >({
    role: role ? [role] : [],
  })

  const onPopoverFiltersSubmit = () => {
    navigate({
      to: '.',
      replace: true,
      search: (prev) => ({
        ...prev,
        roles: popoverFilterValues.role,
        page: 1, // Reset to first page when popover filters change
      }),
    })
  }

  const onPopoverFiltersClear = () => {
    setPopoverFilterValues({})
    navigate({
      to: '.',
      replace: true,
      search: (prev) => {
        const { roles, ...rest } = prev
        return {
          ...rest,
          page: 1, // Reset to first page when popover filters change
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
        ...prev,
        sort,
        direction,
        page: 1, // Reset to first page when popover filters change
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
          page: 1, // Reset to first page when popover filters change
        }
      },
    })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <DebouncedInput
        value={name ?? ''}
        onChange={setName}
        placeholder="Search users..."
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
        sortableFields={SORTABLE_USER_FIELDS}
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
