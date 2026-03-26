import { Building2, Calendar, Clock, Filter, Search, Stethoscope, User } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
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

interface Appointment {
  id: number;
  patient: string;
  patientCI: string;
  doctor: string;
  specialty: string;
  clinic: string;
  date: string;
  time: string;
  status: 'confirmed' | 'completed' | 'cancelled' | 'no-show';
}

export default function AllAppointments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDate, setFilterDate] = useState('');

  const appointments: Appointment[] = [
    {
      id: 1,
      patient: 'Juan Pérez García',
      patientCI: '12345678',
      doctor: 'Dr. Carlos Méndez',
      specialty: 'Cardiología',
      clinic: 'Hospital Central',
      date: '2026-03-25',
      time: '09:00',
      status: 'confirmed',
    },
    {
      id: 2,
      patient: 'María López Sánchez',
      patientCI: '23456789',
      doctor: 'Dra. Ana Torres',
      specialty: 'Pediatría',
      clinic: 'Clínica San Juan',
      date: '2026-03-25',
      time: '10:00',
      status: 'confirmed',
    },
    {
      id: 3,
      patient: 'Carlos Rodríguez',
      patientCI: '34567890',
      doctor: 'Dr. Luis Ramírez',
      specialty: 'Traumatología',
      clinic: 'Hospital Central',
      date: '2026-03-25',
      time: '11:00',
      status: 'completed',
    },
    {
      id: 4,
      patient: 'Ana Martínez',
      patientCI: '45678901',
      doctor: 'Dr. Carlos Méndez',
      specialty: 'Cardiología',
      clinic: 'Hospital Central',
      date: '2026-03-24',
      time: '14:00',
      status: 'no-show',
    },
    {
      id: 5,
      patient: 'Luis Torres',
      patientCI: '56789012',
      doctor: 'Dra. Patricia Gómez',
      specialty: 'Ginecología',
      clinic: 'Clínica Santa Cruz',
      date: '2026-03-24',
      time: '09:30',
      status: 'completed',
    },
    {
      id: 6,
      patient: 'Patricia Sánchez',
      patientCI: '67890123',
      doctor: 'Dr. Miguel Flores',
      specialty: 'Dermatología',
      clinic: 'Hospital Central',
      date: '2026-03-23',
      time: '15:00',
      status: 'cancelled',
    },
    {
      id: 7,
      patient: 'Roberto González',
      patientCI: '78901234',
      doctor: 'Dr. Carlos Méndez',
      specialty: 'Cardiología',
      clinic: 'Hospital Central',
      date: '2026-03-26',
      time: '10:00',
      status: 'confirmed',
    },
    {
      id: 8,
      patient: 'Sofia Vargas',
      patientCI: '89012345',
      doctor: 'Dra. Ana Torres',
      specialty: 'Pediatría',
      clinic: 'Clínica San Juan',
      date: '2026-03-26',
      time: '11:30',
      status: 'confirmed',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-600">Confirmada</Badge>;
      case 'completed':
        return <Badge className="bg-blue-600">Completada</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelada</Badge>;
      case 'no-show':
        return <Badge className="bg-orange-600">No asistió</Badge>;
      default:
        return null;
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.patientCI.includes(searchTerm) ||
      apt.doctor.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || apt.status === filterStatus;
    const matchesDate = !filterDate || apt.date === filterDate;

    return matchesSearch && matchesStatus && matchesDate;
  });

  const stats = {
    total: appointments.length,
    confirmed: appointments.filter((a) => a.status === 'confirmed').length,
    completed: appointments.filter((a) => a.status === 'completed').length,
    cancelled: appointments.filter((a) => a.status === 'cancelled').length,
    noShow: appointments.filter((a) => a.status === 'no-show').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Todas las Citas</h2>
        <p className="text-gray-600">Gestión completa de citas del sistema</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Confirmadas</p>
            <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Completadas</p>
            <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Canceladas</p>
            <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">No asistió</p>
            <p className="text-2xl font-bold text-orange-600">{stats.noShow}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Paciente, CI o Médico..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="confirmed">Confirmadas</SelectItem>
                  <SelectItem value="completed">Completadas</SelectItem>
                  <SelectItem value="cancelled">Canceladas</SelectItem>
                  <SelectItem value="no-show">No asistió</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>
          </div>

          {(searchTerm || filterStatus !== 'all' || filterDate) && (
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                  setFilterDate('');
                }}
              >
                Limpiar Filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Appointments List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Citas</CardTitle>
          <CardDescription>
            Mostrando {filteredAppointments.length} de {appointments.length} citas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {new Date(apt.date).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                        <Clock className="w-4 h-4 text-gray-400 ml-2" />
                        <span className="text-gray-700">{apt.time} hrs</span>
                        {getStatusBadge(apt.status)}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">
                            <strong>Paciente:</strong> {apt.patient}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-700">
                            <strong>CI:</strong> {apt.patientCI}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Stethoscope className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">
                            {apt.doctor} - {apt.specialty}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 sm:col-span-2">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{apt.clinic}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">No se encontraron citas</h3>
                <p className="text-gray-600 text-sm">Intenta ajustar los filtros de búsqueda</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
