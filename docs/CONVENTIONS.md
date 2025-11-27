# Code Conventions

## Naming Conventions

### Files

**Components:**
- Use kebab-case: `app-sidebar.tsx`, `data-table.tsx`, `page-header.tsx`
- All component files must use kebab-case (no exceptions)

**Routes:**
- Use kebab-case: `create.tsx`, `edit.tsx`, `index.tsx`
- Dynamic segments: `$projectId`, `$taskId`, `$userId`, `$teamId`

**Hooks:**
- Use kebab-case with `use-` prefix: `use-auth.ts`, `use-manage-projects.ts`
- Custom hooks should start with `use` in the function name: `useAuth()`, `useManageProjects()`

**Utilities:**
- Use kebab-case: `handle-api-error.ts`, `string-utils.ts`, `nav-main-links.ts`

**Types:**
- Use kebab-case: `user.ts`, `project.ts`, `task.ts`, `team.ts`

**API Files:**
- Use kebab-case: `auth.ts`, `projects.ts`, `profile.settings.ts`

### Components

**Component Names:**
- Use PascalCase: `AppSidebar`, `DataTable`, `PageHeader`
- Route components: Use `RouteComponent` as function name

**Props Interfaces:**
- Use PascalCase with `Props` suffix: `TaskAssigneeDialogProps`
- Or inline with component: `React.ComponentProps<'div'>`

### Variables and Functions

**Functions:**
- Use camelCase: `fetchProjects()`, `createProject()`, `handleError()`

**Variables:**
- Use camelCase: `projectId`, `validationErrors`, `requestProgress`

**Constants:**
- Use UPPER_SNAKE_CASE: `QUERY_KEYS`, `APP_NAME`, `BACKEND_URL`

**Type Names:**
- Use PascalCase: `User`, `Project`, `Task`, `ApiError`

## Folder Structure Rules

### Top-Level Structure

```
src/
├── components/        # Reusable UI components
├── hooks/            # Custom React hooks
├── integrations/     # Third-party integrations
├── lib/              # Utilities, types, API, constants
├── routes/           # TanStack Router routes
└── styles.css        # Global styles
```

### Component Organization

**Base UI Components:**
- Location: `components/ui/`
- Purpose: shadcn/ui components, Radix UI primitives
- Examples: `button.tsx`, `card.tsx`, `dialog.tsx`

**Feature Components:**
- Location: `components/`
- Purpose: Higher-level business components
- Examples: `app-sidebar.tsx`, `data-table.tsx`, `page-header.tsx`

**Form Components:**
- Location: `components/forms/`
- Purpose: Form-specific components
- Examples: `login-form.tsx`, `registration-form.tsx`

**Route-Specific Components:**
- Location: `routes/*/-components/`
- Purpose: Components only used in specific routes
- Naming: kebab-case, co-located with route

### Route Organization

**Route Files:**
- List/index route: `index.tsx` (e.g., `/projects`)
- Create route: `create.tsx` (e.g., `/projects/create`)
- Edit route: `edit.tsx` (e.g., `/projects/$projectId/edit`)
- Detail route: `$id/index.tsx` (e.g., `/projects/$projectId`)
- Nested routes: `$id/nested/index.tsx` (e.g., `/projects/$projectId/tasks/$taskId`)

**Route-Specific Folders:**
- `-components/` - Route-specific components
- `-table/` - Table columns and filters
- `-not-found-component.tsx` - Custom 404 component

**Layout Files:**
- `-main-inset-layout.tsx` - Shared layout component
- `route.tsx` - Layout route definition

### Lib Organization

**API Functions:**
- Location: `lib/api/`
- One file per resource: `projects.ts`, `tasks.ts`, `users.ts`, `teams.ts`, `auth.ts`

**Query Options:**
- Location: `lib/query-options/`
- Naming: `*-query-options.ts`
- Examples: `projects-query-options.ts`, `show-project-query-options.ts`

**Types:**
- Location: `lib/types/`
- One file per domain: `user.ts`, `project.ts`, `task.ts`, `team.ts`

**Utilities:**
- Location: `lib/`
- Examples: `utils.ts`, `constants.ts`, `handle-api-error.ts`

## Import Order

### Standard Import Order

1. **React core imports** (`react`, `react-dom`)
2. **TanStack Router imports** (`@tanstack/react-router`)
3. **TanStack Query imports** (`@tanstack/react-query`)
4. **TanStack Form imports** (`@tanstack/react-form`)
5. **TanStack Table imports** (`@tanstack/react-table`)
6. **Other third-party library imports** (axios, zod, dayjs, etc.)
7. **UI component imports** (`@/components/ui/*`)
8. **Internal component imports** (`@/components/*`)
9. **Hook imports** (`@/hooks/*`)
10. **Lib imports** (`@/lib/*`)
11. **Type imports** (at the end, prefixed with `type`)

### Example

```tsx
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/data-table'
import useManageProjects from '@/hooks/use-manage-projects'
import { projectsQueryOptions } from '@/lib/query-options/projects-query-options'
import type { Project } from '@/lib/types/project'
```

### Path Aliases

Use path aliases defined in `tsconfig.json`:
- `@/components` → `src/components`
- `@/hooks` → `src/hooks`
- `@/lib` → `src/lib`
- `@/` → `src/`

**Benefits:**
- Cleaner imports
- Easier refactoring
- Consistent import paths

## Styling and UI Patterns

### Tailwind CSS

**Usage:**
- Use Tailwind utility classes directly
- Use `cn()` utility for conditional classes
- Use CSS variables for theming

**Example:**
```tsx
<div className={cn("flex gap-4", isActive && "bg-primary")}>
```

### Component Variants

**Class Variance Authority (CVA):**
- Use CVA for component variants
- Define variants in component file
- Export variant types

**Example:**
```tsx
const buttonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: { default: "...", destructive: "..." },
      size: { sm: "...", md: "...", lg: "..." }
    }
  }
)
```

### UI Component Patterns

**shadcn/ui Components:**
- Use shadcn/ui components from `components/ui/`
- Follow shadcn/ui patterns
- Extend with custom variants as needed

**Radix UI:**
- Use Radix UI primitives wrapped by shadcn/ui
- Don't use Radix directly unless extending shadcn/ui

**Icons:**
- Use Lucide React icons
- Import specific icons: `import { User, Settings } from 'lucide-react'`

### Form Patterns

**TanStack Form:**
- Use TanStack Form for all forms
- Define default values as constants
- Use Zod for validation
- Use Field components from `ui/field`

**Form Structure:**
```tsx
const form = useForm({
  defaultValues: DEFAULT_RESOURCE_CREATE,
  onSubmit: async ({ value }) => await create(value),
})

<form.Field name="fieldName">
  {(field) => (
    <Field>
      <FieldLabel>Label</FieldLabel>
      <Input {...field} />
      <FieldError errors={field.state.meta.errors} />
    </Field>
  )}
</form.Field>
```

## Standard Patterns

### Routing Patterns

**List Page:**
```tsx
export const Route = createFileRoute('/_main/resource/')({
  component: RouteComponent,
  validateSearch: (search) => search as SearchParams,
  head: () => ({
    meta: [{ title: 'Resource List - App Name' }],
  }),
})

function RouteComponent() {
  const search = Route.useSearch()
  const { data, isFetching } = useQuery(
    resourceQueryOptions({
      page: search.page ?? 1,
      per_page: search.per_page ?? 10,
      // ... other search params
    })
  )
  return (
    <MainInsetLayout breadcrumbItems={[{ label: 'Resources', href: '/resource' }]}>
      <PageHeader title="Resources" />
      <DataTable columns={columns} data={data?.data || []} isFetching={isFetching} />
      {data?.meta && <PaginationBar pagination={data.meta} />}
    </MainInsetLayout>
  )
}
```

**Detail Page:**
```tsx
export const Route = createFileRoute('/_main/resource/$id/')({
  loader: ({ context: { queryClient }, params }) => {
    return queryClient.ensureQueryData(
      showResourceQueryOptions(Number(params.id))
    )
  },
  component: RouteComponent,
  onError: (err) => {
    const error = err as ApiError
    if (error.status === 404) {
      throw notFound()
    }
  },
  notFoundComponent: ResourceNotFoundComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const { data } = useSuspenseQuery(showResourceQueryOptions(Number(id)))
  return (
    <MainInsetLayout
      breadcrumbItems={[
        { label: 'Resources', href: '/resource' },
        { label: data.name, href: `/resource/${id}` },
      ]}
    >
      <PageHeader title={data.name} />
      {/* Resource details */}
    </MainInsetLayout>
  )
}
```

**Form Page (Create):**
```tsx
export const Route = createFileRoute('/_main/resource/create')({
  component: RouteComponent,
  head: () => ({
    meta: [{ title: 'Create Resource - App Name' }],
  }),
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
      setRequestProgress('started')
    }
  }, [requestProgress, form])

  return (
    <MainInsetLayout
      breadcrumbItems={[
        { label: 'Resources', href: '/resource' },
        { label: 'Create', href: '/resource/create' },
      ]}
    >
      <PageHeader title="Create Resource" />
      <Card>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
            <form.Field name="name">
              {(field) => (
                <Field>
                  <FieldLabel>Name</FieldLabel>
                  <Input {...field} />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>
            {validationErrors && (
              <ValidationErrorsAlert errorList={Object.values(validationErrors)} />
            )}
          </form>
        </CardContent>
      </Card>
    </MainInsetLayout>
  )
}
```

### Data Fetching Patterns

**Query Options:**
```tsx
export const resourceQueryOptions = (params: FetchParams) =>
  queryOptions({
    queryKey: [QUERY_KEYS.RESOURCE].concat(Object.values(params)),
    queryFn: async () => {
      const response = await fetchResource(params)
      return response.data
    },
    placeholderData: keepPreviousData,
  })
```

**Usage in Components:**
```tsx
const { data, isFetching } = useQuery(
  resourceQueryOptions({ page: 1, per_page: 10 })
)
```

**Usage in Loaders:**
```tsx
loader: ({ context: { queryClient }, params }) => {
  return queryClient.ensureQueryData(
    resourceQueryOptions({ id: params.id })
  )
}
```

### Error Handling Patterns

**API Errors:**
```tsx
try {
  await apiCall()
} catch (err) {
  const error = err as ApiError
  setError(error.message)
  if (error.errors) {
    // Handle validation errors
  }
}
```

**Route Errors:**
```tsx
onError: (err) => {
  const error = err as ApiError
  if (error.status === 404) {
    throw notFound()
  }
}
```

### Toast Notifications

**Success:**
```tsx
toast.success('Resource Created', {
  description: `New resource created successfully`,
})
```

**Error:**
```tsx
toast.error('Failed to create resource', {
  description: error.message,
})
```

## Code Quality Rules

### TypeScript

- Use TypeScript for all files
- Avoid `any` types
- Use type assertions sparingly (`as Type`)
- Define types in `lib/types/`
- Export types for reuse

### Error Handling

- Always handle errors in try-catch blocks
- Use `handleApiError()` utility for API errors
- Display user-friendly error messages
- Log errors appropriately (avoid `console.log` in production)

### State Management

- Use React Query for server state
- Use Zustand for global client state
- Use local state (`useState`) for component-specific UI state
- Use TanStack Form for form state

### Component Guidelines

- Keep components focused and single-purpose
- Extract reusable logic to custom hooks
- Use composition over inheritance
- Prefer functional components
- Use TypeScript for props

### Performance

- Use `useSuspenseQuery` in routes with loaders
- Use `keepPreviousData` for pagination
- Invalidate queries after mutations
- Avoid unnecessary re-renders

