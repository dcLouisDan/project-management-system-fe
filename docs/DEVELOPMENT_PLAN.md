# Development Plan

## Priority Levels

- **P0 - Critical** - Blocks core functionality, security issues
- **P1 - High** - Important features, major inconsistencies
- **P2 - Medium** - Polish, minor inconsistencies, cleanup
- **P3 - Low** - Nice-to-have, future enhancements

## Critical Issues (P0)

### 1. Remove Console.log Statements
**Priority:** P0  
**Status:** ✅ Complete  
**Files Affected:** 28 instances across multiple route files

**Description:**
Multiple `console.log` statements existed throughout the codebase, particularly in error handlers and component logic.

**Files Fixed:**
- `src/routes/_main/projects/$projectId/index.tsx` (2 instances removed)
- `src/routes/_main/projects/$projectId/edit.tsx` (2 instances removed)
- `src/routes/_main/projects/$projectId/tasks/$taskId/index.tsx` (2 instances removed)
- `src/routes/_main/projects/$projectId/tasks/$taskId/edit.tsx` (2 instances removed)
- `src/routes/_main/projects/$projectId/tasks/$taskId/-components/task-assignee-dialog.tsx` (2 instances removed)
- `src/routes/_main/projects/$projectId/tasks/$taskId/-components/task-reviewer-dialog.tsx` (1 instance removed)
- `src/routes/_main/projects/$projectId/-components/project-tasks-table-filters.tsx` (1 instance removed)
- `src/components/forms/registration-form.tsx` (1 instance removed)
- `src/routes/_main/projects/$projectId/tasks/create.tsx` (2 instances removed)
- `src/routes/_main/projects/$projectId/teams.tsx` (2 instances removed)
- `src/routes/_main/teams/$teamId/edit.tsx` (2 instances removed)
- `src/routes/_main/teams/$teamId/members.tsx` (3 instances removed)
- `src/routes/_main/teams/$teamId/index.tsx` (2 instances removed)
- `src/routes/_main/users/$userId/index.tsx` (2 instances removed)
- `src/routes/_main/users/$userId/edit.tsx` (1 instance removed)

**Action Items:**
- [x] Remove all `console.log` statements
- [x] Clean up loader error handling (removed try-catch that only logged errors)
- [x] Add ESLint rule to prevent future console.log statements

---

### 2. Fix Error Handling Inconsistencies
**Priority:** P0  
**Status:** ✅ Complete

**Description:**
Error handling was inconsistent across routes. Some routes used loose equality (`==`) instead of strict equality (`===`), and error handling logic was duplicated across all routes.

**Files Fixed:**
- `src/lib/handle-api-error.ts` - Added `handleRouteError` utility function
- `src/routes/_main/projects/$projectId/index.tsx` - Updated to use utility
- `src/routes/_main/projects/$projectId/edit.tsx` - Updated to use utility
- `src/routes/_main/projects/$projectId/tasks/$taskId/index.tsx` - Updated to use utility
- `src/routes/_main/projects/$projectId/tasks/$taskId/edit.tsx` - Updated to use utility
- `src/routes/_main/projects/$projectId/tasks/create.tsx` - Updated to use utility
- `src/routes/_main/projects/$projectId/teams.tsx` - Updated to use utility
- `src/routes/_main/teams/$teamId/index.tsx` - Updated to use utility
- `src/routes/_main/teams/$teamId/edit.tsx` - Updated to use utility
- `src/routes/_main/teams/$teamId/members.tsx` - Updated to use utility
- `src/routes/_main/users/$userId/index.tsx` - Updated to use utility
- `src/routes/_main/users/$userId/edit.tsx` - Updated to use utility

**Action Items:**
- [x] Standardize error handling in all route loaders
- [x] Ensure all routes properly throw `notFound()` for 404 errors
- [x] Remove `console.log` from error handlers (completed in issue #1)
- [x] Create error handling utility (`handleRouteError` function)
- [x] Fix loose equality (`==`) to strict equality (`===`)

---

### 3. Fix Authentication Redirect Pattern
**Priority:** P0  
**Status:** ✅ Complete

**Description:**
Axios interceptor was using `window.location.href` for redirects instead of using TanStack Router. This broke SPA navigation and caused full page reloads.

**Files Fixed:**
- `src/lib/router-instance.ts` - Created router instance module for accessing router outside React context
- `src/main.tsx` - Updated to set router instance after creation
- `src/lib/api/request.ts` - Updated interceptor to use `router.navigate()` instead of `window.location.href`

**Action Items:**
- [x] Create router instance accessible from interceptor (`router-instance.ts` module)
- [x] Replace `window.location.href` with router navigation (`router.navigate()`)
- [x] Ensure proper cleanup of Zustand state before redirect (already handled)
- [x] Add fallback to `window.location.href` for edge cases during initial app load

---

## High Priority (P1)

### 4. Complete Dashboard Implementation
**Priority:** P1  
**Status:** Incomplete

**Description:**
Dashboard route (`src/routes/_main/dashboard.tsx`) only displays "Dashboard" text. Needs full implementation.

**Action Items:**
- [ ] Design dashboard layout
- [ ] Add dashboard widgets (project stats, recent tasks, etc.)
- [ ] Implement data fetching for dashboard metrics
- [ ] Add charts/visualizations if needed
- [ ] Make dashboard responsive

---

### 5. Remove Demo Code
**Priority:** P1  
**Status:** ✅ Complete

**Description:**
Demo code existed in the codebase that was not being used. All demo files have been removed.

**Files Removed:**
- `src/components/demo.FormComponents.tsx` - Demo form components (unused)
- `src/components/Header.tsx` - Unused header component with demo navigation links
- `src/hooks/demo.form.ts` - Demo form hook (unused)
- `src/hooks/demo.form-context.ts` - Demo form context (unused)
- `src/data/demo-table-data.ts` - Demo table data (unused)
- `src/routes/demo/` - Empty demo routes directory (removed)

**Action Items:**
- [x] Identify all demo code
- [x] Remove unused demo components
- [x] Remove demo routes directory (was empty)
- [x] Remove demo data files
- [x] Clean up unused imports (no imports found, files were unused)

---

### 6. Fix Hardcoded Sample Data
**Priority:** P1  
**Status:** Incomplete

**Description:**
`AppSidebar` component contains hardcoded sample data for projects and teams.

**File:** `src/components/app-sidebar.tsx`

**Action Items:**
- [ ] Replace hardcoded projects with real data from API
- [ ] Replace hardcoded teams with real data
- [ ] Implement proper data fetching for sidebar
- [ ] Add loading states

---

### 7. Fix Form Validation Messages
**Priority:** P1  
**Status:** Incomplete

**Description:**
Edit forms show "Unable to create project" instead of "Unable to update project".

**File:** `src/routes/_main/projects/$projectId/edit.tsx` (line 267)

**Action Items:**
- [ ] Fix validation error message in edit form
- [ ] Check all edit forms for similar issues
- [ ] Make error messages dynamic based on action (create vs update)

---

### 8. Fix Breadcrumb URLs
**Priority:** P1  
**Status:** Incomplete

**Description:**
Edit page has incorrect breadcrumb href.

**File:** `src/routes/_main/projects/$projectId/edit.tsx` (line 122)

**Current:** `href: '/projects/update'`  
**Should be:** `href: '/projects/$projectId/edit'`

**Action Items:**
- [ ] Fix breadcrumb href in edit route
- [ ] Check all routes for correct breadcrumb URLs
- [ ] Ensure breadcrumbs use proper route parameters

---

### 9. Complete Settings Routes
**Priority:** P1  
**Status:** Incomplete

**Description:**
Some settings navigation links point to `#` (placeholder URLs), indicating incomplete routes.

**Files:**
- `src/lib/nav-main-links.ts` - Settings navigation items

**Current State:**
- `/settings/profile` - ✅ Implemented
- `/settings/team` - ❌ Points to `#`
- Billing and Limits links - ❌ Not in navigation (may be future features)

**Action Items:**
- [ ] Determine if `/settings/team` route is needed
- [ ] Implement `/settings/team` route if required
- [ ] Remove placeholder links from navigation if not needed
- [ ] Update navigation to reflect actual available routes

---

## Medium Priority (P2)

### 10. Standardize Query Usage
**Priority:** P2  
**Status:** Incomplete

**Description:**
Some routes use `useQuery`, others use `useSuspenseQuery` inconsistently.

**Action Items:**
- [ ] Standardize on `useSuspenseQuery` for routes with loaders
- [ ] Use `useQuery` only when appropriate (no loader, conditional queries)
- [ ] Document when to use each pattern

---

### 11. Remove Unused Error State
**Priority:** P2  
**Status:** Incomplete

**Description:**
Auth slice defines `error` state but it's not used.

**File:** `src/integrations/zustand/slices/auth-slice.ts` (line 18)

**Action Items:**
- [ ] Remove unused `error` field from auth slice
- [ ] Or implement error state if needed

---

### 12. Standardize Route-Specific Components
**Priority:** P2  
**Status:** Incomplete

**Description:**
Not all routes follow the `-components/` pattern consistently.

**Action Items:**
- [ ] Audit all routes for component organization
- [ ] Move route-specific components to `-components/` folders
- [ ] Ensure consistent naming

---

### 13. Improve Type Safety
**Priority:** P2  
**Status:** Incomplete

**Description:**
Some type assertions and `any` types exist.

**Examples:**
- `data?.meta!` - Non-null assertion
- Some `any` types in error handling

**Action Items:**
- [ ] Remove non-null assertions where possible
- [ ] Replace `any` types with proper types
- [ ] Add proper type guards where needed

---

### 14. Standardize Loading States
**Priority:** P2  
**Status:** Incomplete

**Description:**
Loading indicators are inconsistent across pages.

**Action Items:**
- [ ] Create reusable loading component
- [ ] Standardize loading states
- [ ] Use React Query's `isLoading`/`isFetching` consistently

---

### 15. Extract Duplicated Form Reset Logic
**Priority:** P2  
**Status:** Incomplete

**Description:**
Form reset logic is duplicated across create/edit pages.

**Action Items:**
- [ ] Create custom hook for form reset logic
- [ ] Extract common form patterns
- [ ] Reduce code duplication

---

### 16. Fix Component Naming Inconsistencies
**Priority:** P2  
**Status:** Incomplete

**Description:**
Component file naming is inconsistent. `Header.tsx` uses PascalCase while all other components use kebab-case.

**Files:**
- `src/components/Header.tsx` - Uses PascalCase (should be kebab-case or removed)

**Action Items:**
- [ ] Determine if `Header.tsx` is used (appears to be unused/demo code)
- [ ] Remove `Header.tsx` if unused
- [ ] If needed, rename to `header.tsx` to match convention
- [ ] Update all imports if renamed
- [ ] Verify all component files follow kebab-case convention

---

## Low Priority (P3)

### 17. Add Error Boundaries
**Priority:** P3  
**Status:** Not Started

**Description:**
Add React error boundaries for better error handling.

**Action Items:**
- [ ] Create error boundary component
- [ ] Add error boundaries at route level
- [ ] Add error boundaries at layout level

---

### 18. Improve Accessibility
**Priority:** P3  
**Status:** Not Started

**Description:**
Audit and improve accessibility features.

**Action Items:**
- [ ] Add ARIA labels where needed
- [ ] Ensure keyboard navigation
- [ ] Test with screen readers
- [ ] Improve focus management

---

### 19. Add Loading Skeletons
**Priority:** P3  
**Status:** Not Started

**Description:**
Replace loading spinners with skeleton loaders for better UX.

**Action Items:**
- [ ] Create skeleton components
- [ ] Replace loading states with skeletons
- [ ] Use shadcn/ui skeleton component

---

### 20. Optimize Bundle Size
**Priority:** P3  
**Status:** Not Started

**Description:**
Analyze and optimize bundle size.

**Action Items:**
- [ ] Run bundle analysis
- [ ] Identify large dependencies
- [ ] Implement code splitting if needed
- [ ] Lazy load routes if appropriate

---

### 21. Add Unit Tests
**Priority:** P3  
**Status:** Not Started

**Description:**
Add unit tests for critical components and utilities.

**Action Items:**
- [ ] Set up testing framework (Vitest is already configured)
- [ ] Add tests for utility functions
- [ ] Add tests for custom hooks
- [ ] Add tests for components

---

### 22. Add E2E Tests
**Priority:** P3  
**Status:** Not Started

**Description:**
Add end-to-end tests for critical user flows.

**Action Items:**
- [ ] Set up E2E testing framework
- [ ] Test authentication flow
- [ ] Test CRUD operations
- [ ] Test navigation

---

## Cleanup Tasks

### Code Quality

- [ ] Remove all `console.log` statements (P0)
- [ ] Fix TypeScript strict mode issues
- [ ] Remove unused imports
- [ ] Remove unused variables
- [ ] Fix ESLint warnings
- [ ] Fix Prettier formatting issues

### Documentation

- [ ] Add JSDoc comments to public APIs
- [ ] Document complex components
- [ ] Add README for component patterns
- [ ] Document environment variables

### Performance

- [ ] Audit React Query cache configuration
- [ ] Optimize re-renders
- [ ] Add React.memo where appropriate
- [ ] Optimize bundle size

## Feature Completion

### Dashboard
- [ ] Design and implement dashboard
- [ ] Add project statistics
- [ ] Add recent tasks widget
- [ ] Add team activity widget

### Settings
- [ ] Complete `/settings/team` route (if required)
- [ ] Remove or implement placeholder navigation links
- [ ] Ensure all settings routes follow consistent patterns

### Navigation
- [ ] Fix placeholder links in `nav-main-links.ts`
- [ ] Ensure all navigation links point to valid routes
- [ ] Verify active state indicators work correctly
- [ ] Test navigation flow across all routes

## Technical Debt

### Architecture
- [ ] Standardize error handling pattern
- [ ] Create error handling utility
- [ ] Standardize query usage patterns
- [ ] Extract common form patterns

### State Management
- [ ] Remove unused state from Zustand
- [ ] Optimize Zustand selectors
- [ ] Review React Query cache configuration

### Components
- [ ] Standardize component organization
- [ ] Extract reusable components
- [ ] Create component library documentation

## Summary

**Total Issues:** 22+  
**Critical (P0):** 3  
**High (P1):** 6  
**Medium (P2):** 6  
**Low (P3):** 7

**Estimated Effort:**
- Critical: 1-2 days
- High: 1-2 weeks
- Medium: 1-2 weeks
- Low: 2-4 weeks

**Recommended Order:**
1. **P0 - Critical** - Fix console.log, error handling, auth redirect (blocks production)
2. **P1 - High** - Complete dashboard, remove demo code, fix inconsistencies (core features)
3. **P2 - Medium** - Standardize patterns, improve type safety (code quality)
4. **P3 - Low** - Add tests, accessibility, optimizations (polish)

**Note:** Focus on P0 and P1 items first as they impact core functionality and user experience.

