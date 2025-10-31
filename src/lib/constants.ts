export const APP_NAME = import.meta.env.VITE_APP_NAME || 'QuestForge'
export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
export const BACKEND_API_ROOT =
  import.meta.env.VITE_BACKEND_API_ROOT || '/api/v1'
export const BACKEND_API_URL = `${BACKEND_URL}${BACKEND_API_ROOT}`
