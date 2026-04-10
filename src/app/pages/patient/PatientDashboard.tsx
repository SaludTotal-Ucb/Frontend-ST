import { AlertCircle, Calendar, CheckCircle, Clock, FileText } from 'lucide-react';
import { Link } from 'react-router';
import { useAuth } from '../../../hooks/useAuth';
import { useCitas } from '../../../hooks/useCitas';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';

export default function PatientDashboard() {
  const { user } = useAuth();
  const patientId = user?.id ?? '';
  const { useCitasPaciente, useHistorialPaciente } = useCitas();

  const { data: appointments, isLoading, isError } = useCitasPaciente(patientId);
  const { data: historial } = useHistorialPaciente(patientId);

  const safeAppointments = appointments || [];
  const now = new Date();

  const upcomingAppointments = safeAppointments
    .filter((appointment) => {
      const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
      return (
        (appointment.status === 'confirmed' || appointment.status === 'pending') &&
        appointmentDateTime >= now
      );
    })
    .sort(
      (a, b) =>
        new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime(),
    );

  const nextAppointment = upcomingAppointments[0] || null;
  const pendingCount = safeAppointments.filter((a) => a.status === 'pending').length;
  const historialCount = Array.isArray(historial) ? historial.length : 0;

  const stats = [
    {
      label: 'Citas Programadas',
      value: String(upcomingAppointments.length),
      icon: Calendar,
      color: 'text-blue-600',
    },
    {
      label: 'Historial Médico',
      value: String(historialCount),
      icon: FileText,
      color: 'text-green-600',
    },
    { label: 'Pendientes', value: String(pendingCount), icon: Clock, color: 'text-orange-600' },
  ];

  const recentActivity = safeAppointments
    .slice()
    .sort(
      (a, b) =>
        new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime(),
    )
    .slice(0, 3)
    .map((appointment) => {
      const type =
        appointment.status === 'cancelled'
          ? 'warning'
          : appointment.status === 'pending'
            ? 'info'
            : 'success';

      const statusLabel =
        appointment.status === 'confirmed'
          ? 'confirmada'
          : appointment.status === 'pending'
            ? 'pendiente'
            : appointment.status === 'completed'
              ? 'completada'
              : appointment.status === 'cancelled'
                ? 'cancelada'
                : 'actualizada';

      return {
        type,
        message: `Cita ${statusLabel}: ${appointment.specialty}`,
        time: new Date(`${appointment.date}T${appointment.time}`).toLocaleString('es-ES'),
      };
    });

  const formatLocalDate = (isoDate: string) => {
    const [year, month, day] = isoDate.split('-').map(Number);
    const localDate = new Date(year, month - 1, day);
    return localDate.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  if (!patientId) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bienvenido a tu Panel</h2>
          <p className="text-gray-600">Gestiona tus citas y consulta tu historial médico</p>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">
              Debes iniciar sesión para ver tus datos del dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bienvenido a tu Panel</h2>
          <p className="text-gray-600">Gestiona tus citas y consulta tu historial médico</p>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Cargando datos del dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bienvenido a tu Panel</h2>
          <p className="text-gray-600">Gestiona tus citas y consulta tu historial médico</p>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-red-600">No fue posible cargar tus citas en este momento.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Bienvenido a tu Panel</h2>
        <p className="text-gray-600">Gestiona tus citas y consulta tu historial médico</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <Icon className={`w-10 h-10 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próxima Cita */}
        <Card>
          <CardHeader>
            <CardTitle>Próxima Cita</CardTitle>
            <CardDescription>Tu siguiente consulta médica</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {nextAppointment ? (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{nextAppointment.specialty}</h4>
                    <p className="text-sm text-gray-600">{nextAppointment.doctor}</p>
                    <p className="text-sm text-gray-500">{nextAppointment.clinic}</p>
                  </div>
                  <Badge variant={nextAppointment.status === 'confirmed' ? 'default' : 'secondary'}>
                    {nextAppointment.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-gray-700">
                    <Calendar className="w-4 h-4" />
                    <span>{formatLocalDate(nextAppointment.date)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-700">
                    <Clock className="w-4 h-4" />
                    <span>{nextAppointment.time} hrs</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">No tienes citas próximas programadas.</p>
              </div>
            )}
            <Link to="/patient/my-appointments">
              <Button variant="outline" className="w-full">
                Ver todas mis citas
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Acciones Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Tareas frecuentes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/patient/book-appointment">
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Reservar Nueva Cita
              </Button>
            </Link>
            <Link to="/patient/medical-history">
              <Button className="w-full justify-start" variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Ver Historial Médico
              </Button>
            </Link>
            <Link to="/patient/inbox">
              <Button className="w-full justify-start" variant="outline">
                <AlertCircle className="w-4 h-4 mr-2" />
                Revisar Notificaciones
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Actividad Reciente */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>Últimas actualizaciones de tu cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-gray-600">Aun no hay actividad reciente para mostrar.</p>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={`${activity.message}-${activity.time}`}
                  className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0"
                >
                  {activity.type === 'success' && (
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  )}
                  {activity.type === 'info' && <Clock className="w-5 h-5 text-blue-600 mt-0.5" />}
                  {activity.type === 'warning' && (
                    <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
