const getBaseUrl = (envVal?: string) => {
  const base = envVal || import.meta.env.VITE_API_BASE_URL || '/api';
  if (base.endsWith('/api')) {
    return `${base}/v1`;
  }
  if (base.endsWith('/api/')) {
    return `${base}v1`;
  }
  return base;
};

export const API_URLS = {
  auth: getBaseUrl(import.meta.env.VITE_API_AUTH),
  citas: getBaseUrl(import.meta.env.VITE_API_CITAS),
  historial: getBaseUrl(import.meta.env.VITE_API_HISTORIAL),
};
