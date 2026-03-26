import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
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

export default function RegisterDoctor() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    ci: '',
    email: '',
    phone: '',
    specialty: '',
    licenseNumber: '',
    clinic: '',
    schedule: '',
    password: '',
    confirmPassword: '',
  });

  const specialties = [
    'Cardiología',
    'Dermatología',
    'Ginecología',
    'Medicina General',
    'Neurología',
    'Oftalmología',
    'Pediatría',
    'Traumatología',
  ];

  const clinics = [
    'Hospital Central',
    'Clínica del Sur',
    'Centro Médico Norte',
    'Hospital San Juan',
  ];

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

    toast.success('Médico registrado exitosamente');
    setTimeout(() => navigate('/admin'), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Registrar Nuevo Médico</h2>
          <p className="text-gray-600">Completa la información del profesional de salud</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Datos del Médico</CardTitle>
            <CardDescription>Información personal y profesional</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre Completo *</Label>
                <Input
                  id="fullName"
                  placeholder="Dr. Juan Pérez García"
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
                <Label htmlFor="email">Correo Electrónico *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="doctor@email.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                />
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
                <Label htmlFor="specialty">Especialidad *</Label>
                <Select
                  value={formData.specialty}
                  onValueChange={(value) => handleChange('specialty', value)}
                >
                  <SelectTrigger id="specialty">
                    <SelectValue placeholder="Selecciona una especialidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseNumber">Número de Licencia Médica *</Label>
                <Input
                  id="licenseNumber"
                  placeholder="LM-12345"
                  value={formData.licenseNumber}
                  onChange={(e) => handleChange('licenseNumber', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinic">Clínica Asignada *</Label>
                <Select
                  value={formData.clinic}
                  onValueChange={(value) => handleChange('clinic', value)}
                >
                  <SelectTrigger id="clinic">
                    <SelectValue placeholder="Selecciona una clínica" />
                  </SelectTrigger>
                  <SelectContent>
                    {clinics.map((clinic) => (
                      <SelectItem key={clinic} value={clinic}>
                        {clinic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="schedule">Horario de Atención *</Label>
                <Input
                  id="schedule"
                  placeholder="Lunes a Viernes 9:00-17:00"
                  value={formData.schedule}
                  onChange={(e) => handleChange('schedule', e.target.value)}
                  required
                />
              </div>

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
                Registrar Médico
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
