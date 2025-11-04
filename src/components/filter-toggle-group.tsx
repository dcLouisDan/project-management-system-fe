import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { BasicSelectItem } from './basic-select'
import { Check } from 'lucide-react'

interface FilterToggleGroupProps {
  items?: BasicSelectItem[]
  value?: string[]
  onValueChange?: (value: string[]) => void
}

export function FilterToggleGroup({
  items,
  value,
  onValueChange,
}: FilterToggleGroupProps) {
  return (
    <ToggleGroup
      type="multiple"
      variant="outline"
      spacing={2}
      size="sm"
      value={value}
      onValueChange={onValueChange}
      className="flex flex-wrap"
    >
      {items?.map((item) => (
        <ToggleGroupItem
          key={item.value}
          value={item.value}
          aria-label={item.label}
          className="toggle-item-parent data-[state=on]:bg-accent data-[state=on]:text-accent-foreground flex items-center gap-1 cursor-pointer"
        >
          <Check className="[.toggle-item-parent[data-state=on]_&]:block hidden" />
          {item.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
