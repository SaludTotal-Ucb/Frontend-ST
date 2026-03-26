import { AlertCircle, Calendar, Clock, MapPin, User, X } from 'lucide-react';
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
import { Card, CardContent } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

interface Appointment {
  id: number;
  specialty: string;
  doctor: string;
  clinic: string;
  address: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
}

export default function MyAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      specialty: 'Cardiología',
      doctor: 'Dr. Carlos Mendoza',
      clinic: 'Hospital Central',
      address: 'Av. Banzer #123',
      date: '2026-03-15',
      time: '10:00',
      status: 'confirmed',
    },
    {
      id: 2,
      specialty: 'Dermatología',
      doctor: 'Dra. María Torres',
      clinic: 'Clínica del Sur',
      address: 'Calle Libertad #456',
      date: '2026-03-20',
      time: '14:30',
      status: 'pending',
    },
    {
      id: 3,
      specialty: 'Medicina General',
      doctor: 'Dr. Juan Pérez',
      clinic: 'Centro Médico Norte',
      address: 'Av. Santos Dumont #789',
      date: '2026-02-10',
      time: '09:00',
      status: 'completed',
    },
    {
      id: 4,
      specialty: 'Pediatría',
      doctor: 'Dra. Ana López',
      clinic: 'Hospital San Juan',
      address: 'Calle Sucre #321',
      date: '2026-02-01',
      time: '16:00',
      status: 'cancelled',
    },
  ]);

  const canCancelAppointment = (date: string, time: string) => {
    const appointmentDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    const hoursDifference = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursDifference > 3;
  };

  const handleCancelAppointment = (id: number) => {
    const appointment = appointments.find((a) => a.id === id);
    if (!appointment) return;

    if (!canCancelAppointment(appointment.date, appointment.time)) {
      toast.error('No puedes cancelar una cita con menos de 3 horas de anticipación');
      return;
    }

    setAppointments(appointments.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a)));

    toast.warning('Cita cancelada. Se ha aplicado una penalización de 1 mes', {
      description: 'No podrás reservar nuevas citas durante 30 días',
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
      case 'pending':
        return <Badge variant="secondary">Pendiente</Badge>;
      case 'completed':
        return <Badge variant="outline">Completada</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelada</Badge>;
      default:
        return null;
    }
  };

  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'confirmed' || a.status === 'pending',
  );
  const pastAppointments = appointments.filter(
    (a) => a.status === 'completed' || a.status === 'cancelled',
  );

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg text-gray-900">{appointment.specialty}</h3>
              {getStatusBadge(appointment.status)}
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{appointment.doctor}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>
                  {appointment.clinic} - {appointment.address}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(appointment.date).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{appointment.time} hrs</span>
              </div>
            </div>
          </div>
        </div>

        {(appointment.status === 'confirmed' || appointment.status === 'pending') && (
          <div className="flex gap-2 mt-4">
            {canCancelAppointment(appointment.date, appointment.time) ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <X className="w-4 h-4 mr-2" />
                    Cancelar Cita
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription className="space-y-2">
                      <p>
                        Al cancelar esta cita recibirás una penalización de 1 mes sin poder reservar
                        nuevas citas.
                      </p>
                      <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-md border border-amber-200">
                        <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
                        <p className="text-sm text-amber-800">
                          <strong>Advertencia:</strong> Si acumulas 3 ausencias consecutivas, tu
                          cuenta será bloqueada por 1 año.
                        </p>
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>No, mantener cita</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleCancelAppointment(appointment.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Sí, cancelar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <Button variant="outline" size="sm" disabled className="text-gray-400">
                <X className="w-4 h-4 mr-2" />
                No se puede cancelar
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Mis Citas Médicas</h2>
        <p className="text-gray-600">Gestiona tus citas programadas y revisa tu historial</p>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="upcoming">Próximas ({upcomingAppointments.length})</TabsTrigger>
          <TabsTrigger value="past">Historial ({pastAppointments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4 mt-6">
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">No tienes citas programadas</h3>
                <p className="text-gray-600 text-sm">Reserva una nueva cita para comenzar</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4 mt-6">
          {pastAppointments.length > 0 ? (
            pastAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Sin historial de citas</h3>
                <p className="text-gray-600 text-sm">Aquí aparecerán tus citas pasadas</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
