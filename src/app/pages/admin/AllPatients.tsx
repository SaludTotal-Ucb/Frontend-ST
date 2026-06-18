import { ArrowLeft, Calendar, CreditCard, Mail, Phone, Search, User } from 'lucide-react';
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

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const res = await adminService.getPacientes();
        setPatients((res || []) as PatientRecord[]);
      } catch (error) {
        console.error('Error al obtener pacientes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((pat) => {
    const term = searchTerm.toLowerCase();
    return (
      pat.name.toLowerCase().includes(term) ||
      pat.email.toLowerCase().includes(term) ||
      pat.ci.includes(term) ||
      pat.phone.includes(term)
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
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Todos los Pacientes</h2>
          <p className="text-gray-600">Gestión de pacientes registrados en el sistema</p>
        </div>
      </div>

      {/* Search Filter */}
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
                      CI: {pat.ci}
                    </CardDescription>
                  </div>
                  <User className="w-8 h-8 text-gray-400 flex-shrink-0" />
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
                    <strong>Teléfono:</strong> {pat.phone}
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <strong>Fecha de Registro:</strong>{' '}
                    {new Date(pat.createdAt).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
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
