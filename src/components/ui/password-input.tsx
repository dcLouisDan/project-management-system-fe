import * as React from 'react'

import { cn } from '@/lib/utils'
import { Eye, EyeOff } from 'lucide-react'

function PasswordInput({ className, ...props }: React.ComponentProps<'input'>) {
  const [visible, setVisible] = React.useState(false)
  const toggleVisibility = () => setVisible((v) => !v)
  const toggleIconClass = 'size-6'
  return (
    <div className="relative">
      <input
        type={visible ? 'text' : 'password'}
        autoComplete="off"
        data-slot="input"
        className={cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          className,
        )}
        {...props}
      />
      <button
        type="button"
        onClick={toggleVisibility}
        className="absolute right-0 -translate-1/2 top-1/2 cursor-pointer hover:text-foreground/70"
      >
        {visible ? (
          <EyeOff className={cn(toggleIconClass)} />
        ) : (
          <Eye className={cn(toggleIconClass, 'opacity-50')} />
        )}
      </button>
    </div>
  )
}

export { PasswordInput }
