import axios from 'axios';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Download,
  Eye,
  FileText,
  Lock,
  User,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { useAuth } from '../../../hooks/useAuth';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

export default function PatientHistoryView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isConsultationActive, setIsConsultationActive] = useState(true);
  const [motivo, setMotivo] = useState('');
  const [diagnostico, setDiagnostico] = useState('');
  const [tratamiento, setTratamiento] = useState('');
  const [severidad, setSeveridad] = useState('MEDIA');
  const [isSaving, setIsSaving] = useState(false);

  // Simulated JWT access control
  const hasActiveAccess = isConsultationActive;
  const accessExpiresAt = '10:30 hrs';

  const handleFinishConsultation = () => {
    toast.success('Consulta finalizada correctamente');
    setIsConsultationActive(false);
    setTimeout(() => {
      navigate('/doctor');
    }, 1500);
  };

  const handleGuardarConsulta = async () => {
    if (!diagnostico) {
      toast.error('El diagnóstico es obligatorio mínimo 3 letras');
      return;
    }

    try {
      setIsSaving(true);
      const token = localStorage.getItem('token');

      const payloadHistorial = {
        paciente_id: String(id), // ID del paciente mandado en la ruta
        diagnostico: diagnostico,
        severidad: severidad,
        medico_encargado: user?.name || 'Dr. Médico',
        descripcion: motivo,
        tratamiento: tratamiento,
      };

      await axios.post('http://localhost:3002/api/historial', payloadHistorial, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      toast.success('Consulta y diagnóstico guardados en el historial del paciente');
      handleFinishConsultation();
    } catch (error) {
      console.error(error);
      toast.error('Ocurrió un error al guardar el historial en el servidor');
    } finally {
      setIsSaving(false);
    }
  };

  const patientInfo = {
    name: 'María López Sánchez',
    ci: '23456789',
    age: 45,
    bloodType: 'O+',
    allergies: 'Penicilina',
    phone: '70123456',
    email: 'maria.lopez@email.com',
  };

  const medicalRecords = [
    {
      id: 1,
      type: 'consultation',
      title: 'Consulta Cardiológica',
      date: '2025-12-15',
      doctor: 'Dr. Carlos Mendoza',
      diagnosis: 'Hipertensión arterial leve',
      notes: 'Control de presión arterial. Se recomienda dieta baja en sodio y ejercicio regular.',
    },
    {
      id: 2,
      type: 'study',
      title: 'Electrocardiograma',
      date: '2025-12-15',
      doctor: 'Dr. Carlos Mendoza',
      diagnosis: 'Ritmo sinusal normal',
      notes: 'Estudio complementario sin alteraciones significativas.',
    },
    {
      id: 3,
      type: 'consultation',
      title: 'Medicina General',
      date: '2025-10-20',
      doctor: 'Dr. Juan Pérez',
      diagnosis: 'Gripe común',
      notes: 'Cuadro viral respiratorio. Tratamiento sintomático por 7 días.',
    },
  ];

  const currentMedications = [
    { name: 'Enalapril 10mg', dosage: '1 tableta cada 12 horas', duration: 'Continuo' },
    { name: 'Aspirina 100mg', dosage: '1 tableta al día', duration: 'Continuo' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/doctor')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Historial del Paciente</h2>
            <p className="text-gray-600">Acceso temporal durante la consulta</p>
          </div>
        </div>

        {hasActiveAccess && (
          <Button
            variant="default"
            className="bg-green-600 hover:bg-green-700"
            onClick={handleFinishConsultation}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Finalizar Consulta
          </Button>
        )}
      </div>

      {/* Access Control Alert */}
      {hasActiveAccess ? (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-green-800">Acceso Activo</p>
              <p className="text-sm text-green-700 mt-1">
                Tu token JWT es válido hasta las {accessExpiresAt}. El acceso se revocará
                automáticamente al finalizar la consulta.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Acceso Denegado:</strong> Solo puedes acceder al historial durante el horario de
            la cita.
          </AlertDescription>
        </Alert>
      )}

      {hasActiveAccess && (
        <>
          {/* Patient Info */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Paciente</CardTitle>
              <CardDescription>Datos personales y generales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nombre Completo</p>
                  <p className="font-medium text-gray-900">{patientInfo.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">CI</p>
                  <p className="font-medium text-gray-900">{patientInfo.ci}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Edad</p>
                  <p className="font-medium text-gray-900">{patientInfo.age} años</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tipo de Sangre</p>
                  <p className="font-medium text-gray-900">{patientInfo.bloodType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Alergias</p>
                  <p className="font-medium text-red-600">{patientInfo.allergies}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Teléfono</p>
                  <p className="font-medium text-gray-900">{patientInfo.phone}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{patientInfo.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for different sections */}
          <Tabs defaultValue="history" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="history">Historial Médico</TabsTrigger>
              <TabsTrigger value="medications">Medicamentos</TabsTrigger>
              <TabsTrigger value="current">Consulta Actual</TabsTrigger>
            </TabsList>

            <TabsContent value="history" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Historial Médico Completo</CardTitle>
                  <CardDescription>
                    Consultas, diagnósticos y estudios previos (PDF)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {medicalRecords.map((record) => (
                    <div key={record.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900">{record.title}</h4>
                            <Badge
                              variant={record.type === 'consultation' ? 'default' : 'secondary'}
                            >
                              {record.type === 'consultation' ? 'Consulta' : 'Estudio'}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {new Date(record.date).toLocaleDateString('es-ES', {
                                  day: '2-digit',
                                  month: 'long',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>{record.doctor}</span>
                            </div>
                          </div>
                        </div>
                        <FileText className="w-10 h-10 text-blue-600" />
                      </div>

                      <div className="space-y-2 mb-3">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Diagnóstico:</p>
                          <p className="text-sm text-gray-900">{record.diagnosis}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Notas:</p>
                          <p className="text-sm text-gray-600">{record.notes}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          Ver PDF
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Descargar
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="medications" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Medicamentos Actuales</CardTitle>
                  <CardDescription>Tratamientos en curso del paciente</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {currentMedications.map((med, index) => (
                    <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">{med.name}</h4>
                      <div className="space-y-1 text-sm text-gray-700">
                        <p>
                          <strong>Dosificación:</strong> {med.dosage}
                        </p>
                        <p>
                          <strong>Duración:</strong> {med.duration}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="current" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Consulta Actual</CardTitle>
                  <CardDescription>Registra el diagnóstico y tratamiento de hoy</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Importante:</strong> Solo puedes editar los datos de la consulta
                      actual. El historial médico previo es de solo lectura.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Motivo de Consulta
                      </label>
                      <textarea
                        className="w-full min-h-[80px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="Describe el motivo de la consulta..."
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Diagnóstico <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        className="w-full min-h-[80px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="Ingresa el diagnóstico..."
                        value={diagnostico}
                        onChange={(e) => setDiagnostico(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Severidad
                      </label>
                      <select
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        value={severidad}
                        onChange={(e) => setSeveridad(e.target.value)}
                      >
                        <option value="BAJA">Baja</option>
                        <option value="MEDIA">Media</option>
                        <option value="ALTA">Alta</option>
                        <option value="CRITICA">Crítica</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tratamiento/Indicaciones
                      </label>
                      <textarea
                        className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="Tratamiento prescrito, indicaciones, recomendaciones..."
                        value={tratamiento}
                        onChange={(e) => setTratamiento(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        className="flex-1"
                        onClick={handleGuardarConsulta}
                        disabled={isSaving}
                      >
                        {isSaving ? 'Guardando...' : 'Guardar Consulta'}
                      </Button>
                      <Button variant="outline" className="flex-1" disabled={isSaving}>
                        Guardar Borrador
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
