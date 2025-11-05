import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  RoleLucideIcons,
  RoleSelectItems,
  RoleDescriptions,
  type Role,
} from '@/lib/types/role'

interface RolesToggleSelectProps {
  value?: string[]
  onValueChange?: (value: string[]) => void
}

export default function RolesToggleSelect({
  value,
  onValueChange,
}: RolesToggleSelectProps) {
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
      {RoleSelectItems?.map((item) => {
        const Icon = RoleLucideIcons[item.value as Role]
        return (
          <ToggleGroupItem
            key={item.value}
            value={item.value}
            aria-label={item.label}
            className="h-20 sm:h-16 w-full sm:w-fit toggle-item-parent data-[state=on]:bg-primary data-[state=on]:text-primary-foreground flex items-center gap-2 cursor-pointer"
          >
            <Icon className="size-6" />
            <div className="text-left">
              <p>{item.label}</p>
              <p className="font-light text-xs text-wrap ">
                {RoleDescriptions[item.value as Role]}
              </p>
            </div>
          </ToggleGroupItem>
        )
      })}
    </ToggleGroup>
  )
}
