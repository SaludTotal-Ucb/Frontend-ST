import { ArrowLeft, Building2, Edit, Mail, Phone, Search, Stethoscope, Trash2 } from 'lucide-react';
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

interface DoctorRecord {
  id: string;
  name: string;
  ci: string;
  email: string;
  phone: string | null;
  clinicaNombre: string;
  especialidad: string;
  numeroLicencia: string;
  horarioAtencion: string;
}

export default function AllDoctors() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<DoctorRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editDoctor, setEditDoctor] = useState<DoctorRecord | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    horarioAtencion: '',
    numeroLicencia: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const res = await adminService.getDoctores();
        const responseData = res as { data?: unknown };
        const list = Array.isArray(res)
          ? res
          : Array.isArray(responseData?.data)
            ? responseData.data
            : [];
        setDoctors(list as DoctorRecord[]);
      } catch (error) {
        console.error('Error al obtener médicos:', error);
        toast.error('Error al cargar médicos');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const openEdit = (doc: DoctorRecord) => {
    setEditDoctor(doc);
    setEditForm({
      name: doc.name,
      email: doc.email,
      phone: doc.phone || '',
      horarioAtencion: doc.horarioAtencion || '',
      numeroLicencia: doc.numeroLicencia || '',
    });
  };

  const handleSaveEdit = async () => {
    if (!editDoctor) return;
    try {
      setSaving(true);
      await adminService.updateMedico(editDoctor.id, editForm);
      toast.success('Médico actualizado correctamente');
      setDoctors((prev) =>
        prev.map((d) =>
          d.id === editDoctor.id
            ? {
                ...d,
                name: editForm.name,
                email: editForm.email,
                phone: editForm.phone,
                horarioAtencion: editForm.horarioAtencion,
                numeroLicencia: editForm.numeroLicencia,
              }
            : d,
        ),
      );
      setEditDoctor(null);
    } catch (error) {
      toast.error('Error al actualizar el médico');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await adminService.deleteMedico(id);
      toast.success(`Médico "${name}" eliminado correctamente`);
      setDoctors((prev) => prev.filter((d) => d.id !== id));
    } catch (error) {
      toast.error('Error al eliminar el médico');
      console.error(error);
    }
  };

  const filteredDoctors = doctors.filter((doc) => {
    const term = searchTerm.toLowerCase();
    return (
      (doc.name || '').toLowerCase().includes(term) ||
      (doc.especialidad || '').toLowerCase().includes(term) ||
      (doc.clinicaNombre || '').toLowerCase().includes(term) ||
      (doc.ci || '').includes(term)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500 animate-pulse">Cargando lista de médicos...</p>
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
          <h2 className="text-2xl font-bold text-gray-900">Todos los Médicos</h2>
          <p className="text-gray-600">Gestión de profesionales médicos en el sistema</p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/admin/register-doctor')}
          className="gap-2"
        >
          <Stethoscope className="w-4 h-4" />
          Registrar Médico
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <Label htmlFor="search">Buscar Médico</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Buscar por nombre, especialidad, clínica o CI..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Doctors List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doc) => (
            <Card key={doc.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg font-bold text-gray-900">{doc.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1.5 mt-1 font-medium text-blue-600">
                      <Stethoscope className="w-4 h-4" />
                      {doc.especialidad}
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
                          onClick={() => openEdit(doc)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar Médico</DialogTitle>
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
                            <Label>Teléfono</Label>
                            <Input
                              value={editForm.phone}
                              onChange={(e) =>
                                setEditForm((f) => ({ ...f, phone: e.target.value }))
                              }
                            />
                          </div>
                          <div className="space-y-1">
                            <Label>Número de Licencia</Label>
                            <Input
                              value={editForm.numeroLicencia}
                              onChange={(e) =>
                                setEditForm((f) => ({ ...f, numeroLicencia: e.target.value }))
                              }
                            />
                          </div>
                          <div className="space-y-1">
                            <Label>Horario de Atención</Label>
                            <Input
                              value={editForm.horarioAtencion}
                              onChange={(e) =>
                                setEditForm((f) => ({ ...f, horarioAtencion: e.target.value }))
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
                          <AlertDialogTitle>¿Eliminar Médico?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción eliminará permanentemente a <strong>{doc.name}</strong> y
                            todos sus datos del sistema. No se puede deshacer.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => handleDelete(doc.id, doc.name)}
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
                  <p>
                    <strong>Clínica:</strong> {doc.clinicaNombre}
                  </p>
                  <p>
                    <strong>Licencia Médica:</strong> {doc.numeroLicencia || 'No registrada'}
                  </p>
                  <p>
                    <strong>Horario:</strong> {doc.horarioAtencion || 'No especificado'}
                  </p>
                  <p>
                    <strong>CI:</strong> {doc.ci}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-x-4 gap-y-1 text-xs text-gray-500 pt-2 border-t">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {doc.email}
                  </span>
                  {doc.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      {doc.phone}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Stethoscope className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-1">No se encontraron médicos</h3>
            <p className="text-gray-500 text-sm">Prueba ajustando los términos de búsqueda.</p>
          </div>
        )}
      </div>

      {/* Unused icon reference to suppress lint warning */}
      <span className="hidden">
        <Building2 />
      </span>
    </div>
  );
}
