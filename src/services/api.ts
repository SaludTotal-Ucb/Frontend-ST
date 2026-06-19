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

interface FailedRequest {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
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
      //se guarda en el localstorage el token
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
  options: { method?: string; body?: unknown; headers?: Record<string, string> } = {},
): Promise<ApiResponse<T>> {
  const method = (options.method || 'GET').toLowerCase();

  // biome-ignore lint/suspicious/noExplicitAny: Axios config dynamic type
  const config: any = {
    method,
    url: endpoint,
    headers: options.headers || {},
  };

  if (options.body) {
    config.data =
      typeof options.body === 'string' ? JSON.parse(options.body as string) : options.body;
  }

  try {
    const response = await api(config);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    const msg = err.response?.data?.message || err.message || 'Error en la petición';
    throw new Error(msg);
  }
}

export const authService = {
  login: async (email: string, password: string) =>
    apiCall<{ user: unknown; accessToken: string; refreshToken: string }>('/auth/login', {
      method: 'POST',
      body: { email, password },
    }),

  register: async (
    name: string,
    email: string,
    password: string,
    ci: string,
    phone: string,
    birthDate?: string,
    gender?: string,
    bloodType?: string,
    address?: string,
    emergencyContact?: string,
  ) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: {
        name,
        email,
        password,
        ci,
        phone,
        birthDate,
        gender,
        bloodType,
        address,
        emergencyContact,
      },
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

  confirmAppointment: async (id: string) =>
    apiCall(`/citas/${id}/confirmar`, {
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
  getDashboardStats: async () =>
    apiCall<{ citasHoy: number; citasCompletadas: number; pacientesUnicos: number }>(
      '/doctor/dashboard-stats',
    ),
};

export const adminService = {
  getDashboard: async () => apiCall<unknown>('/admin/dashboard'),

  getAllAppointments: async () => apiCall('/admin/citas'),

  getClinicas: async () => apiCall<unknown[]>('/clinicas'),

  getDoctores: async () => apiCall<unknown[]>('/doctores'),

  getPacientes: async () => apiCall<unknown[]>('/admin/pacientes'),

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

  // ── Pacientes CRUD ──
  updatePaciente: async (id: string, data: object) =>
    apiCall(`/admin/pacientes/${id}`, { method: 'PATCH', body: data }),

  deletePaciente: async (id: string) => apiCall(`/admin/pacientes/${id}`, { method: 'DELETE' }),

  // ── Médicos CRUD ──
  updateMedico: async (id: string, data: object) =>
    apiCall(`/admin/medicos/${id}`, { method: 'PATCH', body: data }),

  deleteMedico: async (id: string) => apiCall(`/admin/medicos/${id}`, { method: 'DELETE' }),

  // ── Clínicas CRUD ──
  updateClinica: async (id: string, data: object) =>
    apiCall(`/admin/clinicas/${id}`, { method: 'PATCH', body: data }),

  deleteClinica: async (id: string) => apiCall(`/admin/clinicas/${id}`, { method: 'DELETE' }),

  // ── Citas CRUD ──
  updateCita: async (id: string, data: object) =>
    apiCall(`/admin/citas/${id}`, { method: 'PATCH', body: data }),

  deleteCita: async (id: string) => apiCall(`/admin/citas/${id}`, { method: 'DELETE' }),

  createCitaAsAdmin: async (data: object) =>
    apiCall('/admin/citas', { method: 'POST', body: data }),
};

export default apiCall;
