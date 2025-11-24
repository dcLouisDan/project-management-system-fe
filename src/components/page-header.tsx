import type { ReactNode } from 'react'

interface PageHeaderProps {
  title?: string
  description?: string
  children?: ReactNode
}

export default function PageHeader({
  title,
  description,
  children,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center justify-between">
      <div className="grid gap-1">
        <h3 className="lead-none">{title}</h3>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2 flex-wrap">{children}</div>
    </div>
  )
}
