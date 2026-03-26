import { AlertCircle, Bell, Calendar, CheckCircle, Info, X } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

interface Message {
  id: number;
  type: 'reminder' | 'cancellation' | 'confirmation' | 'warning' | 'info';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export default function Inbox() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'reminder',
      title: 'Recordatorio de Cita',
      message:
        'Tu cita con Dr. Carlos Mendoza (Cardiología) es mañana 15/03/2026 a las 10:00 hrs en Hospital Central.',
      date: '2026-03-14T14:00:00',
      read: false,
    },
    {
      id: 2,
      type: 'confirmation',
      title: 'Cita Confirmada',
      message:
        'Tu cita con Dra. María Torres (Dermatología) ha sido confirmada para el 20/03/2026 a las 14:30 hrs.',
      date: '2026-03-13T09:30:00',
      read: false,
    },
    {
      id: 3,
      type: 'warning',
      title: 'Actualiza tu Información',
      message:
        'Por favor actualiza tu información de contacto para recibir notificaciones importantes.',
      date: '2026-03-11T10:00:00',
      read: false,
    },
    {
      id: 4,
      type: 'reminder',
      title: 'Recordatorio de Cita - 24h',
      message: 'Recordatorio: Tu cita con Dr. Carlos Mendoza es en 24 horas. No olvides asistir.',
      date: '2026-03-10T10:00:00',
      read: true,
    },
    {
      id: 5,
      type: 'cancellation',
      title: 'Cita Cancelada por la Clínica',
      message:
        'La clínica ha cancelado tu cita del 05/03/2026. No se aplicó penalización. Por favor, reagenda cuando gustes.',
      date: '2026-03-05T15:00:00',
      read: true,
    },
    {
      id: 6,
      type: 'info',
      title: 'Bienvenido al Sistema',
      message:
        'Tu cuenta ha sido creada exitosamente. Ahora puedes reservar citas médicas y acceder a tu historial.',
      date: '2026-02-01T08:00:00',
      read: true,
    },
  ]);

  const handleMarkAsRead = (id: number) => {
    setMessages(messages.map((m) => (m.id === id ? { ...m, read: true } : m)));
  };

  const handleMarkAllAsRead = () => {
    setMessages(messages.map((m) => ({ ...m, read: true })));
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

  const unreadMessages = messages.filter((m) => !m.read);
  const readMessages = messages.filter((m) => m.read);

  const MessageCard = ({ message }: { message: Message }) => (
    <Card
      className={`border-l-4 ${getMessageColor(message.type)} ${!message.read ? 'shadow-md' : ''}`}
      onClick={() => !message.read && handleMarkAsRead(message.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-1">{getMessageIcon(message.type)}</div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-1">
              <h3 className={`font-semibold ${!message.read ? 'text-gray-900' : 'text-gray-700'}`}>
                {message.title}
              </h3>
              {!message.read && (
                <Badge variant="default" className="ml-2">
                  Nueva
                </Badge>
              )}
            </div>
            <p className={`text-sm mb-2 ${!message.read ? 'text-gray-700' : 'text-gray-600'}`}>
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
          {messages.map((message) => (
            <MessageCard key={message.id} message={message} />
          ))}
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
