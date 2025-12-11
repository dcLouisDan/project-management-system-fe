/**
 * Router instance storage for accessing the router outside React context.
 * This is used by the Axios interceptor to navigate using TanStack Router
 * instead of window.location.href, maintaining SPA navigation.
 */
let routerInstance: {
  navigate: (options: { to: string }) => void
  state: {
    location: {
      pathname: string
    }
  }
} | null = null

/**
 * Sets the router instance. Should be called once after router creation in main.tsx
 */
export function setRouterInstance(router: {
  navigate: (options: { to: string }) => void
  state: {
    location: {
      pathname: string
    }
  }
}) {
  routerInstance = router
}

/**
 * Gets the router instance. Returns null if not yet set.
 */
export function getRouterInstance(): {
  navigate: (options: { to: string }) => void
  state: {
    location: {
      pathname: string
    }
  }
} | null {
  return routerInstance
}

