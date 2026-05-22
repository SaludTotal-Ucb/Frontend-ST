export const API_URLS = {
  auth: import.meta.env.VITE_API_AUTH || import.meta.env.VITE_API_BASE_URL || '/api',
  citas: import.meta.env.VITE_API_CITAS || import.meta.env.VITE_API_BASE_URL || '/api',
  historial: import.meta.env.VITE_API_HISTORIAL || import.meta.env.VITE_API_BASE_URL || '/api',
};
