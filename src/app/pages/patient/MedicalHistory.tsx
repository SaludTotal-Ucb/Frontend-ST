import { Calendar, Download, Eye, FileText, User } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { useCitas } from '../../../hooks/useCitas';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

interface MedicalRecord {
  id: string;
  type: 'consultation' | 'study' | 'prescription';
  title: string;
  doctor: string;
  specialty: string;
  date: string;
  clinic: string;
  description: string;
}

type HistorialApi = {
  id: string;
  diagnostico?: string;
  descripcion?: string;
  tratamiento?: string;
  medico_encargado?: string;
  fecha?: string;
  created_at?: string;
  recetas?: Array<{
    medicamento?: string;
    dosis?: string;
    frecuencia?: string;
    indicaciones?: string;
  }>;
};

export default function MedicalHistory() {
  const { user } = useAuth();
  const patientId = user?.id ?? '';
  const { useHistorialPaciente } = useCitas();
  const { data: historial, isLoading, isError } = useHistorialPaciente(patientId);

  const formatLocalDate = (isoDate: string) => {
    if (!isoDate) return 'Fecha no disponible';
    if (/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
      const [year, month, day] = isoDate.split('-').map(Number);
      return new Date(year, month - 1, day).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    }

    return new Date(isoDate).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const mapHistorialToRecords = (items: HistorialApi[]): MedicalRecord[] => {
    const mapped: MedicalRecord[] = [];

    for (const item of items || []) {
      const dateValue = item.fecha || item.created_at || '';
      const consultationDescription = [item.descripcion, item.tratamiento]
        .filter(Boolean)
        .join(' ')
        .trim();

      mapped.push({
        id: item.id,
        type: 'consultation',
        title: item.diagnostico || 'Consulta Medica',
        doctor: item.medico_encargado || 'Medico no especificado',
        specialty: 'Consulta General',
        date: dateValue,
        clinic: 'Centro de Salud',
        description: consultationDescription || 'Sin detalles registrados.',
      });

      (item.recetas || []).forEach((receta, index) => {
        const detalle = [
          receta.dosis ? `Dosis: ${receta.dosis}` : '',
          receta.frecuencia ? `Frecuencia: ${receta.frecuencia}` : '',
          receta.indicaciones ? `Indicaciones: ${receta.indicaciones}` : '',
        ]
          .filter(Boolean)
          .join(' | ');

        mapped.push({
          id: `${item.id}-rx-${index}`,
          type: 'prescription',
          title: `Receta: ${receta.medicamento || 'Medicamento'}`,
          doctor: item.medico_encargado || 'Medico no especificado',
          specialty: 'Receta Medica',
          date: dateValue,
          clinic: 'Centro de Salud',
          description: detalle || 'Sin detalles de receta.',
        });
      });
    }

    return mapped.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const records = mapHistorialToRecords((historial || []) as HistorialApi[]);

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
                    {formatLocalDate(record.date)} - {record.clinic}
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
          {!patientId ? (
            <Card>
              <CardContent className="p-8 text-center text-sm text-gray-600">
                Debes iniciar sesion para ver tu historial medico.
              </CardContent>
            </Card>
          ) : isLoading ? (
            <Card>
              <CardContent className="p-8 text-center text-sm text-gray-600">
                Cargando historial medico...
              </CardContent>
            </Card>
          ) : isError ? (
            <Card>
              <CardContent className="p-8 text-center text-sm text-red-600">
                No se pudo cargar el historial medico.
              </CardContent>
            </Card>
          ) : records.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-sm text-gray-600">
                Aun no tienes registros en tu historial medico.
              </CardContent>
            </Card>
          ) : (
            records.map((record) => <RecordCard key={record.id} record={record} />)
          )}
        </TabsContent>

        <TabsContent value="consultations" className="space-y-4 mt-6">
          {consultations.length > 0 ? (
            consultations.map((record) => <RecordCard key={record.id} record={record} />)
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-sm text-gray-600">
                No hay consultas registradas.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="studies" className="space-y-4 mt-6">
          {studies.length > 0 ? (
            studies.map((record) => <RecordCard key={record.id} record={record} />)
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-sm text-gray-600">
                No hay estudios registrados.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="prescriptions" className="space-y-4 mt-6">
          {prescriptions.length > 0 ? (
            prescriptions.map((record) => <RecordCard key={record.id} record={record} />)
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-sm text-gray-600">
                No hay recetas registradas.
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
