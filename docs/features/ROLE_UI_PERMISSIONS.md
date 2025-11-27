# Role-Based UI & Feature Access

This file defines the frontend UI features and visibility rules for each system role. Use this to guide conditional rendering, route gating, and component-level permissions.

## Roles Covered

* **Admin**
* **Project Manager**
* **Team Lead**
* **Team Member**

---

# Admin

Admins have full platform access.

## Users

* View all users
* Create users
* Edit users
* Delete users
* Assign roles

## Teams

* View all teams
* Create teams
* Edit teams
* Delete teams
* Manage team members

## Projects

* View all projects
* Create projects
* Edit projects
* Delete projects
* Assign teams to projects

## Tasks

* View all tasks
* Create any task
* Edit any task
* Delete any task
* Reassign tasks freely

---

# Project Manager

Project Managers oversee projects and teams assigned to them.

## Users

* View all users (read-only)
* Cannot create, edit, or delete users

## Teams

* View all teams
* Manage teams assigned to their projects
* Add or remove members **only within teams they manage**

## Projects

* View all projects
* Create projects
* Edit projects they own/manage
* Assign or remove teams from their own projects
* Cannot delete projects

## Tasks

* View tasks under their managed projects
* Create tasks under those projects
* Edit tasks under those projects
* Reassign tasks within their project scope
* Cannot delete tasks they did not create (optional rule)

---

# Team Lead

Team Leads manage members of their assigned teams.

## Users

* View team members only
* Cannot create, edit, or delete users

## Teams

* View their assigned teams
* Add or remove members only if granted by backend policy (toggle depending on business rules)
* Cannot create or delete teams

## Projects

* View projects assigned to their team
* Cannot create, edit, or delete projects

## Tasks

* View tasks assigned to their team or its projects
* Create tasks within assigned projects
* Edit tasks created by them or assigned to their team
* Reassign tasks among their team members
* Cannot delete tasks

---

# Team Member

Team Members are contributors with the narrowest access.

## Users

* View their own profile only

## Teams

* View their assigned teams
* Cannot manage team members

## Projects

* View projects assigned to their team

## Tasks

* View tasks assigned to them
* Create tasks if allowed by project settings
* Edit only tasks they created
* Cannot reassign tasks
* Cannot delete tasks

---

# Notes for UI Implementation

* Conditional rendering should check **ui mode** from ui state.
* Permissions should cascade: Admin > Project Manager > Team Lead > Team Member.
* Route gating can be done through TanStack Router `beforeLoad` or layout-level checks.
* Navigation links should show/hide based on role.
* Action buttons (edit/delete/assign) must follow these rules.

---

# Implementation Files

The following files implement role-based UI permissions:

## Core Permission Utilities

* **`src/lib/permissions.ts`** - Permission definitions and utility functions
  - `getPermissionsForRole(role)` - Get all permissions for a role
  - `hasPermission(role, permission)` - Check single permission
  - `canEditResource(role, type, context)` - Contextual edit permission check
  - `canDeleteResource(role, type, context)` - Contextual delete permission check
  - `canAccessNavSection(role, section)` - Navigation visibility check

## React Hook

* **`src/hooks/use-permissions.ts`** - Hook for accessing permissions in components
  - Returns all permissions for current `uiMode`
  - Provides `canEdit()`, `canDelete()`, `canAccessNav()` functions
  - Provides ownership helpers: `isOwner()`, `isManager()`, `isAssignedTo()`

## Navigation

* **`src/lib/nav-main-links.ts`** - Role-filtered navigation
  - `getNavLinksForRole(role)` - Returns filtered navigation items
  - `isNavItemVisibleForRole(title, role)` - Check item visibility

## Usage Example

```tsx
import { usePermissions } from '@/hooks/use-permissions'

function TaskActions({ task }: { task: Task }) {
  const { canEditTasks, canDeleteTasks, canEdit, isAssignedTo } = usePermissions()
  
  // Check if user can edit this specific task
  const canEditThisTask = canEdit('task', { createdById: task.assigned_by?.id })
  
  return (
    <>
      {canEditThisTask && <EditButton />}
      {canDeleteTasks && <DeleteButton />}
      {isAssignedTo(task.assigned_to?.id) && <StartTaskButton />}
    </>
  )
}
```

## Data Filtering Strategy

For data fetching, use existing API query parameters to filter based on role:

| Role | Users API | Tasks API | Projects/Teams API |
|------|-----------|-----------|-------------------|
| Admin | No filter | No filter | No filter |
| Project Manager | No filter (read-only) | `project_id` (managed projects) | No filter |
| Team Lead | `team_id` | `project_id` (team projects) | Backend-filtered |
| Team Member | Own profile only | `assigned_to_id` (own tasks) | Backend-filtered |
