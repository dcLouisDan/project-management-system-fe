import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { UiColorConfig } from '@/lib/types/ui'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

export interface IconSelectItem {
  value: string
  label: string
  icon?: LucideIcon
  colors?: UiColorConfig
}

interface BasicRadioGroupProps {
  items: IconSelectItem[]
  className?: string
  value?: string
  onValueChange?: (value: string | undefined) => void
}

export default function IconRadioGroup({
  value,
  onValueChange,
  items,
  className,
}: BasicRadioGroupProps) {
  if (items.length < 1) return null
  return (
    <RadioGroup
      value={value}
      onValueChange={onValueChange}
      defaultValue={items[0].value}
      className={cn('flex gap-2', className)}
    >
      {items.map((item) => {
        const { icon: Icon, colors } = item
        const active = item.value == value
        const activeClass = colors
          ? `${colors.foreground} ${colors.background}`
          : 'bg-info text-info-foreground'
        return (
          <div className="flex flex-1 items-center space-x-2">
            <RadioGroupItem
              className="hidden"
              value={item.value}
              id={item.value}
            />
            <Label
              className={cn(
                'w-full border rounded-lg px-4 py-2 transition-all ease-in-out duration-150',
                active && activeClass,
              )}
              htmlFor={item.value}
            >
              {Icon && <Icon />}
              <p className="text-center w-full">{item.label}</p>
            </Label>
          </div>
        )
      })}
    </RadioGroup>
  )
}
