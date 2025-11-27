# State Management

## Overview

The application uses a layered approach to state management:

1. **Zustand** - Global client-side state (auth, UI preferences)
2. **React Query (TanStack Query)** - Server state (cached API data)
3. **Local State (useState)** - Component-specific UI state
4. **TanStack Form** - Form state management

## Zustand Store

### Store Structure

**Location:** `src/integrations/zustand/app-store.ts`

**Architecture:**
- Slice-based pattern
- Persisted to localStorage
- Type-safe with TypeScript

**Slices:**
- `auth-slice.ts` - Authentication state
- `ui-slice.ts` - UI mode/role state

### Auth Slice

**State:**
```typescript
{
  isAuthenticated: boolean
  user: User | null
  loading: boolean
  remember: boolean
  setUser: (user: User | null, remember?: boolean) => void
  unsetUser: () => void
  setLoading: (loading: boolean) => void
}
```

**Usage:**
```tsx
const { user, isAuthenticated, setUser } = useAppStore((state) => ({
  user: state.user,
  isAuthenticated: state.isAuthenticated,
  setUser: state.setUser,
}))
```

**When to Use:**
- Authentication status
- Current user data
- Loading states for auth operations
- "Remember me" preference

### UI Slice

**State:**
```typescript
{
  uiMode: Role
  setUiMode: (mode: Role) => void
}
```

**Usage:**
```tsx
const { uiMode, setUiMode } = useAppStore((state) => ({
  uiMode: state.uiMode,
  setUiMode: state.setUiMode,
}))
```

**When to Use:**
- UI mode based on user role
- Theme preferences (future)
- UI state that needs to persist across sessions

### Role-Based Permissions

The `uiMode` state drives role-based UI permissions. Use the `usePermissions` hook to access permissions in components.

**Hook:** `src/hooks/use-permissions.ts`

**Usage:**
```tsx
import { usePermissions } from '@/hooks/use-permissions'

function UserActions({ user }: { user: User }) {
  const { canEditUsers, canDeleteUsers, canEdit, isOwner } = usePermissions()
  
  // Simple permission check
  const showEditButton = canEditUsers
  
  // Contextual permission check (ownership-aware)
  const canEditThisUser = canEdit('user', { ownerId: user.id })
  
  return (
    <>
      {canEditThisUser && <EditButton />}
      {canDeleteUsers && <DeleteButton />}
    </>
  )
}
```

**Available Permission Flags:**

| Category | Permissions |
|----------|-------------|
| Users | `canViewAllUsers`, `canViewTeamUsers`, `canCreateUsers`, `canEditUsers`, `canDeleteUsers` |
| Teams | `canViewAllTeams`, `canViewAssignedTeams`, `canCreateTeams`, `canEditTeams`, `canDeleteTeams` |
| Projects | `canViewAllProjects`, `canViewTeamProjects`, `canCreateProjects`, `canEditProjects`, `canDeleteProjects` |
| Tasks | `canViewAllTasks`, `canViewProjectTasks`, `canViewAssignedTasks`, `canCreateTasks`, `canEditTasks`, `canDeleteTasks`, `canReassignTasks` |

**Contextual Helpers:**
- `canEdit(resourceType, context)` - Check edit permission with ownership context
- `canDelete(resourceType, context)` - Check delete permission with ownership context
- `canAccessNav(section)` - Check navigation section visibility
- `isOwner(ownerId)` - Check if current user owns a resource
- `isManager(managerId)` - Check if current user is the manager
- `isAssignedTo(assignedToId)` - Check if current user is assigned to a task

**See Also:** `docs/features/ROLE_UI_PERMISSIONS.md` for full permission matrix

### Persistence

- Store is persisted to localStorage using Zustand's `persist` middleware
- Storage key: `'app-store'`
- Automatically rehydrates on app initialization
- Only persisted slices are stored (auth and UI slices)
- Sensitive data should not be persisted (passwords, tokens)

## React Query (TanStack Query)

### Purpose

React Query manages all server state:
- API data caching
- Automatic refetching
- Background updates
- Optimistic updates
- Request deduplication

### Query Options Pattern

**Location:** `src/lib/query-options/`

**Structure:**
```typescript
export const resourceQueryOptions = (params: FetchParams) =>
  queryOptions({
    queryKey: [QUERY_KEYS.RESOURCE].concat(Object.values(params)),
    queryFn: async () => {
      const response = await fetchResource(params)
      return response.data
    },
    placeholderData: keepPreviousData, // For pagination
  })
```

**Query Keys:**
- Centralized in `QUERY_KEYS` constant (`lib/constants.ts`)
- Include all filter parameters for proper cache invalidation
- Hierarchical structure: 
  - List: `[QUERY_KEYS.RESOURCE, ...filterParams]`
  - Detail: `[QUERY_KEYS.RESOURCE, id]`

### Query Usage Patterns

**In Route Loaders:**
```tsx
loader: ({ context: { queryClient }, params }) => {
  return queryClient.ensureQueryData(
    showResourceQueryOptions(Number(params.id))
  )
}
```

**In Components (Suspense):**
```tsx
// Use when route has a loader that prefetches data
const { data } = useSuspenseQuery(
  showResourceQueryOptions(Number(id))
)
```

**In Components (Non-Suspense):**
```tsx
// Use for list pages, conditional queries, or when no loader exists
const { data, isFetching, isLoading } = useQuery(
  resourceQueryOptions({ page: 1, per_page: 10 })
)
```

### Mutations

**Pattern:**
- Mutations handled in custom hooks (`use-manage-*`)
- After mutation, invalidate relevant queries
- Show toast notifications
- Navigate if needed

**Example:**
```tsx
async function create(data: ResourceCreate) {
  setRequestProgress('in-progress')
  try {
    await createResource(data)
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.RESOURCE],
    })
    toast.success('Resource Created')
    setRequestProgress('completed')
  } catch (err) {
    handleError(err)
    setRequestProgress('failed')
  }
}
```

### Query Invalidation

**After Create:**
```tsx
queryClient.invalidateQueries({
  queryKey: [QUERY_KEYS.RESOURCE],
})
```

**After Update:**
```tsx
// Invalidate both list and detail queries
queryClient.invalidateQueries({
  queryKey: [QUERY_KEYS.RESOURCE],
})
queryClient.invalidateQueries({
  queryKey: [QUERY_KEYS.RESOURCE, id],
})
```

**After Delete:**
```tsx
queryClient.invalidateQueries({
  queryKey: [QUERY_KEYS.RESOURCE],
})
```

### Query Configuration

**Pagination:**
- Use `keepPreviousData` for smooth pagination
- Prevents loading states when changing pages

**Stale Time:**
- Default: 0 (data is immediately stale)
- Can be configured per query if needed

**Cache Time (gcTime):**
- Default: 5 minutes
- Unused queries are garbage collected after this time
- Can be configured per query if needed

## Local State (useState)

### When to Use

Use `useState` for:
- Component-specific UI state (modals, dropdowns, toggles)
- Form field state (handled by TanStack Form, but UI state like "no due date" checkbox)
- Temporary UI state that doesn't need to persist
- Loading states for component-specific operations

### Common Patterns

**Request Progress:**
```tsx
const [requestProgress, setRequestProgress] = 
  useState<RequestProgress>('started')
```

**Validation Errors:**
```tsx
const [validationErrors, setValidationErrors] = 
  useState<Record<string, string> | null>(null)
```

**Error State:**
```tsx
const [error, setError] = useState<string | null>(null)
```

**UI Toggles:**
```tsx
const [noDueDate, setNoDueDate] = useState(true)
```

## TanStack Form

### Purpose

TanStack Form manages form state:
- Field values
- Validation state
- Submission state
- Field-level errors

### Form Pattern

```tsx
const form = useForm({
  defaultValues: DEFAULT_RESOURCE_CREATE,
  onSubmit: async ({ value }) => {
    await createResource(value)
  },
})

<form.Field
  name="fieldName"
  validators={{
    onChange: z.string().min(1),
  }}
>
  {(field) => (
    <Field>
      <FieldLabel>Label</FieldLabel>
      <Input
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      <FieldError errors={field.state.meta.errors} />
    </Field>
  )}
</form.Field>
```

### Form Reset

**After Successful Submission:**
```tsx
useEffect(() => {
  if (requestProgress === 'completed') {
    form.reset()
    setRequestProgress('started')
  }
}, [requestProgress])
```

## State Management Decision Tree

### Use Zustand When:
- ✅ State needs to be accessed across multiple routes
- ✅ State should persist across page reloads
- ✅ State is global application state (auth, theme, user preferences)

### Use React Query When:
- ✅ Data comes from API
- ✅ Data should be cached
- ✅ Data needs automatic refetching
- ✅ Data is shared across components

### Use Local State (useState) When:
- ✅ State is component-specific
- ✅ State doesn't need to persist
- ✅ State is temporary UI state (modals, dropdowns)
- ✅ State is simple and doesn't need complex logic

### Use TanStack Form When:
- ✅ Managing form input state
- ✅ Need form validation
- ✅ Need form submission handling
- ✅ Need field-level error handling

## Custom Hooks Pattern

### Structure

Custom hooks encapsulate:
- API calls
- Error handling
- State management
- React Query invalidation
- Toast notifications
- Navigation

### Example Hook

```tsx
export default function useManageResource() {
  const [validationErrors, setValidationErrors] = useState(null)
  const [error, setError] = useState(null)
  const [requestProgress, setRequestProgress] = useState('started')
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  function handleError(error: ApiError, action: string) {
    setRequestProgress('failed')
    setError(error.message)
    toast.error(`Failed to ${action} resource`)
    if (error.errors) {
      // Extract validation errors
    }
  }

  async function create(data: ResourceCreate) {
    setRequestProgress('in-progress')
    clearErrors()
    try {
      const response = await createResource(data)
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.RESOURCE],
      })
      toast.success('Resource Created')
      setRequestProgress('completed')
    } catch (err) {
      handleError(err as ApiError, 'create')
    }
  }

  return {
    create,
    update,
    destroy,
    validationErrors,
    error,
    requestProgress,
    setRequestProgress,
  }
}
```

### Hook Responsibilities

1. **API Calls** - Encapsulate API function calls
2. **Error Handling** - Convert errors to user-friendly messages
3. **State Management** - Manage request progress and errors
4. **Cache Invalidation** - Invalidate React Query cache after mutations
5. **Notifications** - Show toast notifications
6. **Navigation** - Navigate after successful operations

## Best Practices

### Zustand

- ✅ Keep slices focused and single-purpose
- ✅ Use selectors to prevent unnecessary re-renders
- ✅ Only persist necessary state
- ❌ Don't store server data in Zustand (use React Query)

### React Query

- ✅ Use query options pattern for consistency
- ✅ Invalidate queries after mutations
- ✅ Use `keepPreviousData` for pagination
- ✅ Use `useSuspenseQuery` in routes with loaders
- ❌ Don't manually manage loading states (use `isLoading`, `isFetching`)

### Local State

- ✅ Keep state as close to where it's used as possible
- ✅ Lift state up only when necessary
- ❌ Don't use local state for server data
- ❌ Don't use local state for global state

### Forms

- ✅ Use TanStack Form for all forms
- ✅ Define default values as constants
- ✅ Use Zod for validation
- ✅ Reset form after successful submission
- ❌ Don't mix form state with component state unnecessarily

## Common Patterns

### Request Progress Pattern

```tsx
type RequestProgress = 'started' | 'in-progress' | 'completed' | 'failed'

const [requestProgress, setRequestProgress] = useState<RequestProgress>('started')

// Use in UI
{requestProgress === 'in-progress' && <Spinner />}
{requestProgress === 'completed' && <SuccessMessage />}
{requestProgress === 'failed' && <ErrorMessage />}
```

### Validation Errors Pattern

```tsx
const [validationErrors, setValidationErrors] = 
  useState<Record<string, string> | null>(null)

// Extract from API error
if (error.errors) {
  const fieldErrors: Record<string, string> = {}
  for (const key in error.errors) {
    fieldErrors[key] = error.errors[key].join(' ')
  }
  setValidationErrors(fieldErrors)
}

// Display in UI
{validationErrors && (
  <ValidationErrorsAlert errorList={Object.values(validationErrors)} />
)}
```

### Query Invalidation Pattern

```tsx
// After create - invalidate list
queryClient.invalidateQueries({
  queryKey: [QUERY_KEYS.RESOURCE],
})

// After update - invalidate both list and detail
queryClient.invalidateQueries({
  queryKey: [QUERY_KEYS.RESOURCE],
})
queryClient.invalidateQueries({
  queryKey: [QUERY_KEYS.RESOURCE, id],
})

// After delete - invalidate list
queryClient.invalidateQueries({
  queryKey: [QUERY_KEYS.RESOURCE],
})
```

