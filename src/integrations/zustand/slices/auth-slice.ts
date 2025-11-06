import type { User } from '@/lib/types/user'
import type { StateCreator } from 'zustand'

interface AuthSlice {
  isAuthenticated: boolean
  remember: boolean
  user: User | null
  setUser: (user: User | null, remember?: boolean) => void
  unsetUser: () => void
  loading: boolean
  setLoading: (loading: boolean) => void
}

const createAuthSlice: StateCreator<AuthSlice, [], [], AuthSlice> = (set) => ({
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  remember: false,
  setUser: (user, remember = false) =>
    set({ user, isAuthenticated: true, remember }),
  unsetUser: () => set({ user: null, isAuthenticated: false, remember: false }),
  setLoading: (loading) => set({ loading }),
})

export default createAuthSlice
export type { AuthSlice }
