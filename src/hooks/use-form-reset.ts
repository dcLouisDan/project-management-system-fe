import { useEffect } from 'react'
import type { FormApi } from '@tanstack/react-form'
import type { RequestProgress } from '@/lib/types/response'

interface UseFormResetOptions<
  TFormData,
  TFormValidator extends object | undefined,
> {
  /**
   * The TanStack Form instance to reset when request completes.
   * If not provided, only the requestProgress state will be reset.
   */
  form?: FormApi<TFormData, TFormValidator>
  /**
   * The current request progress state from a use-manage-* hook.
   */
  requestProgress: RequestProgress
  /**
   * The setter function to update the request progress state.
   */
  setRequestProgress: (progress: RequestProgress) => void
}

/**
 * Custom hook that handles form reset logic after a successful form submission.
 *
 * This hook watches the `requestProgress` state and when it becomes 'completed':
 * 1. Resets the form to its default values (if a form instance is provided)
 * 2. Resets the requestProgress state back to 'started'
 *
 * @example
 * // With form reset (create/edit pages)
 * const { create, validationErrors, requestProgress, setRequestProgress } = useManageProjects()
 * const form = useForm({ defaultValues: DEFAULT_PROJECT_CREATE, onSubmit: ... })
 *
 * useFormReset({ form, requestProgress, setRequestProgress })
 *
 * @example
 * // Without form reset (dialog components that don't need form reset)
 * const { assignManager, requestProgress, setRequestProgress } = useManageProjects()
 *
 * useFormReset({ requestProgress, setRequestProgress })
 */
export default function useFormReset<
  TFormData,
  TFormValidator extends object | undefined = undefined,
>({
  form,
  requestProgress,
  setRequestProgress,
}: UseFormResetOptions<TFormData, TFormValidator>) {
  useEffect(() => {
    if (requestProgress === 'completed') {
      form?.reset()
      setRequestProgress('started')
    }
  }, [form, requestProgress, setRequestProgress])
}

