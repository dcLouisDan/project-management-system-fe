import { loginUser, logoutUser, registerUser } from '@/lib/api/user'
import type { ApiError } from '@/lib/handle-api-error'
import type { User, UserRegistration } from '@/lib/types/user'
import type { StateCreator } from 'zustand'

interface AuthSlice {
  isAuthenticated: boolean
  user: User | null
  register: (data: UserRegistration) => void
  login: (email: string, password: string) => void
  logout: () => void
  loading: boolean
  error: string | null
}

const createAuthSlice: StateCreator<AuthSlice, [], [], AuthSlice> = (set) => ({
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  register: async (data: UserRegistration) => {
    set({ loading: true, error: null })
    try {
      const userData = await registerUser(data)
      set({ isAuthenticated: true, user: userData })
    } catch (err) {
      const error = err as ApiError
      set({ error: error.message })
    } finally {
      set({ loading: false })
    }
  },
  login: async (email: string, password: string) => {
    set({ loading: true, error: null })
    try {
      const userData = await loginUser(email, password)
      set({ isAuthenticated: true, user: userData })
    } catch (err) {
      const error = err as ApiError
      set({ error: error.message })
    } finally {
      set({ loading: false })
    }
  },
  logout: async () => {
    set({ loading: true, error: null })
    try {
      await logoutUser()
      set({ isAuthenticated: false, user: null })
    } catch (err) {
      const error = err as ApiError
      set({ error: error.message })
    } finally {
      set({ loading: false })
    }
  },
})

export default createAuthSlice
export type { AuthSlice }
