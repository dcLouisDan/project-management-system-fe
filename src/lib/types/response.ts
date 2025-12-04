import type { InvalidTeamMembers, Team } from './team'
import { type User } from './user'

export interface ApiResponse<T> {
  data: T
  message?: string
  statusCode: number
  meta?: Record<string, any>
  errors?: Record<string, string>
}
export type SoftDeleteStatus = 'all' | 'deleted' | 'active'
export type RequestProgress = 'started' | 'in-progress' | 'completed' | 'failed'

export interface PaginatedResponseMetaLinkItem {
  active: boolean
  label: string
  url: string | null
  page: number | null
}

export interface PaginatedResponseMetaData {
  current_page: number
  from: number
  last_page: number
  links: PaginatedResponseMetaLinkItem[]
  path: string
  per_page: number
  to: number
  total: number
}

export interface PaginatedResponse<T> {
  data: T[]
  links: {
    first: string
    last: string
    prev?: string
    next?: string
  }
  meta: PaginatedResponseMetaData
}

// User Responses
export type CheckAdminExistsResponse = ApiResponse<{ exists: boolean }>
export type GetAuthUserResponse = ApiResponse<{ user: User }>
export type ShowUserResponse = { data: User }
export type UserCreateResponse = ApiResponse<User>
export type UserRestoreResponse = ApiResponse<User>
export type UserUpdateResponse = ApiResponse<User>
export type UserDeleteResponse = ApiResponse<null>
export type UserLoginResponse = ApiResponse<{ two_factor: boolean; user: User }>

// Team Response
export type ShowTeamResponse = { data: Team }
export type TeamCreateResponse = ApiResponse<Team>
export type TeamRestoreResponse = ApiResponse<Team>
export type TeamUpdateResponse = ApiResponse<Team>
export type TeamDeleteResponse = ApiResponse<null>
export type TeamAddMemberReponse = ApiResponse<null>
export type TeamAddMembersBulkResponse = ApiResponse<{
  invalid_users: InvalidTeamMembers
}>
export type TeamSetLeaderResponse = ApiResponse<{ previous_lead?: User }>
export type TeamRemoveMemberResponse = ApiResponse<null>
export type TeamRemoveMembersBulkResponse = ApiResponse<null>
export type TeamSyncMembersResponse = ApiResponse<Team>
export type TeamAssignProjectResponse = ApiResponse<null>
export type TeamRemoveProjectResponse = ApiResponse<null>
