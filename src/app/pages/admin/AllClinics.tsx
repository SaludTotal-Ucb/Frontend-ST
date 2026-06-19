import {
  ArrowLeft,
  Building2,
  Edit,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  Trash2,
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

interface ClinicRecord {
  id: string;
  nombre: string;
  ciudad: string;
  direccion: string;
  telefono: string | null;
  email: string | null;
  horario: string | null;
  descripcion: string | null;
  especialidades: string[];
}

export default function AllClinics() {
  const navigate = useNavigate();
  const [clinics, setClinics] = useState<ClinicRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editClinic, setEditClinic] = useState<ClinicRecord | null>(null);
  const [editForm, setEditForm] = useState({
    nombre: '',
    ciudad: '',
    direccion: '',
    telefono: '',
    email: '',
    horario: '',
    descripcion: '',
    especialidades: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        setLoading(true);
        const res = await adminService.getClinicas();
        const responseData = res as { data?: unknown };
        const list = Array.isArray(res)
          ? res
          : Array.isArray(responseData?.data)
            ? responseData.data
            : [];
        setClinics(list as ClinicRecord[]);
      } catch (error) {
        console.error('Error al obtener clínicas:', error);
        toast.error('Error al cargar clínicas');
      } finally {
        setLoading(false);
      }
    };
    fetchClinics();
  }, []);

  const openEdit = (clinic: ClinicRecord) => {
    setEditClinic(clinic);
    setEditForm({
      nombre: clinic.nombre,
      ciudad: clinic.ciudad,
      direccion: clinic.direccion,
      telefono: clinic.telefono || '',
      email: clinic.email || '',
      horario: clinic.horario || '',
      descripcion: clinic.descripcion || '',
      especialidades: clinic.especialidades ? clinic.especialidades.join(', ') : '',
    });
  };

  const handleSaveEdit = async () => {
    if (!editClinic) return;
    try {
      setSaving(true);
      const payload = {
        ...editForm,
        especialidades: editForm.especialidades
          ? editForm.especialidades
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      };
      await adminService.updateClinica(editClinic.id, payload);
      toast.success('Clínica actualizada correctamente');
      setClinics((prev) =>
        prev.map((c) =>
          c.id === editClinic.id
            ? { ...c, ...editForm, especialidades: payload.especialidades }
            : c,
        ),
      );
      setEditClinic(null);
    } catch (error) {
      toast.error('Error al actualizar la clínica');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, nombre: string) => {
    try {
      await adminService.deleteClinica(id);
      toast.success(`Clínica "${nombre}" eliminada correctamente`);
      setClinics((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      toast.error('Error al eliminar la clínica');
      console.error(error);
    }
  };

  const filteredClinics = clinics.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      (c.nombre || '').toLowerCase().includes(term) ||
      (c.ciudad || '').toLowerCase().includes(term) ||
      (c.direccion || '').toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500 animate-pulse">Cargando lista de clínicas...</p>
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
          <h2 className="text-2xl font-bold text-gray-900">Todas las Clínicas</h2>
          <p className="text-gray-600">Gestión de centros médicos registrados en el sistema</p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/admin/register-clinic')}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Registrar Clínica
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <Label htmlFor="search">Buscar Clínica</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Buscar por nombre, ciudad o dirección..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clinics List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredClinics.length > 0 ? (
          filteredClinics.map((clinic) => (
            <Card key={clinic.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg font-bold text-gray-900">
                      {clinic.nombre}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1.5 mt-1 font-medium text-purple-600">
                      <MapPin className="w-4 h-4" />
                      {clinic.ciudad}
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
                          onClick={() => openEdit(clinic)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Editar Clínica</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto pr-1">
                          <div className="space-y-1">
                            <Label>Nombre</Label>
                            <Input
                              value={editForm.nombre}
                              onChange={(e) =>
                                setEditForm((f) => ({ ...f, nombre: e.target.value }))
                              }
                            />
                          </div>
                          <div className="space-y-1">
                            <Label>Ciudad</Label>
                            <Input
                              value={editForm.ciudad}
                              onChange={(e) =>
                                setEditForm((f) => ({ ...f, ciudad: e.target.value }))
                              }
                            />
                          </div>
                          <div className="space-y-1">
                            <Label>Dirección</Label>
                            <Input
                              value={editForm.direccion}
                              onChange={(e) =>
                                setEditForm((f) => ({ ...f, direccion: e.target.value }))
                              }
                            />
                          </div>
                          <div className="space-y-1">
                            <Label>Teléfono</Label>
                            <Input
                              value={editForm.telefono}
                              onChange={(e) =>
                                setEditForm((f) => ({ ...f, telefono: e.target.value }))
                              }
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
                            <Label>Horario</Label>
                            <Input
                              value={editForm.horario}
                              onChange={(e) =>
                                setEditForm((f) => ({ ...f, horario: e.target.value }))
                              }
                            />
                          </div>
                          <div className="space-y-1">
                            <Label>Descripción</Label>
                            <Input
                              value={editForm.descripcion}
                              onChange={(e) =>
                                setEditForm((f) => ({ ...f, descripcion: e.target.value }))
                              }
                            />
                          </div>
                          <div className="space-y-1">
                            <Label>Especialidades (separadas por comas)</Label>
                            <Input
                              placeholder="Ej: Odontología, Pediatría"
                              value={editForm.especialidades}
                              onChange={(e) =>
                                setEditForm((f) => ({ ...f, especialidades: e.target.value }))
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
                          <AlertDialogTitle>¿Eliminar Clínica?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción eliminará permanentemente <strong>{clinic.nombre}</strong> y
                            todas sus especialidades asociadas. No se puede deshacer.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => handleDelete(clinic.id, clinic.nombre)}
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
                    <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                    {clinic.direccion}
                  </p>
                  {clinic.telefono && (
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {clinic.telefono}
                    </p>
                  )}
                  {clinic.email && (
                    <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {clinic.email}
                    </p>
                  )}
                  {clinic.horario && <p className="text-xs text-gray-500">🕐 {clinic.horario}</p>}
                </div>
                {clinic.especialidades && clinic.especialidades.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t">
                    {clinic.especialidades.map((esp) => (
                      <Badge key={esp} variant="secondary" className="text-xs">
                        {esp}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-1">No se encontraron clínicas</h3>
            <p className="text-gray-500 text-sm">Prueba ajustando los términos de búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
