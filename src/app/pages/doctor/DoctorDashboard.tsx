import { Calendar, CheckCircle, Clock, FileText, Users } from 'lucide-react';
import { Link } from 'react-router';
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
  const todayAppointments = [
    {
      id: 1,
      patient: 'Juan Pérez García',
      time: '09:00',
      specialty: 'Cardiología',
      status: 'completed',
      hasAccess: false,
    },
    {
      id: 2,
      patient: 'María López Sánchez',
      time: '10:00',
      specialty: 'Cardiología',
      status: 'in-progress',
      hasAccess: true,
    },
    {
      id: 3,
      patient: 'Carlos Rodríguez',
      time: '11:00',
      specialty: 'Cardiología',
      status: 'pending',
      hasAccess: false,
    },
    {
      id: 4,
      patient: 'Ana Martínez',
      time: '14:00',
      specialty: 'Cardiología',
      status: 'pending',
      hasAccess: false,
    },
  ];

  const stats = [
    { label: 'Citas Hoy', value: '4', icon: Calendar, color: 'text-blue-600' },
    { label: 'Total Pacientes', value: '127', icon: Users, color: 'text-green-600' },
    { label: 'Completadas', value: '1', icon: CheckCircle, color: 'text-purple-600' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700">
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
      case 'absent':
        return <Badge variant="destructive">Ausente</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Panel del Médico</h2>
        <p className="text-gray-600">Dr. Carlos Mendoza - Cardiología</p>
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
              {todayAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-gray-600" />
                        <span className="font-semibold text-gray-900">{appointment.time} hrs</span>
                        {getStatusBadge(appointment.status)}
                      </div>
                      <h4 className="font-medium text-gray-900">{appointment.patient}</h4>
                      <p className="text-sm text-gray-600">{appointment.specialty}</p>
                    </div>
                  </div>

                  {appointment.status === 'in-progress' && appointment.hasAccess && (
                    <div className="mt-3 flex gap-2">
                      <Link to={`/doctor/patient-history/${appointment.id}`}>
                        <Button size="sm">
                          <FileText className="w-4 h-4 mr-2" />
                          Ver Historial
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline">
                        Finalizar Consulta
                      </Button>
                    </div>
                  )}

                  {appointment.status === 'pending' && (
                    <div className="mt-3">
                      <Button size="sm" variant="outline">
                        Iniciar Consulta
                      </Button>
                    </div>
                  )}
                </div>
              ))}
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
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-900 mb-1">Acceso Activo</p>
                  <p className="text-xs text-green-700">María López Sánchez</p>
                  <p className="text-xs text-green-600 mt-1">Expira al finalizar la consulta</p>
                </div>
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
