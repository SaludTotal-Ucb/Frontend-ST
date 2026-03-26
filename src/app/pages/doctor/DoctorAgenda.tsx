import { Calendar as CalendarIcon, Clock, Edit, MapPin, User, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../components/ui/alert-dialog';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Calendar } from '../../components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';

interface Appointment {
  id: number;
  patient: string;
  ci: string;
  date: string;
  time: string;
  specialty: string;
  clinic: string;
  status: 'confirmed' | 'completed' | 'cancelled' | 'absent';
}

export default function DoctorAgenda() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      patient: 'Juan Pérez García',
      ci: '12345678',
      date: '2026-03-12',
      time: '09:00',
      specialty: 'Cardiología',
      clinic: 'Hospital Central',
      status: 'completed',
    },
    {
      id: 2,
      patient: 'María López Sánchez',
      ci: '23456789',
      date: '2026-03-12',
      time: '10:00',
      specialty: 'Cardiología',
      clinic: 'Hospital Central',
      status: 'confirmed',
    },
    {
      id: 3,
      patient: 'Carlos Rodríguez',
      ci: '34567890',
      date: '2026-03-12',
      time: '11:00',
      specialty: 'Cardiología',
      clinic: 'Hospital Central',
      status: 'confirmed',
    },
    {
      id: 4,
      patient: 'Ana Martínez',
      ci: '45678901',
      date: '2026-03-12',
      time: '14:00',
      specialty: 'Cardiología',
      clinic: 'Hospital Central',
      status: 'confirmed',
    },
    {
      id: 5,
      patient: 'Luis Torres',
      ci: '56789012',
      date: '2026-03-15',
      time: '09:30',
      specialty: 'Cardiología',
      clinic: 'Hospital Central',
      status: 'confirmed',
    },
    {
      id: 6,
      patient: 'Patricia Gómez',
      ci: '67890123',
      date: '2026-03-15',
      time: '11:00',
      specialty: 'Cardiología',
      clinic: 'Hospital Central',
      status: 'confirmed',
    },
  ]);

  const handleCancelAppointment = (id: number, _reason: string) => {
    setAppointments(appointments.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a)));

    toast.success('Cita cancelada correctamente', {
      description: 'El paciente ha sido notificado sin penalización',
    });
  };

  const handleMarkAbsent = (id: number) => {
    setAppointments(appointments.map((a) => (a.id === id ? { ...a, status: 'absent' } : a)));

    toast.warning('Paciente marcado como ausente', {
      description: 'Se ha registrado la inasistencia. Se aplicará la penalización.',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <Badge variant="default" className="bg-green-600">
            Confirmada
          </Badge>
        );
      case 'completed':
        return <Badge variant="outline">Completada</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelada</Badge>;
      case 'absent':
        return (
          <Badge variant="secondary" className="bg-orange-500 text-white hover:bg-orange-600">
            Ausente
          </Badge>
        );
      default:
        return null;
    }
  };

  // Filter appointments by selected date
  const filteredAppointments = selectedDate
    ? appointments.filter((a) => {
        const appointmentDate = new Date(a.date);
        return appointmentDate.toDateString() === selectedDate.toDateString();
      })
    : appointments;

  const upcomingAppointments = filteredAppointments.filter((a) => a.status === 'confirmed');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Mi Agenda</h2>
        <p className="text-gray-600">Gestiona tus citas y consultas programadas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Seleccionar Fecha</CardTitle>
            <CardDescription>Elige un día para ver tus citas</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border w-full"
            />
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                <span className="text-gray-700">Citas del día</span>
                <Badge variant="default" className="bg-green-600">
                  {filteredAppointments.filter((a) => a.status === 'confirmed').length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                Citas del{' '}
                {selectedDate?.toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </CardTitle>
              <CardDescription>{upcomingAppointments.length} citas programadas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-gray-600" />
                          <span className="font-semibold text-gray-900">
                            {appointment.time} hrs
                          </span>
                          {getStatusBadge(appointment.status)}
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">{appointment.patient}</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>CI: {appointment.ci}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{appointment.clinic}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {appointment.status === 'confirmed' && (
                      <div className="flex gap-2 pt-3 border-t">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Cancelar Cita
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Cancelar Cita Médica</AlertDialogTitle>
                              <AlertDialogDescription className="space-y-2">
                                <p>¿Estás seguro de cancelar la cita con {appointment.patient}?</p>
                                <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                                  <p className="text-sm text-blue-800">
                                    <strong>Nota:</strong> El paciente será notificado y no recibirá
                                    penalización. El horario quedará disponible para otra reserva.
                                  </p>
                                </div>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>No, mantener</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleCancelAppointment(appointment.id, 'Cancelada por el médico')
                                }
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Sí, cancelar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                            >
                              <User className="w-4 h-4 mr-2" />
                              Marcar Ausencia
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Marcar Ausencia del Paciente</AlertDialogTitle>
                              <AlertDialogDescription className="space-y-2">
                                <p>
                                  ¿Confirmas que el paciente {appointment.patient} no se presentó a
                                  su cita?
                                </p>
                                <div className="p-3 bg-orange-50 rounded-md border border-orange-200">
                                  <p className="text-sm text-orange-800">
                                    <strong>Atención:</strong> Al confirmar esta acción, el sistema
                                    registrará la inasistencia y el usuario recibirá una
                                    penalización de bloqueo por 1 año (según la regla del backend).
                                  </p>
                                </div>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleMarkAbsent(appointment.id)}
                                className="bg-orange-600 hover:bg-orange-700"
                              >
                                Sí, marcar ausente
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4 mr-2" />
                              Editar Consulta
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Editar Consulta</DialogTitle>
                              <DialogDescription>
                                Actualiza los detalles de la consulta con {appointment.patient}.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="patient">Paciente</Label>
                                <Input
                                  id="patient"
                                  value={appointment.patient}
                                  className="w-full"
                                  readOnly
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="ci">CI</Label>
                                <Input id="ci" value={appointment.ci} className="w-full" readOnly />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="date">Fecha</Label>
                                <Input
                                  id="date"
                                  value={appointment.date}
                                  className="w-full"
                                  readOnly
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="time">Hora</Label>
                                <Input
                                  id="time"
                                  value={appointment.time}
                                  className="w-full"
                                  readOnly
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="specialty">Especialidad</Label>
                                <Input
                                  id="specialty"
                                  value={appointment.specialty}
                                  className="w-full"
                                  readOnly
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="clinic">Clínica</Label>
                                <Input
                                  id="clinic"
                                  value={appointment.clinic}
                                  className="w-full"
                                  readOnly
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="notes">Notas</Label>
                                <Textarea
                                  id="notes"
                                  placeholder="Añade notas sobre la consulta"
                                  className="w-full"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="button" className="bg-gray-500 hover:bg-gray-600">
                                Cancelar
                              </Button>
                              <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                                Guardar Cambios
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Sin citas programadas</h3>
                  <p className="text-gray-600 text-sm">No hay citas para esta fecha</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
