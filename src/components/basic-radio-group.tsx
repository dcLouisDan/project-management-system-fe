import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { BasicSelectItem } from './basic-select'

interface BasicRadioGroupProps {
  items: BasicSelectItem[]
  className?: string
  value?: string
  onValueChange?: (value: string | undefined) => void
}

export default function BasicRadioGroup({
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
      className={className}
    >
      {items.map((item) => (
        <div className="flex items-center space-x-2">
          <RadioGroupItem value={item.value} id={item.value} />
          <Label htmlFor={item.value}>{item.label}</Label>
        </div>
      ))}
    </RadioGroup>
  )
}
