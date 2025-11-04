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
import { Label } from './ui/label'

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

  const onResetFilter = (filterKey: string) => {
    if (value) {
      const newValue = { ...value }
      newValue[filterKey] = []
      onValueChange?.(newValue)
    }
  }

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
      <PopoverContent className="text-sm p-0" align="end">
        <div className="flex gap-2 items-center p-2">
          <Filter className="size-4" />
          <p className="font-bold">Filters</p>
          {filtersCount > 0 && (
            <Badge
              variant="default"
              className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
            >
              {filtersCount}
            </Badge>
          )}
        </div>

        <Separator />
        {filters.map((filter) => (
          <div key={filter.key} className="flex flex-col gap-2 p-2">
            <div className="flex items-center justify-between">
              <Label className="text-muted-foreground">{filter.label}</Label>
              <Button
                variant="link"
                size="sm"
                onClick={() => onResetFilter(filter.key)}
              >
                Reset
              </Button>
            </div>
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
        <Separator />
        <div className="flex gap-2 text-xs items-center justify-between p-2">
          <Button size="sm" variant="secondary" onClick={() => onClear?.()}>
            Reset
          </Button>
          <Button size="sm" variant="default" onClick={() => onSubmit?.()}>
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
