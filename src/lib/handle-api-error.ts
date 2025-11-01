import axios, { AxiosError } from 'axios'

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
