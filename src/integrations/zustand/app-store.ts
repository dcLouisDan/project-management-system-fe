import type { AuthSlice } from './slices/auth-slice'
import createAuthSlice from './slices/auth-slice'
import { createJSONStorage, persist } from 'zustand/middleware'
import { create } from 'zustand'
import type { UiSlice } from './slices/ui-slice'
import createUiSlice from './slices/ui-slice'

type AppStoreType = AuthSlice & UiSlice

const useAppStore = create<AppStoreType>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createUiSlice(...a),
    }),
    {
      name: 'app-store',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)

export default useAppStore
