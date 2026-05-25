import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

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
  paciente_nombre?: string;
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
  paciente_nombre?: string;
};
//mapeo para la api(back citas)
const mapCitaApiToUi = (cita: CitaApi): Cita => ({
  id: cita.id,
  specialty: cita.especialidad,
  doctor: cita.medico_id,
  clinic: cita.clinica_id || 'Hospital Central',
  address: '',
  date: cita.fecha,
  time: cita.hora,
  status: cita.estado,
  paciente_nombre: cita.paciente_nombre,
});

export const useCitas = () => {
  const queryClient = useQueryClient();

  //citas paciente
  const useCitasPaciente = (pacienteId: string) =>
    useQuery({
      queryKey: ['citas', 'paciente', pacienteId],
      queryFn: async () => {
        // Llama a GET /api/v1/citas/paciente/:id
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
        // Llama a GET /api/v1/historial/paciente/:id
        const { data } = await api.get<unknown>(`/historial/paciente/${pacienteId}`);
        return data;
      },
      enabled: !!pacienteId,
    });

  // 1.5 obtener citas del doctor
  const useCitasDoctor = (doctorId: string, fecha?: string) =>
    useQuery({
      queryKey: ['citas', 'doctor', doctorId, fecha || 'all'],
      queryFn: async () => {
        // Llama a GET /api/v1/citas/medico/:id?fecha=YYYY-MM-DD
        const { data } = await api.get<CitaApi[]>(`/citas/medico/${encodeURIComponent(doctorId)}`, {
          params: fecha ? { fecha } : undefined,
        });
        return (data || []).map(mapCitaApiToUi);
      },
      enabled: !!doctorId,
    });

  // agendar cita
  const agendarCitaMutation = useMutation({
    mutationFn: async (nuevaCita: {
      fecha: string;
      hora: string;
      medico_id: string;
      especialidad: string;
      motivo?: string;
      clinica_id?: string;
      paciente_id?: string;
    }) => {
      // nuevaCita viene de la UI: { especialidad, medico_id, clinica_id, fecha, hora, paciente_id, motivo }
      // Combinamos fecha (YYYY-MM-DD) y hora (HH:mm) para enviar un ISO string
      const fechaCombinada = new Date(`${nuevaCita.fecha}T${nuevaCita.hora}:00`).toISOString();
      const payload = {
        doctorId: nuevaCita.medico_id,
        fecha: fechaCombinada,
        especialidad: nuevaCita.especialidad,
        notas: nuevaCita.motivo || '',
      };
      const { data } = await api.post<unknown>('/citas', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citas'] });
    },
  });

  // cancelar cita
  const cancelarCitaMutation = useMutation({
    mutationFn: async (id: string) => {
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
