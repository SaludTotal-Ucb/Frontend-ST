import {
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  Edit,
  Filter,
  Plus,
  Search,
  Stethoscope,
  Trash2,
  User,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { adminService } from '../../../services/api';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
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
  id: string;
  patient: string;
  patientCI: string;
  doctor: string;
  specialty: string;
  clinic: string;
  date: string;
  time: string;
  status: string;
  notas?: string;
}

interface ClinicRecord {
  id: string;
  nombre: string;
}

export default function AllAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clinics, setClinics] = useState<ClinicRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDate, setFilterDate] = useState('');
  const [filterClinic, setFilterClinic] = useState<string>('all');

  // Edit state
  const [editApt, setEditApt] = useState<Appointment | null>(null);
  const [editForm, setEditForm] = useState({ estado: '', fecha: '', notas: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [aptsRes, clinicsRes] = await Promise.all([
          adminService.getAllAppointments(),
          adminService.getClinicas(),
        ]);
        const aptsData = aptsRes as { data?: unknown };
        const aptsList = Array.isArray(aptsRes)
          ? aptsRes
          : Array.isArray(aptsData?.data)
            ? aptsData.data
            : [];
        const clinicsData = clinicsRes as { data?: unknown };
        const clinicsList = Array.isArray(clinicsRes)
          ? clinicsRes
          : Array.isArray(clinicsData?.data)
            ? clinicsData.data
            : [];
        setAppointments(aptsList as Appointment[]);
        setClinics(clinicsList as ClinicRecord[]);
      } catch (error) {
        console.error(error);
        toast.error('Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const openEdit = (apt: Appointment) => {
    setEditApt(apt);
    // Rebuild datetime string for input
    const dateStr = apt.date && apt.time ? `${apt.date}T${apt.time}` : apt.date || '';
    setEditForm({ estado: apt.status, fecha: dateStr, notas: apt.notas || '' });
  };

  const handleSaveEdit = async () => {
    if (!editApt) return;
    try {
      setSaving(true);
      await adminService.updateCita(editApt.id, editForm);
      toast.success('Cita actualizada correctamente');
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === editApt.id ? { ...a, status: editForm.estado, notas: editForm.notas } : a,
        ),
      );
      setEditApt(null);
    } catch (error) {
      toast.error('Error al actualizar la cita');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminService.deleteCita(id);
      toast.success('Cita eliminada correctamente');
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      toast.error('Error al eliminar la cita');
      console.error(error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'confirmada':
        return <Badge className="bg-green-600">Confirmada</Badge>;
      case 'completed':
      case 'completada':
        return <Badge className="bg-blue-600">Completada</Badge>;
      case 'cancelled':
      case 'cancelada':
        return <Badge variant="destructive">Cancelada</Badge>;
      case 'no-show':
      case 'absent':
      case 'ausente':
        return <Badge className="bg-orange-600">No asistió</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      (apt.patient || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (apt.patientCI || '').includes(searchTerm) ||
      (apt.doctor || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || apt.status === filterStatus;
    const matchesDate = !filterDate || apt.date === filterDate;
    const matchesClinic = filterClinic === 'all' || apt.clinic === filterClinic;

    return matchesSearch && matchesStatus && matchesDate && matchesClinic;
  });

  const stats = {
    total: filteredAppointments.length,
    confirmed: filteredAppointments.filter(
      (a) => a.status === 'confirmed' || a.status === 'confirmada',
    ).length,
    completed: filteredAppointments.filter(
      (a) => a.status === 'completed' || a.status === 'completada',
    ).length,
    cancelled: filteredAppointments.filter(
      (a) => a.status === 'cancelled' || a.status === 'cancelada',
    ).length,
    noShow: filteredAppointments.filter((a) => ['no-show', 'absent', 'ausente'].includes(a.status))
      .length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500 animate-pulse">Cargando citas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">Todas las Citas</h2>
          <p className="text-gray-600">Gestión completa de citas del sistema</p>
        </div>
        <Button onClick={() => navigate('/admin/create-appointment')} className="gap-2">
          <Plus className="w-4 h-4" />
          Nueva Cita
        </Button>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <Label htmlFor="clinic">Clínica / Hospital</Label>
              <Select value={filterClinic} onValueChange={setFilterClinic}>
                <SelectTrigger id="clinic">
                  <SelectValue placeholder="Todas las clínicas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {clinics.map((c) => (
                    <SelectItem key={c.id} value={c.nombre}>
                      {c.nombre}
                    </SelectItem>
                  ))}
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

          {(searchTerm || filterStatus !== 'all' || filterDate || filterClinic !== 'all') && (
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                  setFilterDate('');
                  setFilterClinic('all');
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

                    <div className="flex gap-1.5">
                      {/* Edit */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 text-blue-600 border-blue-200 hover:bg-blue-50"
                            onClick={() => openEdit(apt)}
                          >
                            <Edit className="w-3.5 h-3.5" />
                            Editar
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Editar Cita</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-2">
                            <div className="space-y-1">
                              <Label>Estado</Label>
                              <Select
                                value={editForm.estado}
                                onValueChange={(v) => setEditForm((f) => ({ ...f, estado: v }))}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="confirmed">Confirmada</SelectItem>
                                  <SelectItem value="completed">Completada</SelectItem>
                                  <SelectItem value="cancelled">Cancelada</SelectItem>
                                  <SelectItem value="no-show">No asistió</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-1">
                              <Label>Fecha y Hora</Label>
                              <Input
                                type="datetime-local"
                                value={editForm.fecha}
                                onChange={(e) =>
                                  setEditForm((f) => ({ ...f, fecha: e.target.value }))
                                }
                              />
                            </div>
                            <div className="space-y-1">
                              <Label>Notas</Label>
                              <Input
                                value={editForm.notas}
                                onChange={(e) =>
                                  setEditForm((f) => ({ ...f, notas: e.target.value }))
                                }
                                placeholder="Observaciones opcionales..."
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Cancelar</Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button onClick={handleSaveEdit} disabled={saving}>
                                {saving ? 'Guardando...' : 'Guardar Cambios'}
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      {/* Delete */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Eliminar
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar Cita?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción eliminará la cita de <strong>{apt.patient}</strong> con{' '}
                              <strong>{apt.doctor}</strong> del {apt.date}. No se puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => handleDelete(apt.id)}
                            >
                              Sí, eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
