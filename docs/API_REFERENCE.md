# API Reference

> **Note:** This document describes the API endpoints that the frontend calls. It reflects the current API contract as implemented in the frontend codebase. Backend implementation details are not documented here.

## Base Configuration

**Base URL:** `VITE_BACKEND_URL` (default: `http://localhost:8000`)  
**API Root:** `VITE_BACKEND_API_ROOT` (default: `/api/v1`)  
**Full API URL:** `${BACKEND_URL}${BACKEND_API_ROOT}`

All API calls are made through the centralized axios instance configured in `src/lib/api/request.ts`.

**Headers:**
- `Content-Type: application/json`
- `Accept: application/json`
- `X-Requested-With: XMLHttpRequest`
- `X-XSRF-TOKEN: <token>` (for authenticated requests)

**Authentication:**
- Session-based authentication (Laravel Sanctum)
- CSRF token required for state-changing operations (POST, PUT, DELETE)
- CSRF token obtained via `GET /sanctum/csrf-cookie` before authenticated requests
- Token sent in `X-XSRF-TOKEN` header
- Credentials included in all requests (`withCredentials: true`) for cookie support

## Authentication

### Get CSRF Cookie

**GET** `/sanctum/csrf-cookie`

Get CSRF token cookie for subsequent requests.

**Response:** Sets `XSRF-TOKEN` cookie

---

### Register User

**POST** `/auth/register`

Register a new user account.

**Request Body:**
```typescript
{
  name: string
  email: string
  password: string
  password_confirmation: string
}
```

**Response:** `201 Created`
```typescript
{
  data: {
    user: User
  }
}
```

**Note:** Automatically fetches current user after registration.

---

### Login

**POST** `/auth/login`

Authenticate user and create session.

**Request Body:**
```typescript
{
  email: string
  password: string
  remember?: boolean
}
```

**Response:** `200 OK`
```typescript
{
  data: {
    two_factor: boolean
    user: User
  }
}
```

---

### Logout

**POST** `/auth/logout`

End user session.

**Request Body:** `{}`

**Response:** `204 No Content`

---

### Get Current User

**GET** `/user`

Get authenticated user information.

**Response:** `200 OK`
```typescript
{
  data: {
    user: User
  }
}
```

**Error:** `401 Unauthorized` if not authenticated

---

### Update Profile

**PUT** `/auth/user/profile-information`

Update authenticated user's profile information.

**Request Body:**
```typescript
{
  name?: string
  email?: string
}
```

**Response:** `200 OK`

---

### Update Password

**PUT** `/auth/user/password`

Update authenticated user's password.

**Request Body:**
```typescript
{
  current_password: string
  password: string
  password_confirmation: string
}
```

**Response:** `200 OK`

---

## Users

### List Users

**GET** `/users`

Get paginated list of users.

**Query Parameters:**
```typescript
{
  page?: number
  per_page?: number
  name?: string
  role?: string
  roles?: string  // Comma-separated
  sort?: string
  direction?: 'asc' | 'desc'
  project_id?: number
  team_id?: number
  delete_status?: 'all' | 'deleted' | 'active'
}
```

**Response:** `200 OK`
```typescript
{
  data: User[]
  links: {
    first: string
    last: string
    prev?: string
    next?: string
  }
  meta: {
    current_page: number
    from: number
    last_page: number
    links: Array<{
      active: boolean
      label: string
      url: string | null
      page: number | null
    }>
    path: string
    per_page: number
    to: number
    total: number
  }
}
```

---

### Get User

**GET** `/users/:userId`

Get single user by ID.

**Response:** `200 OK`
```typescript
{
  data: User
}
```

**Error:** `404 Not Found` if user doesn't exist

---

### Create User

**POST** `/users`

Create a new user.

**Request Body:**
```typescript
{
  name: string
  email: string
  password: string
  password_confirmation: string
  roles: Role[]
}
```

**Response:** `201 Created`
```typescript
{
  data: User
  message?: string
}
```

---

### Update User

**PUT** `/users/:userId`

Update user information.

**Request Body:**
```typescript
{
  name: string
  email: string
  password?: string
  password_confirmation?: string
  roles: Role[]
}
```

**Response:** `200 OK`
```typescript
{
  data: User
}
```

---

### Delete User

**DELETE** `/users/:userId`

Soft delete a user.

**Response:** `200 OK`
```typescript
{
  data: null
  message?: string
}
```

---

### Restore User

**POST** `/users/:userId/restore`

Restore a soft-deleted user.

**Response:** `200 OK`
```typescript
{
  data: User
}
```

---

## Teams

### List Teams

**GET** `/teams`

Get paginated list of teams.

**Query Parameters:**
```typescript
{
  page?: number
  per_page?: number
  name?: string
  has_leader?: boolean
  sort?: string
  direction?: 'asc' | 'desc'
  delete_status?: 'all' | 'deleted' | 'active'
  project_id?: number
  member_id?: number
}
```

**Response:** `200 OK`
```typescript
{
  data: Team[]
  links: PaginationLinks
  meta: PaginationMeta
}
```

---

### Get Team

**GET** `/teams/:teamId`

Get single team by ID.

**Response:** `200 OK`
```typescript
{
  data: Team
}
```

---

### Create Team

**POST** `/teams`

Create a new team.

**Request Body:**
```typescript
{
  name: string
  description?: string
}
```

**Response:** `201 Created`
```typescript
{
  data: Team
}
```

---

### Update Team

**PUT** `/teams/:teamId`

Update team information.

**Request Body:**
```typescript
{
  name: string
  description?: string
}
```

**Response:** `200 OK`
```typescript
{
  data: Team
}
```

---

### Delete Team

**DELETE** `/teams/:teamId`

Soft delete a team.

**Response:** `200 OK`
```typescript
{
  data: null
}
```

---

### Restore Team

**POST** `/teams/:teamId/restore`

Restore a soft-deleted team.

**Response:** `200 OK`
```typescript
{
  data: Team
}
```

---

### Add Team Member

**POST** `/teams/:teamId/members`

Add a member to a team.

**Request Body:**
```typescript
{
  id: number
  role: 'team lead' | 'team member'
}
```

**Response:** `200 OK`
```typescript
{
  data: null
}
```

---

### Add Team Members (Bulk)

**POST** `/teams/:teamId/members/bulk`

Add multiple members to a team.

**Request Body:**
```typescript
{
  members: Array<{
    user_id: number
    role: 'team lead' | 'team member'
  }>
}
```

**Response:** `200 OK`
```typescript
{
  data: {
    invalid_users?: InvalidTeamMembers
  }
}
```

---

### Sync Team Members

**POST** `/teams/:teamId/members/sync`

Sync team members (replace all members).

**Request Body:**
```typescript
{
  members: Array<{
    user_id: number
    role: 'team lead' | 'team member'
  }>
}
```

**Response:** `200 OK`
```typescript
{
  data: Team
}
```

---

### Remove Team Member

**DELETE** `/teams/:teamId/members/:userId`

Remove a member from a team.

**Response:** `200 OK`
```typescript
{
  data: null
}
```

---

### Remove Team Members (Bulk)

**DELETE** `/teams/:teamId/members`

Remove multiple members from a team.

**Request Body:**
```typescript
{
  user_ids: number[]
}
```

**Response:** `200 OK`
```typescript
{
  data: null
}
```

---

## Projects

### List Projects

**GET** `/projects`

Get paginated list of projects.

**Query Parameters:**
```typescript
{
  page?: number
  per_page?: number
  name?: string
  start_date?: string
  due_date?: string
  sort?: string
  direction?: 'asc' | 'desc'
  delete_status?: 'all' | 'deleted' | 'active'
  manager_id?: number
  start_date_from?: string
  start_date_to?: string
  due_date_from?: string
  due_date_to?: string
  member_id?: number
  team_id?: number
  status?: ProgressStatus
}
```

**Response:** `200 OK`
```typescript
{
  data: Project[]
  links: PaginationLinks
  meta: PaginationMeta
}
```

---

### Get Project

**GET** `/projects/:projectId`

Get single project by ID.

**Response:** `200 OK`
```typescript
{
  data: Project
}
```

---

### Create Project

**POST** `/projects`

Create a new project.

**Request Body:**
```typescript
{
  name: string
  description?: string
  status: ProgressStatus
  start_date: string  // YYYY-MM-DD
  due_date?: string   // YYYY-MM-DD
}
```

**Response:** `201 Created`
```typescript
{
  data: Project
}
```

---

### Update Project

**PUT** `/projects/:projectId`

Update project information.

**Request Body:**
```typescript
{
  name: string
  description?: string
  status: ProgressStatus
  start_date: string
  due_date?: string
}
```

**Response:** `200 OK`
```typescript
{
  data: Project
}
```

---

### Delete Project

**DELETE** `/projects/:projectId`

Soft delete a project.

**Response:** `200 OK`
```typescript
{
  data: null
}
```

---

### Restore Project

**POST** `/projects/:projectId/restore`

Restore a soft-deleted project.

**Response:** `200 OK`
```typescript
{
  data: Project
}
```

---

### Sync Project Teams

**POST** `/projects/:projectId/teams/sync`

Sync teams assigned to a project.

**Request Body:**
```typescript
{
  team_ids: number[]
}
```

**Response:** `200 OK`
```typescript
{
  data: Project
}
```

---

### Assign Project Manager

**POST** `/projects/:projectId/manager`

Assign or remove a project manager.

**Request Body:**
```typescript
{
  manager_id?: number  // undefined to remove manager
}
```

**Response:** `200 OK`
```typescript
{
  data: Project
}
```

---

## Tasks

### List Tasks

**GET** `/tasks`

Get paginated list of tasks.

**Query Parameters:**
```typescript
{
  page?: number
  per_page?: number
  title?: string
  due_date?: string
  sort?: string
  status?: ProgressStatus
  priority?: PriorityLevel
  project_id?: number
  assigned_to_id?: number
  assigned_by_id?: number
  direction?: 'asc' | 'desc'
  delete_status?: 'all' | 'deleted' | 'active'
}
```

**Response:** `200 OK`
```typescript
{
  data: Task[]
  links: PaginationLinks
  meta: PaginationMeta
}
```

---

### Get Task

**GET** `/tasks/:taskId`

Get single task by ID.

**Response:** `200 OK`
```typescript
{
  data: Task
}
```

---

### Create Task

**POST** `/projects/:projectId/tasks`

Create a new task in a project.

**Request Body:**
```typescript
{
  title: string
  description?: string
  priority: PriorityLevel
  due_date?: string  // YYYY-MM-DD
}
```

**Response:** `201 Created`
```typescript
{
  data: Task
}
```

---

### Update Task

**PUT** `/tasks/:taskId`

Update task information.

**Request Body:**
```typescript
{
  title: string
  description?: string
  priority: PriorityLevel
  due_date?: string
}
```

**Response:** `200 OK`
```typescript
{
  data: Task
}
```

---

### Delete Task

**DELETE** `/tasks/:taskId`

Soft delete a task.

**Response:** `200 OK`
```typescript
{
  data: null
}
```

---

### Restore Task

**POST** `/tasks/:taskId/restore`

Restore a soft-deleted task.

**Response:** `200 OK`
```typescript
{
  data: Task
}
```

---

### Sync Task Relations

**POST** `/tasks/:taskId/sync-relations`

Sync related tasks and milestones.

**Request Body:**
```typescript
{
  tasks?: Array<{
    id: number
    relation_type: ProjectRelation
  }>
  milestones?: Array<{
    id: number
    relation_type: ProjectRelation
  }>
}
```

**Response:** `200 OK`
```typescript
{
  data: Task
}
```

---

### Assign Task to User

**POST** `/tasks/:taskId/assign-user`

Assign or unassign a task to a user.

**Request Body:**
```typescript
{
  assign_to?: number  // undefined to unassign
}
```

**Response:** `200 OK`
```typescript
{
  data: Task
}
```

---

### Start Task

**POST** `/tasks/:taskId/start`

Mark a task as "in progress".

**Response:** `200 OK`
```typescript
{
  data: Task
}
```

---

### Submit Task

**POST** `/tasks/:taskId/submit`

Submit a task for review.

**Request Body:**
```typescript
{
  notes?: string
}
```

**Response:** `200 OK`
```typescript
{
  data: Task
}
```

---

### Start Task Review

**POST** `/tasks/:taskId/reviews/:reviewId/start`

Start reviewing a task.

**Response:** `200 OK`
```typescript
{
  data: Task
}
```

---

### Submit Task Review

**POST** `/tasks/:taskId/reviews/:reviewId/submit`

Submit a task review.

**Request Body:**
```typescript
{
  feedback: string
  status: ProgressStatus  // 'approved' | 'rejected' | etc.
}
```

**Response:** `200 OK`
```typescript
{
  data: Task
}
```

---

## Dashboard (Proposed)

> **⚠️ PROPOSED ENDPOINTS:** These endpoints do not exist in the backend yet. This section documents the suggested API contract for dashboard functionality. Backend implementation is required before frontend integration.

### Get Dashboard Statistics

**GET** `/dashboard/stats`

Get aggregated statistics for the admin dashboard overview.

**Response:** `200 OK`
```typescript
{
  data: {
    users: {
      total: number
      active: number
      deleted: number
      by_role: {
        admin: number
        project_manager: number
        team_lead: number
        team_member: number
      }
    }
    teams: {
      total: number
      with_lead: number
      without_lead: number
      active: number      // teams with active projects
    }
    projects: {
      total: number
      active: number      // not_started + in_progress
      completed: number
      cancelled: number
      overdue: number     // past due_date and not completed
      by_status: {
        not_started: number
        in_progress: number
        awaiting_review: number
        under_review: number
        completed: number
        approved: number
        rejected: number
        cancelled: number
      }
    }
    tasks: {
      total: number
      pending: number     // not_started
      in_progress: number
      awaiting_review: number
      completed: number
      overdue: number     // past due_date and not completed
      by_priority: {
        low: number
        medium: number
        high: number
        urgent: number
      }
      by_status: {
        not_started: number
        in_progress: number
        awaiting_review: number
        under_review: number
        completed: number
        approved: number
        rejected: number
        cancelled: number
      }
    }
  }
}
```

---

### Get Recent Projects

**GET** `/dashboard/recent-projects`

Get recently created or updated projects for dashboard display.

**Query Parameters:**
```typescript
{
  limit?: number  // Default: 5, Max: 10
}
```

**Response:** `200 OK`
```typescript
{
  data: Array<{
    id: number
    name: string
    status: ProgressStatus
    manager?: {
      id: number
      name: string
    }
    teams_count: number
    tasks_count: number
    completed_tasks_count: number
    start_date: string
    due_date?: string
    is_overdue: boolean
    created_at: string
    updated_at: string
  }>
}
```

---

### Get Recent Tasks

**GET** `/dashboard/recent-tasks`

Get recently created or updated tasks for dashboard display.

**Query Parameters:**
```typescript
{
  limit?: number  // Default: 5, Max: 10
}
```

**Response:** `200 OK`
```typescript
{
  data: Array<{
    id: number
    title: string
    status: ProgressStatus
    priority: PriorityLevel
    project: {
      id: number
      name: string
    }
    assigned_to?: {
      id: number
      name: string
    }
    due_date?: string
    is_overdue: boolean
    created_at: string
    updated_at: string
  }>
}
```

---

### Get Overdue Items

**GET** `/dashboard/overdue`

Get counts and lists of overdue projects and tasks.

**Query Parameters:**
```typescript
{
  include_items?: boolean  // Default: false, if true includes item lists
  limit?: number           // Default: 5, Max: 10 (for item lists)
}
```

**Response:** `200 OK`
```typescript
{
  data: {
    projects: {
      count: number
      items?: Array<{
        id: number
        name: string
        due_date: string
        days_overdue: number
      }>
    }
    tasks: {
      count: number
      items?: Array<{
        id: number
        title: string
        project_name: string
        due_date: string
        days_overdue: number
        priority: PriorityLevel
      }>
    }
  }
}
```

---

### Get Team Activity

**GET** `/dashboard/team-activity`

Get team activity metrics for dashboard display.

**Query Parameters:**
```typescript
{
  limit?: number  // Default: 5, Max: 10
}
```

**Response:** `200 OK`
```typescript
{
  data: Array<{
    id: number
    name: string
    lead?: {
      id: number
      name: string
    }
    members_count: number
    active_projects_count: number
    active_tasks_count: number
    completed_tasks_this_month: number
  }>
}
```

---

### Get Activity Timeline

**GET** `/dashboard/activity`

Get recent activity across the system (optional, for activity feed widget).

**Query Parameters:**
```typescript
{
  limit?: number  // Default: 10, Max: 20
}
```

**Response:** `200 OK`
```typescript
{
  data: Array<{
    id: number
    type: 'project_created' | 'project_completed' | 'task_created' | 'task_completed' | 'task_assigned' | 'team_created' | 'user_created'
    subject: {
      id: number
      type: 'project' | 'task' | 'team' | 'user'
      name: string
    }
    actor?: {
      id: number
      name: string
    }
    created_at: string
  }>
}
```

---

### Dashboard Data Types

```typescript
// Summary for dashboard cards
interface DashboardStats {
  users: UserStats
  teams: TeamStats
  projects: ProjectStats
  tasks: TaskStats
}

interface UserStats {
  total: number
  active: number
  deleted: number
  by_role: Record<Role, number>
}

interface TeamStats {
  total: number
  with_lead: number
  without_lead: number
  active: number
}

interface ProjectStats {
  total: number
  active: number
  completed: number
  cancelled: number
  overdue: number
  by_status: Record<ProgressStatus, number>
}

interface TaskStats {
  total: number
  pending: number
  in_progress: number
  awaiting_review: number
  completed: number
  overdue: number
  by_priority: Record<PriorityLevel, number>
  by_status: Record<ProgressStatus, number>
}
```

---

## Data Types

### User

```typescript
interface User {
  id: number
  name: string
  email: string
  roles: string[]
  created_at: string
  deleted_at?: string
}
```

### Team

```typescript
interface Team {
  id: number
  name: string
  description?: string
  lead?: User
  members: User[]
  projects: Project[]
  created_at: string
  updated_at?: string
  deleted_at?: string
}
```

### Project

```typescript
interface Project {
  id: number
  name: string
  description?: string
  manager?: User
  teams: Team[]
  status: ProgressStatus
  start_date: string
  due_date?: string | null
  created_at: string
  updated_at?: string
  deleted_at?: string | null
}
```

### Task

```typescript
interface Task {
  id: number
  project_id: number
  project?: Project
  assigned_to?: User
  assigned_by?: User
  title: string
  description?: string
  status: ProgressStatus
  priority: PriorityLevel
  due_date?: string
  reviews: TaskReview[]
  created_at: string
  updated_at: string
  deleted_at?: string
}
```

### TaskReview

```typescript
interface TaskReview {
  id: number
  task_id: number
  task?: Task
  submitted_by?: User
  reviewed_by?: User
  submission_notes: string
  feedback: string
  status: ProgressStatus
  reviewed_at?: string
  created_at: string
  updated_at?: string
}
```

### ProgressStatus

```typescript
type ProgressStatus = 
  | 'not_started'
  | 'in_progress'
  | 'awaiting_review'
  | 'under_review'
  | 'completed'
  | 'approved'
  | 'rejected'
  | 'cancelled'
```

### PriorityLevel

```typescript
type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent'
```

### Role

```typescript
type Role = 
  | 'admin'
  | 'project manager'
  | 'team lead'
  | 'team member'
```

## Error Handling

### Error Response Format

```typescript
interface ApiError {
  status?: number
  message: string
  errors?: Record<string, string[]> | null
  raw?: any
}
```

### HTTP Status Codes

- `200 OK` - Success
- `201 Created` - Resource created
- `204 No Content` - Success with no body
- `400 Bad Request` - Validation errors
- `401 Unauthorized` - Not authenticated
- `404 Not Found` - Resource not found
- `419 CSRF Token Mismatch` - Invalid CSRF token
- `422 Unprocessable Entity` - Validation errors
- `500 Internal Server Error` - Server error

### Error Handling in Frontend

**API Interceptor:**
- Automatically handles `401` and `419` errors
- Logs out user and redirects to login

**Custom Hook Pattern:**
```tsx
try {
  await apiCall()
} catch (err) {
  const error = err as ApiError
  setError(error.message)
  if (error.errors) {
    // Extract validation errors
    const fieldErrors: Record<string, string> = {}
    for (const key in error.errors) {
      fieldErrors[key] = error.errors[key].join(' ')
    }
    setValidationErrors(fieldErrors)
  }
}
```

### Validation Errors

Validation errors are returned in the `errors` field:

```typescript
{
  message: "The given data was invalid.",
  errors: {
    "email": ["The email has already been taken."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

## Authentication Flow (Frontend Implementation)

### Initial Authentication

1. **Get CSRF Cookie** - `GET /sanctum/csrf-cookie`
   - Sets `XSRF-TOKEN` cookie in browser
   - Required before any authenticated requests

2. **Login/Register** - `POST /auth/login` or `POST /auth/register`
   - Includes `X-XSRF-TOKEN` header with token from cookie
   - Backend creates session cookie (HTTP-only)
   - Response includes user data

3. **Store User State** - Frontend stores user in Zustand store
   - Persisted to localStorage
   - Used for route protection

### Subsequent Requests

- All authenticated requests include `X-XSRF-TOKEN` header
- Session cookie automatically sent with `withCredentials: true`
- CSRF token refreshed as needed

### Auto-Logout

- Axios interceptor catches `401` (Unauthorized) or `419` (CSRF Token Mismatch) responses
- Frontend automatically:
  - Clears Zustand store (`unsetUser()`)
  - Redirects to `/auth/login`
  - Prevents infinite redirect loops

**Session Management:**
- Session stored in HTTP-only cookie (managed by backend)
- CSRF token in `XSRF-TOKEN` cookie (read via `js-cookie`)
- Token sent in `X-XSRF-TOKEN` header
- Credentials included in all requests (`withCredentials: true`)

