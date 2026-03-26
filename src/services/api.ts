const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

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

  register: async (name: string, email: string, password: string) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  logout: async () =>
    apiCall('/auth/logout', {
      method: 'POST',
    }),

  getProfile: async () => apiCall('/auth/profile'),

  recoverPassword: async (email: string) =>
    apiCall('/auth/recover-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
};

export const appointmentService = {
  getAppointments: async () => apiCall('/appointments'),

  bookAppointment: async (data: object) =>
    apiCall('/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  cancelAppointment: async (id: string) =>
    apiCall(`/appointments/${id}`, {
      method: 'DELETE',
    }),
};

export const doctorService = {
  getAgenda: async () => apiCall('/doctor/agenda'),

  getPatientHistory: async (patientId: string) => apiCall(`/doctor/patients/${patientId}/history`),
};

export const adminService = {
  getDashboard: async () => apiCall('/admin/dashboard'),

  getAllAppointments: async () => apiCall('/admin/appointments'),

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
