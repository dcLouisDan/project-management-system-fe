import { BasicSelect } from '@/components/basic-select'
import DebouncedInput from '@/components/debounced-input'
import FiltersPopover, {
  type FilterOptions,
} from '@/components/filters-popover'
import { RoleSelectItems } from '@/lib/types/role'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useState } from 'react'

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
  const setRole = (newRole: string | number) => {
    navigate({
      to: '.',
      replace: true,
      search: (prev) => ({
        ...prev,
        role: newRole.toString(),
        page: 1, // Reset to first page when role filter changes
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
    </div>
  )
}
