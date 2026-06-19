import { Calendar as CalendarIcon, Clock, Edit, MapPin, User, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../../hooks/useAuth';
import { useCitas } from '../../../hooks/useCitas';
import { appointmentService } from '../../../services/api';
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
  DialogClose,
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

export default function DoctorAgenda() {
  const { user } = useAuth();
  const { useCitasDoctor, cancelarCitaMutation } = useCitas();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [localStatuses, setLocalStatuses] = useState<Record<string, string>>({});

  const { data: appointments = [], isLoading } = useCitasDoctor(user?.id || '');

  const handleCancelAppointment = async (id: string, _reason: string) => {
    try {
      await cancelarCitaMutation.mutateAsync(id);
      setLocalStatuses((prev) => ({ ...prev, [id]: 'cancelled' }));
      toast.success('Cita cancelada correctamente', {
        description: 'El paciente ha sido notificado sin penalización',
      });
    } catch (error) {
      toast.error('Error al cancelar la cita');
      console.error(error);
    }
  };

  const handleConfirmAppointment = async (id: string) => {
    try {
      await appointmentService.confirmAppointment(id);
      setLocalStatuses((prev) => ({ ...prev, [id]: 'confirmed' }));
      toast.success('Cita confirmada correctamente');
    } catch (error) {
      toast.error('Error al confirmar la cita');
      console.error(error);
    }
  };

  const handleMarkAbsent = (id: string) => {
    setLocalStatuses((prev) => ({ ...prev, [id]: 'absent' }));
    toast.warning('Paciente marcado como ausente', {
      description: 'Se ha registrado la inasistencia. Se aplicará la penalización.',
    });
  };

  const handleCompleteAppointment = (id: string) => {
    setLocalStatuses((prev) => ({ ...prev, [id]: 'completed' }));
    toast.success('Consulta completada', {
      description: 'Los detalles médicos se han guardado y la consulta ha finalizado',
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
        return (
          <Badge variant="secondary" className="bg-gray-500 text-white">
            Pendiente
          </Badge>
        );
    }
  };

  // Filter appointments by selected date in YYYY-MM-DD local format
  const filteredAppointments = useMemo(() => {
    if (!selectedDate) return appointments;
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    return appointments.filter((a) => a.date === dateStr);
  }, [appointments, selectedDate]);

  const upcomingAppointments = useMemo(() => {
    return filteredAppointments.filter((a) => {
      const status = localStatuses[a.id] || a.status;
      return status === 'confirmed' || status === 'pending';
    });
  }, [filteredAppointments, localStatuses]);

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
                  {upcomingAppointments.length}
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
              {isLoading ? (
                <div className="text-center py-12 text-gray-500 animate-pulse">
                  Cargando agenda de citas...
                </div>
              ) : filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => {
                  const status = localStatuses[appointment.id] || appointment.status;
                  const patientName = appointment.paciente_nombre || 'Paciente no identificado';
                  const patientCi = appointment.paciente_ci || 'No registrado';
                  return (
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
                            {getStatusBadge(status)}
                          </div>
                          <h4 className="font-medium text-gray-900 mb-1">{patientName}</h4>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>CI: {patientCi}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{appointment.clinic}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {status === 'pending' && (
                        <div className="flex gap-2 pt-3 border-t">
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => handleConfirmAppointment(appointment.id)}
                          >
                            Confirmar Cita
                          </Button>
                        </div>
                      )}

                      {status === 'confirmed' && (
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
                                  <p>¿Estás seguro de cancelar la cita con {patientName}?</p>
                                  <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                                    <p className="text-sm text-blue-800">
                                      <strong>Nota:</strong> El paciente será notificado y no
                                      recibirá penalización. El horario quedará disponible para otra
                                      reserva.
                                    </p>
                                  </div>
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>No, mantener</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleCancelAppointment(
                                      appointment.id,
                                      'Cancelada por el médico',
                                    )
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
                                    ¿Confirmas que el paciente {patientName} no se presentó a su
                                    cita?
                                  </p>
                                  <div className="p-3 bg-orange-50 rounded-md border border-orange-200">
                                    <p className="text-sm text-orange-800">
                                      <strong>Atención:</strong> Al confirmar esta acción, el
                                      sistema registrará la inasistencia y el usuario recibirá una
                                      penalización de bloqueo por 1 año (según la regla del
                                      backend).
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
                                  Actualiza los detalles de la consulta con {patientName}.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="patient">Paciente</Label>
                                  <Input
                                    id="patient"
                                    defaultValue={patientName}
                                    className="w-full"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="ci">CI</Label>
                                  <Input id="ci" defaultValue={patientCi} className="w-full" />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="date">Fecha</Label>
                                  <Input
                                    id="date"
                                    type="date"
                                    defaultValue={appointment.date}
                                    className="w-full"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="time">Hora</Label>
                                  <Input
                                    id="time"
                                    type="time"
                                    defaultValue={appointment.time}
                                    className="w-full"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="specialty">Especialidad</Label>
                                  <Input
                                    id="specialty"
                                    defaultValue={appointment.specialty}
                                    className="w-full"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="clinic">Clínica</Label>
                                  <Input
                                    id="clinic"
                                    defaultValue={appointment.clinic}
                                    className="w-full"
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
                                <DialogClose asChild>
                                  <Button type="button" className="bg-gray-500 hover:bg-gray-600">
                                    Cancelar
                                  </Button>
                                </DialogClose>
                                <DialogClose asChild>
                                  <Button
                                    type="button"
                                    onClick={() => handleCompleteAppointment(appointment.id)}
                                    className="bg-blue-500 hover:bg-blue-600"
                                  >
                                    Guardar y Completar
                                  </Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                    </div>
                  );
                })
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
