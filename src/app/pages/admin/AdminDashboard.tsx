import { Activity, Building2, Calendar, Stethoscope, Users } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { adminService } from '../../../services/api';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';

interface ActivityItem {
  id?: string;
  tipo: string;
  descripcion?: string;
  fecha: string;
}

interface PenaltyItem {
  id: string;
  paciente_nombre: string;
  paciente_ci: string;
  motivo: string;
  fecha_fin: string;
}

interface DashboardData {
  stats?: {
    pacientes?: number;
    medicos?: number;
    clinicas?: number;
    citasHoy?: number;
    citasCompletadas?: number;
    citasPendientes?: number;
  };
  recentActivity?: ActivityItem[];
  penalties?: PenaltyItem[];
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminService.getDashboard();
      const resolvedData =
        res &&
        typeof res === 'object' &&
        'success' in res &&
        (res as { success?: boolean }).success === false
          ? null
          : res;
      setData(resolvedData as DashboardData);
    } catch (error) {
      toast.error('Error al cargar datos del dashboard de administración');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleLiftPenalty = async (id: string, name: string) => {
    // Simulated backend call for lifting a penalty
    toast.success(`Penalización de ${name} levantada correctamente (Simulado)`);
    // Remove from local list
    if (data?.penalties) {
      setData({
        ...data,
        penalties: data.penalties.filter((p) => p.id !== id),
      });
    }
  };

  const stats = [
    {
      label: 'Total Pacientes',
      value: data?.stats?.pacientes?.toString() || '0',
      icon: Users,
      color: 'text-blue-600',
      change: 'Pacientes',
    },
    {
      label: 'Médicos Activos',
      value: data?.stats?.medicos?.toString() || '0',
      icon: Stethoscope,
      color: 'text-green-600',
      change: 'Médicos',
    },
    {
      label: 'Clínicas',
      value: data?.stats?.clinicas?.toString() || '0',
      icon: Building2,
      color: 'text-purple-600',
      change: 'Clínicas',
    },
    {
      label: 'Citas Hoy',
      value: data?.stats?.citasHoy?.toString() || '0',
      icon: Calendar,
      color: 'text-orange-600',
      change: 'Hoy',
    },
    {
      label: 'Citas Realizadas',
      value: data?.stats?.citasCompletadas?.toString() || '0',
      icon: Calendar,
      color: 'text-indigo-600',
      change: 'Hechas',
    },
    {
      label: 'Citas Pendientes',
      value: data?.stats?.citasPendientes?.toString() || '0',
      icon: Calendar,
      color: 'text-yellow-600',
      change: 'Pendientes',
    },
  ];

  const recentActivity = data?.recentActivity || [];
  const penalties = data?.penalties || [];

  const getActivityIcon = (tipo: string) => {
    switch (tipo) {
      case 'usuario_registrado':
        return <Users className="w-5 h-5 text-blue-600" />;
      case 'cita_agendada':
        return <Calendar className="w-5 h-5 text-orange-600" />;
      case 'clinica_creada':
        return <Building2 className="w-5 h-5 text-purple-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatActivityMessage = (act: ActivityItem) => {
    return act.descripcion || 'Actividad en el sistema';
  };

  const formatTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 1) return 'Hace unos momentos';
      if (diffMins < 60) return `Hace ${diffMins} minutos`;

      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;

      return d.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Recientemente';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Panel de Administración</h2>
        <p className="text-gray-600">Vista general del sistema hospitalario</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Cargando información del dashboard...</div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={`w-8 h-8 ${stat.color}`} />
                      <Badge variant="secondary">{stat.change}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
                <CardDescription>Operaciones frecuentes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/admin/register-patient">
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    Registrar Paciente
                  </Button>
                </Link>
                <Link to="/admin/register-doctor">
                  <Button className="w-full justify-start" variant="outline">
                    <Stethoscope className="w-4 h-4 mr-2" />
                    Registrar Médico
                  </Button>
                </Link>
                <Link to="/admin/register-clinic">
                  <Button className="w-full justify-start" variant="outline">
                    <Building2 className="w-4 h-4 mr-2" />
                    Registrar Clínica
                  </Button>
                </Link>
                <Link to="/admin/appointments">
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Ver Todas las Citas
                  </Button>
                </Link>
                <Link to="/admin/doctors">
                  <Button className="w-full justify-start" variant="outline">
                    <Stethoscope className="w-4 h-4 mr-2" />
                    Ver Todos los Médicos
                  </Button>
                </Link>
                <Link to="/admin/patients">
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    Ver Todos los Pacientes
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Actividad Reciente</CardTitle>
                  <CardDescription>Últimas acciones en el sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No se registra actividad reciente.
                      </p>
                    ) : (
                      recentActivity.map((activity: ActivityItem, index: number) => (
                        <div
                          key={activity.id || index}
                          className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0"
                        >
                          {getActivityIcon(activity.tipo)}
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">
                              {formatActivityMessage(activity)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatTime(activity.fecha)}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Penalties/Blocks */}
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Penalizaciones</CardTitle>
              <CardDescription>Pacientes con bloqueos activos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {penalties.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No hay penalizaciones activas en este momento.
                  </p>
                ) : (
                  penalties.map((penalty: PenaltyItem) => {
                    const isLongTerm =
                      new Date(penalty.fecha_fin).getTime() - Date.now() > 30 * 24 * 60 * 60 * 1000;
                    return (
                      <div
                        key={penalty.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900">{penalty.paciente_nombre}</h4>
                            <Badge variant={isLongTerm ? 'destructive' : 'secondary'}>
                              Bloqueado {isLongTerm ? '1 año' : '1 mes'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">CI: {penalty.paciente_ci}</p>
                          <p className="text-sm text-gray-600">Motivo: {penalty.motivo}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Bloqueado hasta:{' '}
                            {new Date(penalty.fecha_fin).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleLiftPenalty(penalty.id, penalty.paciente_nombre)}
                          >
                            Desbloquear
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
