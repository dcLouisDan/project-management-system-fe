import type { Router } from '@tanstack/react-router'

/**
 * Router instance storage for accessing the router outside React context.
 * This is used by the Axios interceptor to navigate using TanStack Router
 * instead of window.location.href, maintaining SPA navigation.
 */
let routerInstance: Router | null = null

/**
 * Sets the router instance. Should be called once after router creation in main.tsx
 */
export function setRouterInstance(router: Router) {
  routerInstance = router
}

/**
 * Gets the router instance. Returns null if not yet set.
 */
export function getRouterInstance(): Router | null {
  return routerInstance
}

