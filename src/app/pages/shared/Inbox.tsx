import { AlertCircle, Bell, Calendar, CheckCircle, Info, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useLocation } from 'react-router';
import { useAuth } from '../../../hooks/useAuth';
import { type Cita, useCitas } from '../../../hooks/useCitas';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

interface Message {
  id: string;
  type: 'reminder' | 'cancellation' | 'confirmation' | 'warning' | 'info';
  title: string;
  message: string;
  date: string;
}

type HistorialApi = {
  id: string;
  diagnostico?: string;
  descripcion?: string;
  created_at?: string;
  fecha?: string;
};

export default function Inbox() {
  const location = useLocation();
  const { user } = useAuth();
  const { useCitasPaciente, useCitasDoctor, useHistorialPaciente } = useCitas();

  const currentUser = user || JSON.parse(localStorage.getItem('currentUser') || '{}');
  const rawRole = String(currentUser.role || '').toLowerCase();

  const normalizeRole = (value: string): 'patient' | 'doctor' | 'admin' | '' => {
    if (value === 'patient' || value === 'paciente') return 'patient';
    if (value === 'doctor' || value === 'medico' || value === 'médico') return 'doctor';
    if (value === 'admin' || value === 'administrador') return 'admin';
    return '';
  };

  const roleFromPath: 'patient' | 'doctor' | 'admin' | '' = location.pathname.startsWith('/patient')
    ? 'patient'
    : location.pathname.startsWith('/doctor')
      ? 'doctor'
      : location.pathname.startsWith('/admin')
        ? 'admin'
        : '';

  const role = roleFromPath || normalizeRole(rawRole) || 'patient';

  const patientId = role === 'patient' ? String(currentUser.id || '') : '';
  const doctorId = role === 'doctor' ? String(currentUser.id || '') : '';

  const { data: patientAppointments } = useCitasPaciente(patientId);
  const { data: doctorAppointments } = useCitasDoctor(doctorId);
  const { data: historial } = useHistorialPaciente(patientId);

  const [readMessageIds, setReadMessageIds] = useState<string[]>([]);

  const formatDateLabel = (date: string) => {
    if (!date) return 'fecha no disponible';
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const [year, month, day] = date.split('-').map(Number);
      return new Date(year, month - 1, day).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    }
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const appointmentsForInbox: Cita[] =
    role === 'doctor' ? doctorAppointments || [] : patientAppointments || [];

  const appointmentMessages: Message[] = appointmentsForInbox.map((appointment) => {
    const dateIso = `${appointment.date}T${appointment.time}:00`;

    if (appointment.status === 'cancelled') {
      return {
        id: `cita-${appointment.id}`,
        type: 'cancellation',
        title: 'Cita Cancelada',
        message: `La cita de ${appointment.specialty} del ${formatDateLabel(appointment.date)} a las ${appointment.time} fue cancelada.`,
        date: dateIso,
      };
    }

    if (appointment.status === 'confirmed') {
      return {
        id: `cita-${appointment.id}`,
        type: 'confirmation',
        title: 'Cita Confirmada',
        message: `Tienes una cita confirmada de ${appointment.specialty} el ${formatDateLabel(appointment.date)} a las ${appointment.time}.`,
        date: dateIso,
      };
    }

    if (appointment.status === 'absent') {
      return {
        id: `cita-${appointment.id}`,
        type: 'warning',
        title: 'Registro de Ausencia',
        message: `La cita de ${appointment.specialty} del ${formatDateLabel(appointment.date)} fue marcada como ausente.`,
        date: dateIso,
      };
    }

    return {
      id: `cita-${appointment.id}`,
      type: 'reminder',
      title: 'Recordatorio de Cita',
      message: `Tienes una cita de ${appointment.specialty} el ${formatDateLabel(appointment.date)} a las ${appointment.time}.`,
      date: dateIso,
    };
  });

  const historialMessages: Message[] =
    role === 'patient'
      ? ((historial || []) as HistorialApi[]).map((entry) => ({
          id: `hist-${entry.id}`,
          type: 'info',
          title: 'Actualizacion de Historial',
          message: `Se registro un nuevo diagnostico: ${entry.diagnostico || 'Sin diagnostico'}.`,
          date: entry.created_at || entry.fecha || new Date().toISOString(),
        }))
      : [];

  const messages = useMemo(
    () =>
      [...appointmentMessages, ...historialMessages].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    [appointmentMessages, historialMessages],
  );

  const isRead = (id: string) => readMessageIds.includes(id);

  const handleMarkAsRead = (id: string) => {
    if (isRead(id)) return;
    setReadMessageIds((prev) => [...prev, id]);
  };

  const handleMarkAllAsRead = () => {
    setReadMessageIds(messages.map((m) => m.id));
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'reminder':
        return <Bell className="w-5 h-5 text-blue-600" />;
      case 'confirmation':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'cancellation':
        return <X className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-gray-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getMessageColor = (type: string) => {
    switch (type) {
      case 'reminder':
        return 'border-l-blue-600 bg-blue-50';
      case 'confirmation':
        return 'border-l-green-600 bg-green-50';
      case 'cancellation':
        return 'border-l-red-600 bg-red-50';
      case 'warning':
        return 'border-l-orange-600 bg-orange-50';
      case 'info':
        return 'border-l-gray-600 bg-gray-50';
      default:
        return 'border-l-gray-400 bg-gray-50';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Hace unos minutos';
    } else if (diffInHours < 24) {
      return `Hace ${Math.floor(diffInHours)} horas`;
    } else if (diffInHours < 48) {
      return 'Hace 1 día';
    } else {
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    }
  };

  const unreadMessages = messages.filter((m) => !isRead(m.id));
  const readMessages = messages.filter((m) => isRead(m.id));

  const MessageCard = ({ message }: { message: Message }) => (
    <Card
      className={`border-l-4 ${getMessageColor(message.type)} ${!isRead(message.id) ? 'shadow-md' : ''}`}
      onClick={() => !isRead(message.id) && handleMarkAsRead(message.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-1">{getMessageIcon(message.type)}</div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-1">
              <h3
                className={`font-semibold ${!isRead(message.id) ? 'text-gray-900' : 'text-gray-700'}`}
              >
                {message.title}
              </h3>
              {!isRead(message.id) && (
                <Badge variant="default" className="ml-2">
                  Nueva
                </Badge>
              )}
            </div>
            <p
              className={`text-sm mb-2 ${!isRead(message.id) ? 'text-gray-700' : 'text-gray-600'}`}
            >
              {message.message}
            </p>
            <p className="text-xs text-gray-500">{formatDate(message.date)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bandeja de Entrada</h2>
          <p className="text-gray-600">Notificaciones y mensajes del sistema</p>
        </div>
        {unreadMessages.length > 0 && (
          <Button onClick={handleMarkAllAsRead} variant="outline">
            Marcar todas como leídas
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">No Leídos</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{unreadMessages.length}</p>
              </div>
              <Bell className="w-10 h-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Mensajes</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{messages.length}</p>
              </div>
              <Calendar className="w-10 h-10 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="unread" className="w-full">
        <TabsList>
          <TabsTrigger value="unread">No Leídos ({unreadMessages.length})</TabsTrigger>
          <TabsTrigger value="all">Todos ({messages.length})</TabsTrigger>
          <TabsTrigger value="read">Leídos ({readMessages.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="unread" className="space-y-4 mt-6">
          {unreadMessages.length > 0 ? (
            unreadMessages.map((message) => <MessageCard key={message.id} message={message} />)
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">¡Todo al día!</h3>
                <p className="text-gray-600 text-sm">No tienes mensajes sin leer</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4 mt-6">
          {messages.length > 0 ? (
            messages.map((message) => <MessageCard key={message.id} message={message} />)
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Sin notificaciones</h3>
                <p className="text-gray-600 text-sm">Aun no hay mensajes para mostrar</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="read" className="space-y-4 mt-6">
          {readMessages.length > 0 ? (
            readMessages.map((message) => <MessageCard key={message.id} message={message} />)
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Sin mensajes leídos</h3>
                <p className="text-gray-600 text-sm">
                  Aquí aparecerán los mensajes que hayas leído
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
