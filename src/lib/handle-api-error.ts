import axios, { AxiosError } from 'axios'
import { notFound } from '@tanstack/react-router'

export type ApiError = {
  status?: number
  message: string
  errors?: Record<string, string[]> | null
  raw?: any
}

export function handleApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<any>

    if (err.response) {
      const { status, data } = err.response
      return {
        status,
        message: data.message || 'An error occurred',
        errors: data?.errors || null,
        raw: err,
      }
    }

    if (err.request) {
      return {
        message: 'No response received from server',
        raw: err,
      }
    }

    return {
      message: err.message,
      raw: err,
    }
  }
  return {
    message: (error as Error).message || 'An unknown error occurred',
    raw: error,
  }
}

/**
 * Standardized error handler for TanStack Router routes.
 * Checks if the error is a 404 and throws notFound(), otherwise re-throws the error.
 *
 * This function should be used as the `onError` handler in route definitions:
 * ```tsx
 * export const Route = createFileRoute('/path')({
 *   onError: handleRouteError,
 *   // ...
 * })
 * ```
 *
 * @param err - The error from the route loader or component
 * @throws {notFound} - If the error status is 404
 * @throws {Error} - Re-throws the original error if not a 404
 */
export function handleRouteError(err: unknown): never {
  // Type guard: check if error has status property
  const error = err as ApiError

  // Check if error has status property and it's 404 (using strict equality)
  if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
    throw notFound()
  }

  // Re-throw the error to be handled by parent error boundaries
  throw err
}
