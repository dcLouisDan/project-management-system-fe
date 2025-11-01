import type { AuthSlice } from './slices/auth-slice'
import createAuthSlice from './slices/auth-slice'
import { createJSONStorage, persist } from 'zustand/middleware'
import { create } from 'zustand'

type AppStoreType = AuthSlice

const useAppStore = create<AppStoreType>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
    }),
    {
      name: 'app-store',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)

export default useAppStore
