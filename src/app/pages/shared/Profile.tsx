import { Calendar, Edit, User } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

interface ProfileProps {
  role: 'patient' | 'doctor' | 'admin';
}

export default function Profile({ role }: ProfileProps) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  // Datos simulados del perfil
  const profileData = {
    patient: {
      name: currentUser.name || 'Ana García Pérez',
      email: currentUser.email || 'paciente@hospital.com',
      ci: '12345678',
      phone: '70123456',
      birthDate: '15/05/1990',
      gender: 'Femenino',
      bloodType: 'O+',
      address: 'Av. 6 de Agosto #1234, La Paz',
      emergencyContact: 'Juan García - 71234567',
      medicalHistory: [
        {
          date: '15/03/2026',
          doctor: 'Dr. Carlos Méndez',
          specialty: 'Cardiología',
          diagnosis: 'Hipertensión arterial controlada',
          treatment: 'Enalapril 10mg',
        },
        {
          date: '10/02/2026',
          doctor: 'Dra. María López',
          specialty: 'Medicina General',
          diagnosis: 'Gripe común',
          treatment: 'Paracetamol, reposo',
        },
        {
          date: '20/01/2026',
          doctor: 'Dr. Pedro Ramírez',
          specialty: 'Traumatología',
          diagnosis: 'Esguince leve tobillo derecho',
          treatment: 'Antiinflamatorios, fisioterapia',
        },
      ],
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

  // biome-ignore lint/suspicious/noExplicitAny: Temporary bypass for mock data types
  const data = profileData[role] as any;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
          <p className="text-gray-600 mt-1">Información personal y configuración</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Edit className="w-4 h-4 mr-2" />
          Editar Perfil
        </Button>
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
                <label className="text-sm font-medium text-gray-500">Nombre Completo</label>
                <p className="text-gray-900 mt-1">{data.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Carnet de Identidad</label>
                <p className="text-gray-900 mt-1">{data.ci}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Correo Electrónico</label>
                <p className="text-gray-900 mt-1">{data.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Teléfono</label>
                <p className="text-gray-900 mt-1">{data.phone}</p>
              </div>

              {role === 'patient' && (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Fecha de Nacimiento</label>
                    <p className="text-gray-900 mt-1">{data.birthDate}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Género</label>
                    <p className="text-gray-900 mt-1">{data.gender}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Tipo de Sangre</label>
                    <Badge variant="outline" className="mt-1">
                      {data.bloodType}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Contacto de Emergencia
                    </label>
                    <p className="text-gray-900 mt-1">{data.emergencyContact}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-gray-500">Dirección</label>
                    <p className="text-gray-900 mt-1">{data.address}</p>
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
                    <Badge className="mt-1">{data.accessLevel}</Badge>
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
              {data.medicalHistory?.map((record: Record<string, string>, index: number) => (
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
              ))}
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
