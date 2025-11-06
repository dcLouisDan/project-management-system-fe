import { Trash2 } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface RestoreAlertProps {
  resource?: string
}

export function RestoreAlert({ resource = 'resource' }: RestoreAlertProps) {
  return (
    <Alert className="bg-destructive/80 text-white">
      <Trash2 />
      <AlertTitle>This {resource} has been deleted.</AlertTitle>
      <AlertDescription className="text-white/80">
        This {resource} is currently inactive and hidden from the system. It
        won't be accessible or visible in other parts of the application until
        restored.
      </AlertDescription>
    </Alert>
  )
}
