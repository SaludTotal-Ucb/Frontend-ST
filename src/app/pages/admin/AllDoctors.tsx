import { ArrowLeft, Building2, Mail, Phone, Search, Stethoscope } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { adminService } from '../../../services/api';
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

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const res = await adminService.getDoctores();
        setDoctors((res || []) as DoctorRecord[]);
      } catch (error) {
        console.error('Error al obtener médicos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doc) => {
    const term = searchTerm.toLowerCase();
    return (
      doc.name.toLowerCase().includes(term) ||
      doc.especialidad.toLowerCase().includes(term) ||
      doc.clinicaNombre.toLowerCase().includes(term) ||
      doc.ci.includes(term)
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
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Todos los Médicos</h2>
          <p className="text-gray-600">Gestión de profesionales médicos en el sistema</p>
        </div>
      </div>

      {/* Search Filter */}
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
                  <Building2 className="w-8 h-8 text-gray-400 flex-shrink-0" />
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
    </div>
  );
}
