import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Button,
  buttonVariants,
  type ButtonVariantTypes,
} from '@/components/ui/button'
import type { ReactNode } from 'react'

interface ConfirmationDialogProps {
  title?: string
  description?: string
  triggerComponent?: ReactNode
  submitButtonContent?: ReactNode
  submitButtonVariant?: ButtonVariantTypes
  onSubmit?: () => void
}

export function ConfirmationDialog({
  title = 'Are you absolutely sure?',
  description = 'This action cannot be undone. This will permanently alter the data from our servers.',
  triggerComponent = <Button variant="outline">Show Dialog</Button>,
  submitButtonContent = 'Continue',
  submitButtonVariant = { variant: 'default' },
  onSubmit = () => {},
}: ConfirmationDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{triggerComponent}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onSubmit}
            className={buttonVariants(submitButtonVariant)}
          >
            {submitButtonContent}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
