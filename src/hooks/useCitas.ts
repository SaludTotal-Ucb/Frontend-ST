import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_URLS } from '../config/api-config';

// interfaces cita
export interface Cita {
  id: string;
  specialty: string;
  doctor: string;
  clinic: string;
  address: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'absent';
}

type CitaApi = {
  id: string;
  paciente_id: string;
  medico_id: string;
  clinica_id: string;
  especialidad: string;
  fecha: string;
  hora: string;
  estado: 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'absent';
};
//mapeo para la api(back citas)
const mapCitaApiToUi = (cita: CitaApi): Cita => ({
  id: cita.id,
  specialty: cita.especialidad,
  doctor: cita.medico_id,
  clinic: cita.clinica_id,
  address: '',
  date: cita.fecha,
  time: cita.hora,
  status: cita.estado,
});

// axios
const api = axios.create({
  baseURL: API_URLS.citas,
});

export const useCitas = () => {
  const queryClient = useQueryClient();

  //citas paciente
  const useCitasPaciente = (pacienteId: string) =>
    useQuery({
      queryKey: ['citas', 'paciente', pacienteId],
      queryFn: async () => {
        // Llama a GET /api/citas/paciente/:id
        const { data } = await api.get<CitaApi[]>(`/citas/paciente/${pacienteId}`);
        return (data || []).map(mapCitaApiToUi);
      },
      enabled: !!pacienteId,
    });

  // historial paciente
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

  // 1.5 obtener citas del doctor
  const useCitasDoctor = (doctorId: string) =>
    useQuery({
      queryKey: ['citas', 'doctor', doctorId],
      queryFn: async () => {
        // Llama a GET /api/citas/medico/:id
        const { data } = await api.get<CitaApi[]>(`/citas/medico/${doctorId}`);
        return (data || []).map(mapCitaApiToUi);
      },
      enabled: !!doctorId,
    });

  // agendar cita
  const agendarCitaMutation = useMutation({
    mutationFn: async (nuevaCita: Omit<Cita, 'id' | 'status'>) => {
      const { data } = await api.post<Cita>('/citas', nuevaCita);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citas'] });
    },
  });

  // cancelar cita
  const cancelarCitaMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch(`/citas/${id}/estado`, {
        estado: 'cancelled',
      });
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
