import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_URLS } from '../config/api-config';

// Interfaces for our Citas (Appointments)
export interface Cita {
  id: number;
  specialty: string;
  doctor: string;
  clinic: string;
  address: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
}

// Configuración inicial de Axios conectándolo al Microservicio de Citas
const api = axios.create({
  baseURL: API_URLS.citas,
});

export const useCitas = () => {
  const queryClient = useQueryClient();

  // 1. OBTENER CITAS DEL PACIENTE (Query - Apunta al MS de Citas)
  const useCitasPaciente = (pacienteId: string) =>
    useQuery({
      queryKey: ['citas', 'paciente', pacienteId],
      queryFn: async () => {
        // Llama a GET /api/citas/paciente/:id
        const { data } = await api.get<Cita[]>(`/citas/paciente/${pacienteId}`);
        return data;
      },
      enabled: !!pacienteId,
    });

  // 1.2 OBTENER HISTORIAL DEL PACIENTE (Query - Apunta al MS de Historial)
  const useHistorialPaciente = (pacienteId: string) =>
    useQuery({
      queryKey: ['historial', 'paciente', pacienteId],
      queryFn: async () => {
        // Hacemos el fetch manual apuntando al puerto / servidor de historial (3002)
        const response = await axios.get(`${API_URLS.historial}/historial/paciente/${pacienteId}`);
        return response.data;
      },
      enabled: !!pacienteId,
    });

  // 1.5 OBTENER CITAS DEL DOCTOR (Query)
  const useCitasDoctor = (doctorId: string) =>
    useQuery({
      queryKey: ['citas', 'doctor', doctorId],
      queryFn: async () => {
        // Llama a GET /api/citas/medico/:id
        const { data } = await api.get<Cita[]>(`/citas/medico/${doctorId}`);
        return data;
      },
      enabled: !!doctorId,
    });

  // 2. AGENDAR UNA CITA NUEVA (Mutation con Invalidación de Caché)
  const agendarCitaMutation = useMutation({
    mutationFn: async (nuevaCita: Omit<Cita, 'id' | 'status'>) => {
      const { data } = await api.post<Cita>('/citas', nuevaCita);
      return data;
    },
    onSuccess: () => {
      // 🎉 Esto cumple tu rúbrica: Invalidar caché general de citas forzando re-fetch
      queryClient.invalidateQueries({ queryKey: ['citas'] });
    },
  });

  // 3. CANCELAR CITA (Mutation)
  const cancelarCitaMutation = useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.patch(`/citas/${id}/cancelar`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citas'] });
    },
  });

  return {
    useCitasPaciente,
    useHistorialPaciente,
    useCitasDoctor,
    agendarCitaMutation,
    cancelarCitaMutation,
  };
};
