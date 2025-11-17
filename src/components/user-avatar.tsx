import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getAvatarFallback } from '@/lib/string-utils'
import { cn } from '@/lib/utils'

interface UserAvatarProps {
  name?: string
  src?: string
  className?: string
  textClassName?: string
}

export default function UserAvatar({
  name,
  src,
  className,
  textClassName,
}: UserAvatarProps) {
  return (
    <Avatar className={cn('size-40 rounded-lg mx-auto', className)}>
      <AvatarImage src={src} alt="user avatar" />
      <AvatarFallback className={cn('rounded-lg text-4xl', textClassName)}>
        {name ? getAvatarFallback(name) : 'U'}
      </AvatarFallback>
    </Avatar>
  )
}
