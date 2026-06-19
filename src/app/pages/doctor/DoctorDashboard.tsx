import { Calendar, CheckCircle, Clock, FileText, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { useAuth } from '../../../hooks/useAuth';
import { useCitas } from '../../../hooks/useCitas';
import { appointmentService, doctorService } from '../../../services/api';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const { useCitasDoctor } = useCitas();

  const [statsData, setStatsData] = useState({
    citasHoy: 0,
    citasCompletadas: 0,
    pacientesUnicos: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // Local state to simulate starting / completing consultations in the UI
  const [localStatuses, setLocalStatuses] = useState<Record<string, string>>({});

  const todayString = useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const { data: appointments, isLoading: isLoadingAppointments } = useCitasDoctor(
    user?.id || '',
    todayString,
  );

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const res = await doctorService.getDashboardStats();
        if (res) {
          const stats = res as unknown as {
            citasHoy?: number;
            citasCompletadas?: number;
            pacientesUnicos?: number;
          };
          setStatsData({
            citasHoy: stats.citasHoy || 0,
            citasCompletadas: stats.citasCompletadas || 0,
            pacientesUnicos: stats.pacientesUnicos || 0,
          });
        }
      } catch (error) {
        console.error('Error fetching doctor stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };
    if (user?.id) {
      fetchStats();
    }
  }, [user?.id]);

  const handleStartConsultation = (appointmentId: string, patientName: string) => {
    setLocalStatuses((prev) => ({ ...prev, [appointmentId]: 'in-progress' }));
    toast.success(`Consulta iniciada para ${patientName}. Acceso al historial médico habilitado.`);
  };

  const handleFinishConsultation = (appointmentId: string, patientName: string) => {
    setLocalStatuses((prev) => ({ ...prev, [appointmentId]: 'completed' }));
    toast.success(`Consulta finalizada para ${patientName}. Historial cerrado.`);
    // Update stats locally
    setStatsData((prev) => ({
      ...prev,
      citasCompletadas: prev.citasCompletadas + 1,
    }));
  };

  const handleConfirmAppointment = async (appointmentId: string) => {
    try {
      await appointmentService.confirmAppointment(appointmentId);
      setLocalStatuses((prev) => ({ ...prev, [appointmentId]: 'confirmed' }));
      toast.success('Cita confirmada correctamente');
    } catch (error) {
      toast.error('Error al confirmar la cita');
      console.error(error);
    }
  };

  const stats = [
    {
      label: 'Citas Hoy',
      value: statsData.citasHoy.toString(),
      icon: Calendar,
      color: 'text-blue-600',
    },
    {
      label: 'Total Pacientes',
      value: statsData.pacientesUnicos.toString(),
      icon: Users,
      color: 'text-green-600',
    },
    {
      label: 'Completadas',
      value: statsData.citasCompletadas.toString(),
      icon: CheckCircle,
      color: 'text-purple-600',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Completada
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge variant="default" className="bg-blue-600">
            En Consulta
          </Badge>
        );
      case 'pending':
        return <Badge variant="secondary">Pendiente</Badge>;
      case 'confirmed':
        return (
          <Badge variant="default" className="bg-blue-50 text-blue-700 border-blue-200">
            Confirmada
          </Badge>
        );
      case 'cancelled':
        return <Badge variant="destructive">Cancelada</Badge>;
      case 'absent':
        return <Badge variant="destructive">Ausente</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Resolve current active consultation for history access panel
  const activeConsultation = useMemo(() => {
    if (!appointments) return null;
    return appointments.find((app) => localStatuses[app.id] === 'in-progress');
  }, [appointments, localStatuses]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Panel del Médico</h2>
        <p className="text-gray-600">{user?.name || 'Dr. Médico'}</p>
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
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {loadingStats ? '...' : stat.value}
                    </p>
                  </div>
                  <Icon className={`w-10 h-10 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agenda del Día */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Agenda de Hoy</CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString('es-ES', {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoadingAppointments ? (
                <div className="text-center py-8 text-gray-500">Cargando agenda de hoy...</div>
              ) : !appointments || appointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No tienes citas programadas para hoy.
                </div>
              ) : (
                appointments.map((appointment) => {
                  const status = localStatuses[appointment.id] || appointment.status;
                  const patientName = appointment.paciente_nombre || 'Paciente no identificado';
                  return (
                    <div
                      key={appointment.id}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-4 h-4 text-gray-600" />
                            <span className="font-semibold text-gray-900">
                              {appointment.time} hrs
                            </span>
                            {getStatusBadge(status)}
                          </div>
                          <h4 className="font-medium text-gray-900">{patientName}</h4>
                          <p className="text-sm text-gray-600">{appointment.specialty}</p>
                        </div>
                      </div>

                      {status === 'in-progress' && (
                        <div className="mt-3 flex gap-2">
                          <Link to={`/doctor/patient-history/${appointment.paciente_id}`}>
                            <Button size="sm">
                              <FileText className="w-4 h-4 mr-2" />
                              Ver Historial
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleFinishConsultation(appointment.id, patientName)}
                          >
                            Finalizar Consulta
                          </Button>
                        </div>
                      )}

                      {status === 'pending' && (
                        <div className="mt-3">
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
                        <div className="mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStartConsultation(appointment.id, patientName)}
                          >
                            Iniciar Consulta
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>

        {/* Información y Accesos */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Acceso al Historial</CardTitle>
              <CardDescription>Control de permisos JWT</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeConsultation ? (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium text-green-900 mb-1">Acceso Activo</p>
                    <p className="text-xs text-green-700">{activeConsultation.paciente_nombre}</p>
                    <p className="text-xs text-green-600 mt-1">Expira al finalizar la consulta</p>
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
                    <p className="text-xs text-gray-500">Ninguna consulta activa en este momento</p>
                  </div>
                )}
                <div className="text-xs text-gray-600 space-y-1">
                  <p>• El acceso se otorga automáticamente al iniciar la consulta</p>
                  <p>• JWT válido solo durante el horario de la cita</p>
                  <p>• Se revoca automáticamente al finalizar</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/doctor/agenda">
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Ver Agenda Completa
                </Button>
              </Link>
              <Link to="/doctor/inbox">
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Bandeja de Entrada
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
