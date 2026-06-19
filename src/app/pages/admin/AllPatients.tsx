import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Edit,
  Mail,
  Phone,
  Plus,
  Search,
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

interface PatientRecord {
  id: string;
  name: string;
  ci: string;
  email: string;
  phone: string;
  createdAt: string;
}

export default function AllPatients() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editPatient, setEditPatient] = useState<PatientRecord | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', ci: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const res = await adminService.getPacientes();
        const responseData = res as { data?: unknown };
        const list = Array.isArray(res)
          ? res
          : Array.isArray(responseData?.data)
            ? responseData.data
            : [];
        setPatients(list as PatientRecord[]);
      } catch (error) {
        console.error('Error al obtener pacientes:', error);
        toast.error('Error al cargar pacientes');
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const openEdit = (pat: PatientRecord) => {
    setEditPatient(pat);
    setEditForm({ name: pat.name, email: pat.email, phone: pat.phone || '', ci: pat.ci || '' });
  };

  const handleSaveEdit = async () => {
    if (!editPatient) return;
    try {
      setSaving(true);
      await adminService.updatePaciente(editPatient.id, editForm);
      toast.success('Paciente actualizado correctamente');
      setPatients((prev) => prev.map((p) => (p.id === editPatient.id ? { ...p, ...editForm } : p)));
      setEditPatient(null);
    } catch (error) {
      toast.error('Error al actualizar el paciente');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await adminService.deletePaciente(id);
      toast.success(`Paciente "${name}" eliminado correctamente`);
      setPatients((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      toast.error('Error al eliminar el paciente');
      console.error(error);
    }
  };

  const filteredPatients = patients.filter((pat) => {
    const term = searchTerm.toLowerCase();
    return (
      (pat.name || '').toLowerCase().includes(term) ||
      (pat.email || '').toLowerCase().includes(term) ||
      (pat.ci || '').includes(term) ||
      (pat.phone || '').includes(term)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500 animate-pulse">Cargando lista de pacientes...</p>
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
          <h2 className="text-2xl font-bold text-gray-900">Todos los Pacientes</h2>
          <p className="text-gray-600">Gestión de pacientes registrados en el sistema</p>
        </div>
        <Button onClick={() => navigate('/admin/create-appointment')} className="gap-2">
          <Plus className="w-4 h-4" />
          Nueva Cita
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate('/admin/register-patient')}
          className="gap-2"
        >
          <User className="w-4 h-4" />
          Registrar Paciente
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <Label htmlFor="search">Buscar Paciente</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Buscar por nombre, CI, email o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patients List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPatients.length > 0 ? (
          filteredPatients.map((pat) => (
            <Card key={pat.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg font-bold text-gray-900">{pat.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1.5 mt-1 font-medium text-gray-500">
                      <CreditCard className="w-4 h-4" />
                      CI: {pat.ci || 'No registrado'}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    {/* Edit */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => openEdit(pat)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar Paciente</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                          <div className="space-y-1">
                            <Label>Nombre</Label>
                            <Input
                              value={editForm.name}
                              onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label>Email</Label>
                            <Input
                              type="email"
                              value={editForm.email}
                              onChange={(e) =>
                                setEditForm((f) => ({ ...f, email: e.target.value }))
                              }
                            />
                          </div>
                          <div className="space-y-1">
                            <Label>CI</Label>
                            <Input
                              value={editForm.ci}
                              onChange={(e) => setEditForm((f) => ({ ...f, ci: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label>Teléfono</Label>
                            <Input
                              value={editForm.phone}
                              onChange={(e) =>
                                setEditForm((f) => ({ ...f, phone: e.target.value }))
                              }
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
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar Paciente?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción eliminará permanentemente a <strong>{pat.name}</strong> y
                            todos sus datos del sistema. No se puede deshacer.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => handleDelete(pat.id, pat.name)}
                          >
                            Sí, eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-700">
                <div className="border-t pt-3 space-y-1.5">
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <strong>Email:</strong> {pat.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <strong>Teléfono:</strong> {pat.phone || 'No registrado'}
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <strong>Registro:</strong>{' '}
                    {pat.createdAt
                      ? new Date(pat.createdAt).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })
                      : 'No disponible'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-1">No se encontraron pacientes</h3>
            <p className="text-gray-500 text-sm">Prueba ajustando los términos de búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
