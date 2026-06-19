import { Calendar, Edit, Save, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useCitas } from '../../../hooks/useCitas';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

interface ProfileProps {
  role: 'patient' | 'doctor' | 'admin';
}

export default function Profile({ role }: ProfileProps) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const patientId = currentUser.id || '';

  const { usePerfilPaciente, useHistorialPaciente, actualizarPerfilMutation } = useCitas();

  // Queries reactivas
  const { data: realPerfil, isLoading: isLoadingPerfil } = usePerfilPaciente(
    role === 'patient' ? patientId : '',
  );
  const { data: realHistorial } = useHistorialPaciente(role === 'patient' ? patientId : '');

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    birthDate: '',
    gender: '',
    bloodType: '',
    emergencyContact: '',
    address: '',
    allergies: '',
  });

  // Inicializar el formulario cuando cargue el perfil real
  useEffect(() => {
    if (realPerfil) {
      setFormData({
        name: realPerfil.name || '',
        phone: realPerfil.phone || '',
        birthDate: realPerfil.birthDate || '',
        gender: realPerfil.gender || '',
        bloodType: realPerfil.bloodType || '',
        emergencyContact: realPerfil.emergencyContact || '',
        address: realPerfil.address || '',
        allergies: realPerfil.allergies === 'Ninguna registrada' ? '' : realPerfil.allergies || '',
      });
    }
  }, [realPerfil]);

  // Datos simulados o de fallback para otros roles
  const profileData = {
    patient: {
      name: realPerfil?.name || currentUser.name || 'Ana García Pérez',
      email: realPerfil?.email || currentUser.email || 'paciente@hospital.com',
      ci: realPerfil?.ci || '12345678',
      phone: realPerfil?.phone || '70123456',
      birthDate: realPerfil?.birthDate || '15/05/1990',
      gender: realPerfil?.gender || 'Femenino',
      bloodType: realPerfil?.bloodType || 'O+',
      address: realPerfil?.address || 'Av. 6 de Agosto #1234, La Paz',
      emergencyContact: realPerfil?.emergencyContact || 'Juan García - 71234567',
      allergies: realPerfil?.allergies || 'Ninguna registrada',
    },
    doctor: {
      name: currentUser.name || 'Dr. Carlos Méndez',
      email: currentUser.email || 'doctor@hospital.com',
      ci: '87654321',
      phone: '71234567',
      specialty: 'Cardiología',
      license: 'MED-12345',
      experience: '15 años',
      education: 'Universidad Mayor de San Andrés - 2010',
      schedule: 'Lunes a Viernes, 8:00 - 16:00',
    },
    admin: {
      name: currentUser.name || 'Admin Sistema',
      email: currentUser.email || 'admin@hospital.com',
      ci: '11223344',
      phone: '72345678',
      department: 'Administración',
      position: 'Administrador del Sistema',
      accessLevel: 'Total',
    },
  };

  const data = profileData[role as keyof typeof profileData] as Record<string, unknown>;

  const handleStartEdit = () => {
    if (realPerfil) {
      setFormData({
        name: realPerfil.name || '',
        phone: realPerfil.phone || '',
        birthDate: realPerfil.birthDate || '',
        gender: realPerfil.gender || '',
        bloodType: realPerfil.bloodType || '',
        emergencyContact: realPerfil.emergencyContact || '',
        address: realPerfil.address || '',
        allergies: realPerfil.allergies === 'Ninguna registrada' ? '' : realPerfil.allergies || '',
      });
    } else {
      // Si no hay perfil cargado, usar el mock
      setFormData({
        name: data.name,
        phone: data.phone,
        birthDate: data.birthDate,
        gender: data.gender,
        bloodType: data.bloodType,
        emergencyContact: data.emergencyContact,
        address: data.address,
        allergies: data.allergies || '',
      });
    }
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!formData.name) {
      toast.error('El nombre completo es obligatorio.');
      return;
    }

    actualizarPerfilMutation.mutate(formData, {
      onSuccess: () => {
        toast.success('Perfil actualizado correctamente.');
        setIsEditing(false);
      },
      onError: (error) => {
        console.error(error);
        toast.error('Ocurrió un error al guardar los cambios en el servidor.');
      },
    });
  };

  interface HistorialItem {
    fecha?: string;
    created_at?: string;
    medico_encargado?: string;
    diagnostico?: string;
    tratamiento?: string;
  }

  const mapHistorialToRecords = (items: HistorialItem[]): Record<string, unknown>[] => {
    const mapped: Record<string, unknown>[] = [];
    for (const item of items || []) {
      const dateValue = item.fecha || item.created_at || '';
      mapped.push({
        date: dateValue ? new Date(dateValue).toLocaleDateString('es-ES') : 'Sin fecha',
        doctor: item.medico_encargado || 'Médico no especificado',
        specialty: 'Consulta General',
        diagnosis: item.diagnostico || 'Consulta Médica',
        treatment: item.tratamiento || 'Sin tratamiento registrado',
      });
    }
    return mapped;
  };

  const medicalHistory = realHistorial
    ? mapHistorialToRecords(realHistorial as HistorialItem[])
    : [];

  if (role === 'patient' && isLoadingPerfil) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500 animate-pulse">Cargando perfil del paciente...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
          <p className="text-gray-600 mt-1">Información personal y configuración</p>
        </div>
        {role === 'patient' && (
          <div className="flex gap-2 w-full sm:w-auto">
            {isEditing ? (
              <>
                <Button
                  onClick={handleSave}
                  className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="flex-1 sm:flex-none"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </>
            ) : (
              <Button onClick={handleStartEdit} className="w-full sm:w-auto">
                <Edit className="w-4 h-4 mr-2" />
                Editar Perfil
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Información Personal */}
      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-blue-600" />
              </div>
              <Button variant="outline" size="sm">
                Cambiar Foto
              </Button>
            </div>

            {/* Datos */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="prof-name" className="text-sm font-medium text-gray-500">
                  Nombre Completo
                </Label>
                {isEditing ? (
                  <Input
                    id="prof-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1"
                  />
                ) : (
                  <p className="text-gray-900 mt-1">{data.name}</p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Carnet de Identidad</Label>
                <p className="text-gray-900 mt-1">{data.ci}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Correo Electrónico</Label>
                <p className="text-gray-900 mt-1">{data.email}</p>
              </div>
              <div>
                <Label htmlFor="prof-phone" className="text-sm font-medium text-gray-500">
                  Teléfono
                </Label>
                {isEditing ? (
                  <Input
                    id="prof-phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1"
                  />
                ) : (
                  <p className="text-gray-900 mt-1">{data.phone}</p>
                )}
              </div>

              {role === 'patient' && (
                <>
                  <div>
                    <Label htmlFor="prof-birthDate" className="text-sm font-medium text-gray-500">
                      Fecha de Nacimiento
                    </Label>
                    {isEditing ? (
                      <Input
                        id="prof-birthDate"
                        value={formData.birthDate}
                        onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                        placeholder="DD/MM/AAAA"
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-gray-900 mt-1">{data.birthDate}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="prof-gender" className="text-sm font-medium text-gray-500">
                      Género
                    </Label>
                    {isEditing ? (
                      <select
                        id="prof-gender"
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      >
                        <option value="Femenino">Femenino</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Otro">Otro</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 mt-1">{data.gender}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="prof-bloodType" className="text-sm font-medium text-gray-500">
                      Tipo de Sangre
                    </Label>
                    {isEditing ? (
                      <Input
                        id="prof-bloodType"
                        value={formData.bloodType}
                        onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                        className="mt-1 w-24"
                      />
                    ) : (
                      <div className="mt-1">
                        <Badge variant="outline">{data.bloodType}</Badge>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="prof-allergies" className="text-sm font-medium text-gray-500">
                      Alergias
                    </Label>
                    {isEditing ? (
                      <Input
                        id="prof-allergies"
                        value={formData.allergies}
                        onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                        className="mt-1"
                        placeholder="Ej: Penicilina, Nueces"
                      />
                    ) : (
                      <p className="text-gray-900 mt-1">{data.allergies}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="prof-emergency" className="text-sm font-medium text-gray-500">
                      Contacto de Emergencia
                    </Label>
                    {isEditing ? (
                      <Input
                        id="prof-emergency"
                        value={formData.emergencyContact}
                        onChange={(e) =>
                          setFormData({ ...formData, emergencyContact: e.target.value })
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-gray-900 mt-1">{data.emergencyContact}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="prof-address" className="text-sm font-medium text-gray-500">
                      Dirección
                    </Label>
                    {isEditing ? (
                      <Input
                        id="prof-address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-gray-900 mt-1">{data.address}</p>
                    )}
                  </div>
                </>
              )}

              {role === 'doctor' && (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Especialidad</label>
                    <p className="text-gray-900 mt-1">{data.specialty}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Licencia Médica</label>
                    <p className="text-gray-900 mt-1">{data.license}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Experiencia</label>
                    <p className="text-gray-900 mt-1">{data.experience}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Formación</label>
                    <p className="text-gray-900 mt-1">{data.education}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-gray-500">Horario de Atención</label>
                    <p className="text-gray-900 mt-1">{data.schedule}</p>
                  </div>
                </>
              )}

              {role === 'admin' && (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Departamento</label>
                    <p className="text-gray-900 mt-1">{data.department}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Cargo</label>
                    <p className="text-gray-900 mt-1">{data.position}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nivel de Acceso</label>
                    <div className="mt-1">
                      <Badge>{data.accessLevel}</Badge>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Historial Médico - Solo para pacientes */}
      {role === 'patient' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Historial Médico Reciente</CardTitle>
              <Button variant="outline" size="sm">
                Ver Todo
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {medicalHistory.length === 0 ? (
                <p className="text-sm text-gray-500 py-4 text-center">
                  Aún no hay registros en tu historial clínico.
                </p>
              ) : (
                medicalHistory.slice(0, 3).map((record: Record<string, string>, index: number) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">{record.date}</span>
                        </div>
                        <p className="font-medium text-gray-900">{record.diagnosis}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {record.doctor} - {record.specialty}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          <strong>Tratamiento:</strong> {record.treatment}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Configuración de Seguridad */}
      <Card>
        <CardHeader>
          <CardTitle>Seguridad</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="font-medium text-gray-900">Contraseña</p>
              <p className="text-sm text-gray-500">Última actualización: Hace 2 meses</p>
            </div>
            <Button variant="outline" size="sm">
              Cambiar Contraseña
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t">
            <div>
              <p className="font-medium text-gray-900">Verificación en dos pasos</p>
              <p className="text-sm text-gray-500">Agrega una capa extra de seguridad</p>
            </div>
            <Button variant="outline" size="sm">
              Activar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
