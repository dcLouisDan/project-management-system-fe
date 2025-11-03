import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface BasicSelectItem {
  value: string
  label: string
}

interface BasicSelectProps {
  label?: string
  items?: BasicSelectItem[]
  value?: string | undefined
  onValueChange?: (value: string) => void
  className?: string
}

export function BasicSelect({
  label = 'Select an option',
  items,
  value,
  onValueChange = () => {},
  className,
}: BasicSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {items?.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
