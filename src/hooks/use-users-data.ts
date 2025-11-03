import { fetchUsers } from '@/lib/api/users'
import { QUERY_KEYS } from '@/lib/constants'
import type { ApiError } from '@/lib/handle-api-error'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useUsersData(page: number, per_page: number) {
  return useQuery({
    queryKey: [QUERY_KEYS.USERS, page, per_page],
    queryFn: async () => {
      try {
        const response = await fetchUsers(page, per_page)
        return response.data
      } catch (err) {
        const error = err as ApiError
        toast.error(error.message || 'Failed to fetch users')
      }
    },
  })
}
