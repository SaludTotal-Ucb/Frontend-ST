import { Calendar, Download, Eye, FileText, User } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

interface MedicalRecord {
  id: number;
  type: 'consultation' | 'study' | 'prescription';
  title: string;
  doctor: string;
  specialty: string;
  date: string;
  clinic: string;
  description: string;
}

export default function MedicalHistory() {
  const records: MedicalRecord[] = [
    {
      id: 1,
      type: 'consultation',
      title: 'Consulta Cardiológica',
      doctor: 'Dr. Carlos Mendoza',
      specialty: 'Cardiología',
      date: '2026-02-10',
      clinic: 'Hospital Central',
      description: 'Control de presión arterial. Diagnóstico: Hipertensión leve controlada.',
    },
    {
      id: 2,
      type: 'study',
      title: 'Electrocardiograma',
      doctor: 'Dr. Carlos Mendoza',
      specialty: 'Cardiología',
      date: '2026-02-10',
      clinic: 'Hospital Central',
      description: 'Estudio complementario de función cardíaca.',
    },
    {
      id: 3,
      type: 'prescription',
      title: 'Receta Médica',
      doctor: 'Dr. Carlos Mendoza',
      specialty: 'Cardiología',
      date: '2026-02-10',
      clinic: 'Hospital Central',
      description: 'Enalapril 10mg - Tomar 1 tableta cada 12 horas por 30 días.',
    },
    {
      id: 4,
      type: 'consultation',
      title: 'Consulta Dermatológica',
      doctor: 'Dra. María Torres',
      specialty: 'Dermatología',
      date: '2026-01-15',
      clinic: 'Clínica del Sur',
      description: 'Evaluación de lesiones cutáneas. Diagnóstico: Dermatitis atópica.',
    },
    {
      id: 5,
      type: 'study',
      title: 'Análisis de Sangre Completo',
      doctor: 'Dr. Juan Pérez',
      specialty: 'Medicina General',
      date: '2025-12-20',
      clinic: 'Centro Médico Norte',
      description: 'Hemograma completo, perfil lipídico, glucosa.',
    },
  ];

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'consultation':
        return { label: 'Consulta', variant: 'default' as const };
      case 'study':
        return { label: 'Estudio', variant: 'secondary' as const };
      case 'prescription':
        return { label: 'Receta', variant: 'outline' as const };
      default:
        return { label: 'Otro', variant: 'outline' as const };
    }
  };

  const consultations = records.filter((r) => r.type === 'consultation');
  const studies = records.filter((r) => r.type === 'study');
  const prescriptions = records.filter((r) => r.type === 'prescription');

  const RecordCard = ({ record }: { record: MedicalRecord }) => {
    const typeInfo = getTypeLabel(record.type);

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-lg text-gray-900">{record.title}</h3>
                <Badge variant={typeInfo.variant}>{typeInfo.label}</Badge>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>
                    {record.doctor} - {record.specialty}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(record.date).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}{' '}
                    - {record.clinic}
                  </span>
                </div>
              </div>
            </div>
            <FileText className="w-10 h-10 text-blue-600" />
          </div>

          <p className="text-sm text-gray-700 mb-4 p-3 bg-gray-50 rounded-md">
            {record.description}
          </p>

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
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Historial Médico</h2>
        <p className="text-gray-600">Consulta todos tus registros médicos en formato PDF</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Consultas</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{consultations.length}</p>
              </div>
              <FileText className="w-10 h-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Estudios</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{studies.length}</p>
              </div>
              <FileText className="w-10 h-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Recetas</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{prescriptions.length}</p>
              </div>
              <FileText className="w-10 h-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Todos ({records.length})</TabsTrigger>
          <TabsTrigger value="consultations">Consultas ({consultations.length})</TabsTrigger>
          <TabsTrigger value="studies">Estudios ({studies.length})</TabsTrigger>
          <TabsTrigger value="prescriptions">Recetas ({prescriptions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {records.map((record) => (
            <RecordCard key={record.id} record={record} />
          ))}
        </TabsContent>

        <TabsContent value="consultations" className="space-y-4 mt-6">
          {consultations.map((record) => (
            <RecordCard key={record.id} record={record} />
          ))}
        </TabsContent>

        <TabsContent value="studies" className="space-y-4 mt-6">
          {studies.map((record) => (
            <RecordCard key={record.id} record={record} />
          ))}
        </TabsContent>

        <TabsContent value="prescriptions" className="space-y-4 mt-6">
          {prescriptions.map((record) => (
            <RecordCard key={record.id} record={record} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
