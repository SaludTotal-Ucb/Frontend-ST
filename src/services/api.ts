import { API_URLS } from '../config/api-config';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || API_URLS.auth;

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  const token = localStorage.getItem('token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options.headers instanceof Headers) {
    options.headers.forEach((value, key) => {
      headers[key] = value;
    });
  } else if (typeof options.headers === 'object' && options.headers !== null) {
    Object.assign(headers, options.headers);
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error en la request');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export const authService = {
  login: async (email: string, password: string) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  // CORREGIDO: Se agregaron 'ci' y 'phone' para coincidir con la validación del Backend y Prisma
  register: async (name: string, email: string, password: string, ci: string, phone: string) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, ci, phone }),
    }),

  logout: async () =>
    apiCall('/auth/logout', {
      method: 'POST',
    }),

  // Nota: Este endpoint aún debe ser implementado en tu backend (AuthController)
  getProfile: async () => apiCall('/auth/profile'),

  recoverPassword: async (email: string) =>
    apiCall('/auth/recover-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
};

export const appointmentService = {
  // CORREGIDO: Ahora usa la ruta /citas en español
  getAppointments: async () => apiCall('/citas'),

  bookAppointment: async (data: {
    doctorId: string;
    fecha: string;
    especialidad: string;
    notas?: string;
  }) =>
    apiCall('/citas', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // CORREGIDO: Ahora usa PATCH y la ruta /citas/:id/cancelar exacta del backend
  cancelAppointment: async (id: string) =>
    apiCall(`/citas/${id}/cancelar`, {
      method: 'PATCH',
    }),
};

// NUEVO: Servicio para manejar el Historial Médico respetando tu DTO y esquema de base de datos
export const historialService = {
  getOwnHistorial: async () => apiCall('/historial/me'),

  // Usa estrictamente camelCase para que el Backend lo acepte sin errores
  crearHistorial: async (data: {
    tipoSangre: string;
    alergias: string[];
    tratamientosEnCurso: string[];
    afecciones: { problema: string; severidad: string; diagnostico: string }[];
  }) =>
    apiCall('/historial', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Nota: Los siguientes servicios llaman a rutas que aún no existen en el Backend.
// Puedes usarlos de guía para saber qué endpoints te faltan crear en NestJS.
export const doctorService = {
  getAgenda: async () => apiCall('/doctor/agenda'),
  getPatientHistory: async (patientId: string) => apiCall(`/doctor/patients/${patientId}/history`),
};

export const adminService = {
  getDashboard: async () => apiCall('/admin/dashboard'),

  getAllAppointments: async () => apiCall('/admin/citas'), // ajustado a citas

  registerDoctor: async (data: object) =>
    apiCall('/admin/doctors', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  registerClinic: async (data: object) =>
    apiCall('/admin/clinics', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export default apiCall;
