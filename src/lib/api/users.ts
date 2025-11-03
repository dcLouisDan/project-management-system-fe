import api from './request'
import { handleApiError } from '../handle-api-error'
import Cookies from 'js-cookie'

export async function fetchUsers(
  page: number,
  per_page: number = 10,
  name = '',
) {
  const xsrfToken = Cookies.get('XSRF-TOKEN')
  return api
    .get(`/users`, {
      headers: {
        'X-XSRF-TOKEN': xsrfToken || '',
      },
      params: {
        page,
        per_page,
        name,
      },
    })
    .catch((error) => {
      throw handleApiError(error)
    })
}
