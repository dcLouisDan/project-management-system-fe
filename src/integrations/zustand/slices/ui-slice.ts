import type { Role } from '@/lib/types/role'
import type { StateCreator } from 'zustand'

interface UiSlice {
  uiMode: Role
  setUiMode: (mode: Role) => void
}

const createUiSlice: StateCreator<UiSlice, [], [], UiSlice> = (set) => ({
  uiMode: 'team member',
  setUiMode: (mode) => set({ uiMode: mode }),
})

export default createUiSlice
export type { UiSlice }
