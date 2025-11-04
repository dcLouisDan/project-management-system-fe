import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ArrowUpDown } from 'lucide-react'
import { useMemo } from 'react'
import { snakeCaseToTitleCase } from '@/lib/string-utils'
import { Label } from './ui/label'
import { SortDirectionSelectItems, type SortDirection } from '@/lib/types/ui'
import BasicRadioGroup from './basic-radio-group'

interface SortPopoverProps {
  sortableFields?: string[]
  sortValue?: string
  onSortValueChange?: (value: string | undefined) => void
  directionValue?: SortDirection
  onDirectionValueChange?: (value: string | undefined) => void
  onSubmit?: (sort?: string, direction?: SortDirection) => void
  onClear?: () => void
}

export default function SortPopover({
  sortValue,
  onSortValueChange = () => {},
  directionValue,
  onDirectionValueChange = () => {},
  sortableFields = [],
  onSubmit,
  onClear,
}: SortPopoverProps) {
  const sortableOptions = useMemo(() => {
    return sortableFields.map((field) => ({
      value: field,
      label: snakeCaseToTitleCase(field),
    }))
  }, [sortableFields])
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <ArrowUpDown />
          Sort
        </Button>
      </PopoverTrigger>
      <PopoverContent className="text-sm p-0" align="end">
        <div className="flex gap-2 items-center p-2">
          <ArrowUpDown className="size-4" />
          <p className="font-bold">Sort</p>
        </div>
        <Separator />
        <div className="flex flex-col gap-4 p-3">
          <div className="grid gap-3">
            <Label className="text-muted-foreground">Sort by:</Label>
            <BasicRadioGroup
              value={sortValue}
              onValueChange={onSortValueChange}
              className="flex flex-wrap"
              items={sortableOptions}
            />
          </div>
          <div className="grid gap-3">
            <Label className="text-muted-foreground">Direction:</Label>
            <BasicRadioGroup
              value={directionValue}
              onValueChange={onDirectionValueChange}
              className="flex flex-wrap gap-2"
              items={SortDirectionSelectItems}
            />
          </div>
        </div>
        <Separator />
        <div className="flex gap-2 text-xs items-center justify-between p-2">
          <Button size="sm" variant="secondary" onClick={() => onClear?.()}>
            Reset
          </Button>
          <Button
            size="sm"
            variant="default"
            onClick={() => onSubmit?.(sortValue, directionValue)}
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
