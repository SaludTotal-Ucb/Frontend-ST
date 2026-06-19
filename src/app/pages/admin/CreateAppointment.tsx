import { ArrowLeft, Calendar, Search, Stethoscope, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { adminService } from '../../../services/api';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

interface PatientItem {
  id: string;
  name: string;
  ci: string;
  email: string;
}

interface DoctorItem {
  id: string;
  name: string;
  especialidad: string;
  clinicaNombre: string;
}

export default function CreateAppointment() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<PatientItem[]>([]);
  const [doctors, setDoctors] = useState<DoctorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [patientSearch, setPatientSearch] = useState('');
  const [doctorSearch, setDoctorSearch] = useState('');

  const [form, setForm] = useState({
    pacienteId: '',
    medicoId: '',
    fecha: '',
    especialidad: '',
    notas: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [pRes, dRes] = await Promise.all([
          adminService.getPacientes(),
          adminService.getDoctores(),
        ]);
        const pList = Array.isArray(pRes) ? pRes : Array.isArray((pRes as any)?.data) ? (pRes as any).data : [];
        const dList = Array.isArray(dRes) ? dRes : Array.isArray((dRes as any)?.data) ? (dRes as any).data : [];
        setPatients(pList as PatientItem[]);
        setDoctors(dList as DoctorItem[]);
      } catch (err) {
        console.error(err);
        toast.error('Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Auto-fill especialidad when doctor is selected
  const handleDoctorChange = (doctorId: string) => {
    const doctor = doctors.find((d) => d.id === doctorId);
    setForm((f) => ({
      ...f,
      medicoId: doctorId,
      especialidad: doctor?.especialidad || f.especialidad,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.pacienteId || !form.medicoId || !form.fecha) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }
    try {
      setSubmitting(true);
      await adminService.createCitaAsAdmin({
        pacienteId: form.pacienteId,
        medicoId: form.medicoId,
        fecha: form.fecha,
        especialidad: form.especialidad,
        notas: form.notas,
      });
      toast.success('Cita creada exitosamente');
      navigate('/admin/appointments');
    } catch (error) {
      toast.error('Error al crear la cita');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPatients = patients.filter((p) => {
    const t = patientSearch.toLowerCase();
    return (p.name || '').toLowerCase().includes(t) || (p.ci || '').includes(t);
  });

  const filteredDoctors = doctors.filter((d) => {
    const t = doctorSearch.toLowerCase();
    return (d.name || '').toLowerCase().includes(t) || (d.especialidad || '').toLowerCase().includes(t);
  });

  const selectedPatient = patients.find((p) => p.id === form.pacienteId);
  const selectedDoctor = doctors.find((d) => d.id === form.medicoId);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500 animate-pulse">Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Crear Nueva Cita</h2>
          <p className="text-gray-600">Agendar una cita médica como administrador</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="w-5 h-5 text-blue-600" />
              Seleccionar Paciente
              <span className="text-red-500">*</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar paciente por nombre o CI..."
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {selectedPatient && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                <strong className="text-blue-900">Seleccionado:</strong>{' '}
                <span className="text-blue-800">{selectedPatient.name}</span>
                <span className="text-blue-600 ml-2">(CI: {selectedPatient.ci})</span>
              </div>
            )}

            <div className="max-h-48 overflow-y-auto space-y-1 border rounded-lg p-2">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      form.pacienteId === p.id
                        ? 'bg-blue-100 text-blue-900 font-medium'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                    onClick={() => setForm((f) => ({ ...f, pacienteId: p.id }))}
                  >
                    <span className="font-medium">{p.name}</span>
                    <span className="text-gray-500 ml-2 text-xs">CI: {p.ci}</span>
                  </button>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">No se encontraron pacientes</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Doctor Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Stethoscope className="w-5 h-5 text-green-600" />
              Seleccionar Médico
              <span className="text-red-500">*</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar médico por nombre o especialidad..."
                value={doctorSearch}
                onChange={(e) => setDoctorSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {selectedDoctor && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
                <strong className="text-green-900">Seleccionado:</strong>{' '}
                <span className="text-green-800">{selectedDoctor.name}</span>
                <span className="text-green-600 ml-2">({selectedDoctor.especialidad})</span>
                <span className="text-gray-500 ml-2 text-xs">– {selectedDoctor.clinicaNombre}</span>
              </div>
            )}

            <div className="max-h-48 overflow-y-auto space-y-1 border rounded-lg p-2">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      form.medicoId === d.id
                        ? 'bg-green-100 text-green-900 font-medium'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                    onClick={() => handleDoctorChange(d.id)}
                  >
                    <span className="font-medium">{d.name}</span>
                    <span className="text-gray-500 ml-2 text-xs">{d.especialidad} – {d.clinicaNombre}</span>
                  </button>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">No se encontraron médicos</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Date, Specialty & Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="w-5 h-5 text-orange-600" />
              Detalles de la Cita
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fecha">
                  Fecha y Hora <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fecha"
                  type="datetime-local"
                  value={form.fecha}
                  onChange={(e) => setForm((f) => ({ ...f, fecha: e.target.value }))}
                  min={new Date().toISOString().slice(0, 16)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="especialidad">Especialidad</Label>
                <Select
                  value={form.especialidad}
                  onValueChange={(v) => setForm((f) => ({ ...f, especialidad: v }))}
                >
                  <SelectTrigger id="especialidad">
                    <SelectValue placeholder="Seleccionar especialidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Medicina General">Medicina General</SelectItem>
                    <SelectItem value="Cardiología">Cardiología</SelectItem>
                    <SelectItem value="Pediatría">Pediatría</SelectItem>
                    <SelectItem value="Ginecología">Ginecología</SelectItem>
                    <SelectItem value="Traumatología">Traumatología</SelectItem>
                    <SelectItem value="Dermatología">Dermatología</SelectItem>
                    <SelectItem value="Neurología">Neurología</SelectItem>
                    <SelectItem value="Oftalmología">Oftalmología</SelectItem>
                    <SelectItem value="Psiquiatría">Psiquiatría</SelectItem>
                    {form.especialidad &&
                      !['Medicina General','Cardiología','Pediatría','Ginecología','Traumatología','Dermatología','Neurología','Oftalmología','Psiquiatría'].includes(form.especialidad) && (
                        <SelectItem value={form.especialidad}>{form.especialidad}</SelectItem>
                      )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notas">Notas / Observaciones (opcional)</Label>
              <Input
                id="notas"
                placeholder="Razón de la consulta, síntomas, observaciones..."
                value={form.notas}
                onChange={(e) => setForm((f) => ({ ...f, notas: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => navigate(-1)} className="flex-1">
            Cancelar
          </Button>
          <Button type="submit" disabled={submitting || !form.pacienteId || !form.medicoId || !form.fecha} className="flex-1">
            {submitting ? 'Creando Cita...' : 'Crear Cita'}
          </Button>
        </div>
      </form>
    </div>
  );
}
