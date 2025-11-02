import type { User } from '@/lib/types/user'
import type { StateCreator } from 'zustand'

interface AuthSlice {
  isAuthenticated: boolean
  user: User | null
  setUser: (user: User | null) => void
  unsetUser: () => void
  loading: boolean
  setLoading: (loading: boolean) => void
}

const createAuthSlice: StateCreator<AuthSlice, [], [], AuthSlice> = (set) => ({
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  unsetUser: () => set({ user: null, isAuthenticated: false }),
  setLoading: (loading) => set({ loading }),
})

export default createAuthSlice
export type { AuthSlice }
