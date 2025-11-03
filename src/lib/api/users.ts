import api from './request'
import { handleApiError } from '../handle-api-error'
import Cookies from 'js-cookie'

export async function fetchUsers(page: number, per_page: number = 10) {
  const xsrfToken = Cookies.get('XSRF-TOKEN')
  return api
    .get(`/users?page=${page}&per_page=${per_page}`, {
      headers: {
        'X-XSRF-TOKEN': xsrfToken || '',
      },
    })
    .catch((error) => {
      throw handleApiError(error)
    })
}
