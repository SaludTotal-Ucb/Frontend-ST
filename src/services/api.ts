import axios from 'axios';
import { API_URLS } from '../config/api-config';

const getBaseUrl = () => {
  const base = import.meta.env.VITE_API_BASE_URL || API_URLS.auth;
  if (base.endsWith('/api')) {
    return `${base}/v1`;
  }
  if (base.endsWith('/api/')) {
    return `${base}v1`;
  }
  return base;
};

export const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  for (const prom of failedQueue) {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  }
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const localRefreshToken = localStorage.getItem('refreshToken');
      if (!localRefreshToken) {
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${getBaseUrl()}/auth/refresh`, {
          refreshToken: localRefreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        isRefreshing = false;

        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        isRefreshing = false;
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('currentUser');
        window.location.href = '/';
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

async function apiCall<T>(
  endpoint: string,
  options: { method?: string; body?: any; headers?: any } = {},
): Promise<ApiResponse<T>> {
  const method = (options.method || 'GET').toLowerCase();

  const config: any = {
    method,
    url: endpoint,
    headers: options.headers || {},
  };

  if (options.body) {
    config.data = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
  }

  try {
    const response = await api(config);
    return response.data;
  } catch (error: any) {
    console.error('API Error:', error);
    const msg = error.response?.data?.message || error.message || 'Error en la petición';
    throw new Error(msg);
  }
}

export const authService = {
  login: async (email: string, password: string) =>
    apiCall<{ user: any; accessToken: string; refreshToken: string }>('/auth/login', {
      method: 'POST',
      body: { email, password },
    }),

  register: async (name: string, email: string, password: string, ci: string, phone: string) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: { name, email, password, ci, phone },
    }),

  logout: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    return apiCall('/auth/logout', {
      method: 'POST',
      body: { refreshToken },
    });
  },

  getProfile: async () => apiCall('/auth/profile'),

  recoverPassword: async (email: string) =>
    apiCall('/auth/recover-password', {
      method: 'POST',
      body: { email },
    }),
};

export const appointmentService = {
  getAppointments: async () => apiCall('/citas'),

  bookAppointment: async (data: {
    doctorId: string;
    fecha: string;
    especialidad: string;
    notas?: string;
  }) =>
    apiCall('/citas', {
      method: 'POST',
      body: data,
    }),

  cancelAppointment: async (id: string) =>
    apiCall(`/citas/${id}/cancelar`, {
      method: 'PATCH',
    }),
};

export const historialService = {
  getOwnHistorial: async () => apiCall('/historial/me'),

  crearHistorial: async (data: {
    tipoSangre: string;
    alergias: string[];
    tratamientosEnCurso: string[];
    afecciones: { problema: string; severidad: string; diagnostico: string }[];
  }) =>
    apiCall('/historial', {
      method: 'POST',
      body: data,
    }),
};

export const doctorService = {
  getAgenda: async () => apiCall('/doctor/agenda'),
  getPatientHistory: async (patientId: string) => apiCall(`/doctor/patients/${patientId}/history`),
};

export const adminService = {
  getDashboard: async () => apiCall('/admin/dashboard'),

  getAllAppointments: async () => apiCall('/admin/citas'),

  registerDoctor: async (data: object) =>
    apiCall('/admin/doctors', {
      method: 'POST',
      body: data,
    }),

  registerClinic: async (data: object) =>
    apiCall('/admin/clinics', {
      method: 'POST',
      body: data,
    }),
};

export default apiCall;
