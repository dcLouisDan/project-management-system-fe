import type { User } from '@/lib/types/user'
import type { StateCreator } from 'zustand'

interface AuthSlice {
  isAuthenticated: boolean
  user: User | null
  login: (userData: User) => void
  logout: () => void
}

const createAuthSlice: StateCreator<AuthSlice, [], [], AuthSlice> = (set) => ({
  isAuthenticated: false,
  user: null,
  login: (userData: User) =>
    set(() => ({
      isAuthenticated: true,
      user: userData,
    })),
  logout: () =>
    set(() => ({
      isAuthenticated: false,
      user: null,
    })),
})

export default createAuthSlice
export type { AuthSlice }
