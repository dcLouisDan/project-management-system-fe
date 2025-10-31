import type { AuthSlice } from './slices/auth-slice'
import createAuthSlice from './slices/auth-slice'
import { create } from 'zustand'

type AppStoreType = AuthSlice

const useAppStore = create<AppStoreType>()((...a) => ({
  ...createAuthSlice(...a),
}))

export default useAppStore
