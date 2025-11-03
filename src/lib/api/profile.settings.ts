import { handleApiError } from '../handle-api-error'
import type { UserPasswordUpdate, UserProfileUpdate } from '../types/user'
import api from './request'
import Cookies from 'js-cookie'

export function updateUserProfile(data: UserProfileUpdate) {
  const XSRFToken = Cookies.get('XSRF-TOKEN')
  return api
    .put('/auth/user/profile-information', data, {
      headers: {
        'X-XSRF-TOKEN': XSRFToken || '',
      },
    })
    .catch((error) => {
      throw handleApiError(error)
    })
}

export function updateUserPassword(data: UserPasswordUpdate) {
  const XSRFToken = Cookies.get('XSRF-TOKEN')
  return api
    .put('/auth/user/password', data, {
      headers: {
        'X-XSRF-TOKEN': XSRFToken || '',
      },
    })
    .catch((error) => {
      throw handleApiError(error)
    })
}
