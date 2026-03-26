import { ArrowLeft, Info } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '../../components/ui/alert';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

export default function RegisterPatient() {
  const navigate = useNavigate();
  const [isMinor, setIsMinor] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    ci: '',
    birthDate: '',
    gender: '',
    bloodType: '',
    email: '',
    phone: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    // For minors
    parentName: '',
    parentCI: '',
    parentPhone: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Check if is minor based on birth date
    if (field === 'birthDate' && value) {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      setIsMinor(age < 18);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (isMinor && (!formData.parentName || !formData.parentCI)) {
      toast.error('Debes completar la información del tutor para pacientes menores de edad');
      return;
    }

    toast.success('Paciente registrado exitosamente');
    setTimeout(() => navigate('/admin'), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Registrar Nuevo Paciente</h2>
          <p className="text-gray-600">Registro desde la clínica (incluye infantes)</p>
        </div>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Nota:</strong> Para pacientes menores de 18 años, es obligatorio registrar la
          información del padre/madre o tutor legal.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Datos del Paciente</CardTitle>
            <CardDescription>Información personal del paciente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre Completo *</Label>
                <Input
                  id="fullName"
                  placeholder="Juan Pérez García"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ci">Carnet de Identidad (CI) *</Label>
                <Input
                  id="ci"
                  placeholder="12345678"
                  value={formData.ci}
                  onChange={(e) => handleChange('ci', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">Fecha de Nacimiento *</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleChange('birthDate', e.target.value)}
                  required
                />
                {isMinor && (
                  <p className="text-xs text-orange-600 font-medium">
                    ⚠ Paciente menor de edad - Se requiere información del tutor
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Género *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleChange('gender', value)}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Selecciona el género" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="female">Femenino</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloodType">Tipo de Sangre</Label>
                <Select
                  value={formData.bloodType}
                  onValueChange={(value) => handleChange('bloodType', value)}
                >
                  <SelectTrigger id="bloodType">
                    <SelectValue placeholder="Selecciona tipo de sangre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="70123456"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="paciente@email.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  placeholder="Av. Principal #123"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Contacto de Emergencia</Label>
                <Input
                  id="emergencyContact"
                  placeholder="Nombre del contacto"
                  value={formData.emergencyContact}
                  onChange={(e) => handleChange('emergencyContact', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Teléfono de Emergencia</Label>
                <Input
                  id="emergencyPhone"
                  type="tel"
                  placeholder="70123456"
                  value={formData.emergencyPhone}
                  onChange={(e) => handleChange('emergencyPhone', e.target.value)}
                />
              </div>
            </div>

            {isMinor && (
              <>
                <div className="pt-6 border-t">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Información del Tutor Legal
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="parentName">Nombre del Padre/Madre/Tutor *</Label>
                      <Input
                        id="parentName"
                        placeholder="María García"
                        value={formData.parentName}
                        onChange={(e) => handleChange('parentName', e.target.value)}
                        required={isMinor}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="parentCI">CI del Tutor *</Label>
                      <Input
                        id="parentCI"
                        placeholder="98765432"
                        value={formData.parentCI}
                        onChange={(e) => handleChange('parentCI', e.target.value)}
                        required={isMinor}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="parentPhone">Teléfono del Tutor *</Label>
                      <Input
                        id="parentPhone"
                        type="tel"
                        placeholder="70987654"
                        value={formData.parentPhone}
                        onChange={(e) => handleChange('parentPhone', e.target.value)}
                        required={isMinor}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="pt-6 border-t">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Credenciales de Acceso</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin')}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                Registrar Paciente
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
