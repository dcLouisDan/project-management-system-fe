# Frontend Architecture

## High-Level Overview

The frontend is a React 19 single-page application (SPA) built with modern tooling:

**Core Technologies:**
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server

**Routing & Navigation:**
- **TanStack Router** - File-based routing with type-safe navigation

**State Management:**
- **TanStack Query (React Query)** - Server state (API data caching)
- **Zustand** - Global client state (authentication, UI preferences)
- **TanStack Form** - Form state management

**UI & Styling:**
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - Component library built on Radix UI primitives
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library

## Application Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base shadcn/ui components
│   └── forms/          # Form components
├── hooks/              # Custom React hooks
├── integrations/       # Third-party library integrations
│   ├── zustand/       # Zustand store configuration
│   └── tanstack-query/ # React Query setup
├── lib/                # Utilities, types, API clients
│   ├── api/           # API function modules
│   ├── query-options/ # React Query query options
│   └── types/         # TypeScript type definitions
├── routes/             # TanStack Router file-based routes
│   ├── __root.tsx     # Root route
│   ├── _main/         # Protected main layout routes
│   │   ├── dashboard/ # Dashboard with role-based layouts
│   │   ├── projects/  # Projects routes (list, detail, create, edit, my-projects)
│   │   ├── tasks/     # Tasks routes (list, my-tasks)
│   │   ├── teams/     # Teams routes (list, detail, create, edit, my-teams)
│   │   ├── users/     # Users routes (list, detail, create, edit)
│   │   ├── activity-logs/ # Activity logs (admin only)
│   │   └── settings/  # Settings routes (profile)
│   └── auth/          # Authentication routes
└── styles.css         # Global styles and theme
```

## Routing Strategy

### File-Based Routing

TanStack Router uses file-based routing where file structure maps directly to URL structure:

- `src/routes/__root.tsx` → `/` (root layout)
- `src/routes/_main/route.tsx` → Layout wrapper for protected routes
- `src/routes/_main/dashboard/index.tsx` → `/dashboard` (role-based layouts)
- `src/routes/_main/projects/index.tsx` → `/projects`
- `src/routes/_main/projects/my-projects/index.tsx` → `/projects/my-projects` (project manager only)
- `src/routes/_main/projects/$projectId/index.tsx` → `/projects/:projectId`
- `src/routes/_main/projects/$projectId/edit.tsx` → `/projects/:projectId/edit`
- `src/routes/_main/tasks/index.tsx` → `/tasks` (admin only)
- `src/routes/_main/tasks/my-tasks/index.tsx` → `/tasks/my-tasks` (all roles)
- `src/routes/_main/teams/my-teams/index.tsx` → `/teams/my-teams` (team lead only)
- `src/routes/_main/activity-logs/index.tsx` → `/activity-logs` (admin only)
- `src/routes/auth/login.tsx` → `/auth/login`

### Route Organization Patterns

**Layout Routes:**
- `__root.tsx` - Root layout with providers (React Query, Toaster, DevTools)
- `_main/route.tsx` - Protected layout route with sidebar and authentication guard

**Route-Specific Files:**
- `-components/` folder - Components used only within this route
- `-table/` folder - Table-related files (columns, filters) for list views
- `-not-found-component.tsx` - Custom 404 component for this route
- `-main-inset-layout.tsx` - Shared layout wrapper component

**Naming Conventions:**
- Dynamic route parameters: `$projectId`, `$taskId`, `$userId`, `$teamId`
- Index routes: `index.tsx` (maps to `/`)
- Nested routes: `projects/$projectId/tasks/$taskId/index.tsx`
- Layout routes: Prefix with `_` (e.g., `_main`)

### Route Features

**Loaders:**
- Prefetch data using `queryClient.ensureQueryData()` in route loaders
- Loaders execute before component renders
- Data is available synchronously via `useSuspenseQuery` in components
- Loaders receive `context` (with `queryClient`) and route `params`

**Authentication:**
- `beforeLoad` hook in `_main/route.tsx` checks authentication state
- Reads `isAuthenticated` from Zustand store
- Throws `redirect()` to `/auth/login` if not authenticated
- All routes under `_main/` are protected

**Authorization (Role-Based):**
- `uiMode` in Zustand store determines current user's role
- Use `usePermissions()` hook for permission checks in components
- Navigation items filtered by role via `getNavLinksForRole()`
- Action buttons conditionally rendered based on permissions
- Route-level gating via `beforeLoad` hooks (e.g., Activity Logs admin-only)
- Dashboard renders role-specific layouts (Admin, Project Manager, Team Lead, Team Member)
- See `docs/features/ROLE_UI_PERMISSIONS.md` for permission matrix

**Error Handling:**
- `onError` handlers catch errors from loaders or components
- Use `notFound()` to trigger 404 for missing resources
- Custom `notFoundComponent` provides route-specific 404 UI
- Error boundaries can be added at layout level

**Search Params:**
- `validateSearch` validates and types URL search parameters
- Search params stored in URL for filtering, pagination, sorting
- Access via `Route.useSearch()` hook

**Meta Tags:**
- `head` function returns meta tags for SEO
- Dynamic titles based on route data (e.g., project name)
- Supports both static and dynamic meta content

## Component Hierarchy

### Component Types

1. **UI Components** (`components/ui/`)
   - Base shadcn/ui components (Button, Card, Dialog, Table, etc.)
   - Built on Radix UI primitives
   - Use Class Variance Authority (CVA) for variants
   - Compound components (Card + CardHeader + CardContent)

2. **Feature Components** (`components/`)
   - Higher-level components (AppSidebar, DataTable, PageHeader)
   - Business logic components
   - Reusable across multiple routes

3. **Form Components** (`components/forms/`)
   - Form-specific components (LoginForm, RegistrationForm)
   - Use TanStack Form for form state

4. **Route-Specific Components** (`routes/*/-components/`)
   - Components only used in specific routes
   - Co-located with route files

### Component Patterns

**Layout Components:**
- `AppSidebar` - Main navigation sidebar
- `MainInsetLayout` - Content area with breadcrumbs
- `PageHeader` - Page title and description with actions

**Data Display:**
- `DataTable` - Generic table component using TanStack Table
- `PaginationBar` - Pagination controls
- `UserAvatar` - User avatar display

**Forms:**
- Use TanStack Form for form state
- Field components from `ui/field`
- Zod validation
- `ValidationErrorsAlert` for server errors

## Page Organization

### List Pages Pattern

List pages (index routes) follow this structure:

```tsx
export const Route = createFileRoute('/_main/resource/')({
  component: RouteComponent,
  validateSearch: (search) => search as SearchParams,
  head: () => ({ meta: [...] }),
})

function RouteComponent() {
  // Tabs for Active/Deleted
  // Filter components
  // DataTable
  // PaginationBar
}
```

**Common Features:**
- Tabs for "Active" vs "Deleted" items
- Search/filter components
- DataTable with columns
- Pagination with URL search params
- `useQuery` with query options

### Detail Pages Pattern

Detail pages (show routes) follow this structure:

```tsx
export const Route = createFileRoute('/_main/resource/$id/')({
  component: RouteComponent,
  loader: ({ context, params }) => {
    return queryClient.ensureQueryData(queryOptions(id))
  },
  onError: (err) => {
    if (err.status === 404) throw notFound()
  },
  notFoundComponent: NotFoundComponent,
})

function RouteComponent() {
  const { data } = useSuspenseQuery(queryOptions(id))
  // Display data
  // Action buttons (Edit, Delete, Restore)
}
```

**Common Features:**
- `loader` prefetches data
- `useSuspenseQuery` for data
- `MainInsetLayout` with breadcrumbs
- Action buttons with `ConfirmationDialog` for destructive actions
- `RestoreAlert` for soft-deleted items

### Create/Edit Pages Pattern

Form pages follow this structure:

```tsx
export const Route = createFileRoute('/_main/resource/create')({
  component: RouteComponent,
})

function RouteComponent() {
  const { create, validationErrors, requestProgress } = useManageResource()
  const form = useForm({
    defaultValues: DEFAULT_RESOURCE_CREATE,
    onSubmit: async ({ value }) => await create(value),
  })
  
  useEffect(() => {
    if (requestProgress === 'completed') {
      form.reset()
    }
  }, [requestProgress])
  
  return (
    <MainInsetLayout>
      <PageHeader />
      <Card>
        <form.Field>...</form.Field>
        {validationErrors && <ValidationErrorsAlert />}
      </Card>
    </MainInsetLayout>
  )
}
```

**Common Features:**
- TanStack Form with default values
- `use-manage-*` hooks for mutations
- `requestProgress` state management
- Form reset on success
- Validation error display

## API Integration

### React Query Setup

**Query Options:**
- Located in `lib/query-options/`
- One file per resource (projects, tasks, users, teams)
- Use `queryOptions()` helper
- Query keys centralized in `QUERY_KEYS` constant

**Query Patterns:**
- List queries: `keepPreviousData` for pagination
- Detail queries: Direct data fetching
- Query keys include all filter parameters

**Usage in Routes:**
- Loaders: `queryClient.ensureQueryData(queryOptions)`
- Components: `useSuspenseQuery(queryOptions)` or `useQuery(queryOptions)`

### Custom Hooks Pattern

**Management Hooks:**
- `use-auth.ts` - Authentication operations (login, logout, register)
- `use-manage-projects.ts` - Project CRUD operations
- `use-manage-tasks.ts` - Task CRUD operations and workflow actions
- `use-manage-users.ts` - User CRUD operations
- `use-manage-teams.ts` - Team CRUD operations and member management
- `use-profile-settings.ts` - Authenticated user profile and password updates
- `use-permissions.ts` - Role-based permission checks
- `use-form-reset.ts` - Form reset logic after successful submissions

**Utility Hooks:**
- `use-appearance.ts` - Theme management
- `use-mobile.ts` - Responsive breakpoint detection

**Hook Structure:**
```tsx
export default function useManageResource() {
  const [validationErrors, setValidationErrors] = useState(null)
  const [error, setError] = useState(null)
  const [requestProgress, setRequestProgress] = useState('started')
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  
  async function create(data) {
    setRequestProgress('in-progress')
    try {
      await createResource(data)
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RESOURCE] })
      toast.success('Resource Created')
      setRequestProgress('completed')
    } catch (err) {
      handleError(err)
      setRequestProgress('failed')
    }
  }
  
  return { create, update, destroy, validationErrors, error, requestProgress }
}
```

**Hook Responsibilities:**
- Encapsulate API calls
- Handle errors and validation
- Manage request progress state
- Invalidate React Query cache
- Show toast notifications
- Navigate after mutations

### API Client

**Axios Configuration:**
- Centralized instance in `lib/api/request.ts`
- Base URL from `VITE_BACKEND_URL` environment variable
- API root from `VITE_BACKEND_API_ROOT` (defaults to `/api/v1`)
- CSRF token handling via `X-XSRF-TOKEN` header
- Response interceptor handles `401` (Unauthorized) and `419` (CSRF Token Mismatch) errors
- Auto-logout and redirect to login on authentication errors
- `withCredentials: true` for session cookie support

**API Organization:**
- One file per resource: `auth.ts`, `projects.ts`, `tasks.ts`, `users.ts`, `teams.ts`, `profile.settings.ts`, `dashboard.ts`, `activity-logs.ts`
- Functions return axios responses
- Error handling via `handleApiError()` utility

**Error Handling:**
- `handleApiError()` converts axios errors to `ApiError` type
- Validation errors extracted from `error.errors` object
- Toast notifications using `sonner`
- Error state management in hooks

## Data Flow

### Reading Data

1. **Route Loader** → Prefetches data using `queryClient.ensureQueryData(queryOptions)`
2. **Component** → Uses `useSuspenseQuery(queryOptions)` to access prefetched data
3. **React Query** → Returns cached data immediately (no loading state)

### Mutating Data

1. **User Action** → Triggers mutation (e.g., form submit, button click)
2. **Custom Hook** → Calls mutation function (e.g., `useManageProjects().create()`)
3. **API Function** → Makes HTTP request via axios instance
4. **Error Handling** → `handleApiError()` converts axios errors to `ApiError` type
5. **Hook** → Invalidates React Query cache via `queryClient.invalidateQueries()`
6. **React Query** → Automatically refetches affected queries
7. **Component** → Receives updated data automatically
8. **Toast Notification** → Success/error message displayed to user

## Authentication Flow

### Protected Route Access

1. User navigates to protected route (under `_main/`)
2. `_main/route.tsx` `beforeLoad` hook executes
3. Reads `isAuthenticated` from Zustand store
4. If `false`, throws `redirect({ to: '/auth/login' })`
5. User redirected to login page

### Login Process

1. User submits login form
2. Form calls `useAuth().login(email, password, remember)`
3. Hook calls `loginUser()` API function
4. API function:
   - Gets CSRF cookie via `GET /sanctum/csrf-cookie`
   - Posts credentials to `POST /auth/login`
   - Receives user data in response
5. On success, hook:
   - Updates Zustand store with `setUser(user, remember)`
   - Sets UI mode based on user's primary role
   - Calls `router.invalidate()` to refresh route state
   - Navigates to `/dashboard` via `navigate({ to: '/dashboard' })`

### Logout Process

1. User triggers logout (e.g., via button)
2. Calls `useAuth().logout()`
3. Hook calls `logoutUser()` API function
4. On success (204 response):
   - Clears Zustand store with `unsetUser()`
   - Calls `router.invalidate()`
   - Navigates to `/auth/login`

## State Management Layers

1. **Zustand Store** - Global client state (auth, UI mode)
2. **React Query** - Server state (cached API data)
3. **Local State** - Component-specific UI state (useState)
4. **TanStack Form** - Form state (managed by form library)

## Feature-Specific Routes

### Dashboard
- **Route:** `/dashboard`
- **Access:** All authenticated users
- **Implementation:** Role-based dashboard layouts
  - `AdminDashboardLayout` - Full system overview
  - `ProjectManagerDashboardLayout` - Project manager view
  - `TeamLeadDashboardLayout` - Team lead view
  - `TeamMemberDashboardLayout` - Team member view
- **Data:** Dashboard stats, recent projects, recent tasks (filtered by role)

### My Tasks
- **Route:** `/tasks/my-tasks`
- **Access:** All authenticated users
- **Features:** Tabs for "Assigned to Me" and "Assigned by Me"
- **Filtering:** Uses `assigned_to_id` and `assigned_by_id` query parameters

### My Projects
- **Route:** `/projects/my-projects`
- **Access:** Project Manager role only
- **Filtering:** Uses `manager_id` query parameter

### My Teams
- **Route:** `/teams/my-teams`
- **Access:** Team Lead role only
- **Filtering:** Uses `lead_id` query parameter

### Activity Logs
- **Route:** `/activity-logs`
- **Access:** Admin role only (enforced via `beforeLoad` hook)
- **Features:** System-wide audit log with filtering and pagination
- **Filters:** User, action, auditable type, date range

