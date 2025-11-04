import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { FilterToggleGroup } from '@/components/filter-toggle-group'
import type { BasicSelectItem } from './basic-select'
import { Filter } from 'lucide-react'
import { useMemo } from 'react'
import { Badge } from './ui/badge'

interface FiltersPopoverProps {
  value?: Record<string, string[]>
  onValueChange?: (value: Record<string, string[]>) => void
  filters: FilterOptions[]
  onSubmit?: () => void
  onClear?: () => void
}

export interface FilterOptions {
  label: string
  key: string
  items: BasicSelectItem[]
}

export default function FiltersPopover({
  value,
  onValueChange,
  filters,
  onSubmit,
  onClear,
}: FiltersPopoverProps) {
  const filtersCount = useMemo(() => {
    let count = 0
    filters.forEach((filter) => {
      if (value && value[filter.key] && value[filter.key].length > 0) {
        count += value[filter.key].length
      }
    })
    return count
  }, [filters, value])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Filter /> Filters
          {filtersCount > 0 && (
            <Badge
              variant="default"
              className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
            >
              {filtersCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="text-sm flex flex-col gap-2" align="end">
        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <Filter />
            <h5>Filters</h5>
          </div>
          <div className="flex gap-2 text-xs items-center justify-end">
            <Button
              className="py-1 h-7"
              size="sm"
              variant="outline"
              onClick={() => onClear?.()}
            >
              Reset
            </Button>
            <Button
              className="py-0.5 h-7"
              size="sm"
              variant="default"
              onClick={() => onSubmit?.()}
            >
              Apply
            </Button>
          </div>
        </div>
        <Separator />
        {filters.map((filter) => (
          <div key={filter.key} className="flex flex-col gap-2">
            <p className="font-bold">{filter.label}</p>
            <div>
              <FilterToggleGroup
                items={filter.items}
                value={value ? value[filter.key] : undefined}
                onValueChange={(newValue) =>
                  onValueChange?.({ ...value, [filter.key]: newValue })
                }
              />
            </div>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  )
}
