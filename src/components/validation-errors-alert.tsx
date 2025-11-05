import { AlertCircleIcon } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface ValidationErrorsAlertProps {
  title?: string
  description?: string
  errorList?: string[]
}

export function ValidationErrorsAlert({
  title = 'Unable to process your submission',
  description = 'Please verify the the details provided in the form',
  errorList = [],
}: ValidationErrorsAlertProps) {
  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <p>{description}</p>
        <ul className="list-inside list-disc text-sm">
          {errorList.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  )
}
