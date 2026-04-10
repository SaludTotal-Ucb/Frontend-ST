import { CreditCard, Lock, Mail, Phone, User } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { API_URLS } from '../../config/api-config';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    ci: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validar Nombre Completo (solo letras y espacios, mín 3 caracteres)
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (formData.fullName.trim().length < 3 || !nameRegex.test(formData.fullName)) {
      toast.error('Ingrese un nombre válido (solo letras, mín. 3 caracteres)');
      return;
    }

    // 2. Validar Carnet de Identidad CI (alfanumérico, mín 5 caracteres)
    const ciRegex = /^[a-zA-Z0-9]+$/;
    if (formData.ci.trim().length < 5 || !ciRegex.test(formData.ci)) {
      toast.error(
        'Ingrese un Carnet de Identidad válido (mín. 5 caracteres alfanuméricos sin espacios)',
      );
      return;
    }

    // 3. Validar Correo Electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Ingrese un correo electrónico válido');
      return;
    }

    // 4. Validar Teléfono (solo números, permitiendo +, mín 7 u 8 dígitos)
    const phoneRegex = /^[0-9+]{8,}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Ingrese un número de teléfono válido (mínimo 8 dígitos numéricos)');
      return;
    }

    // 5. Validar Contraseñas
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      toast.error(
        'La contraseña debe tener al menos 8 caracteres, incluir letras, números y un carácter especial',
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      // Usando el endpoint de Auth desde nuestro servidor (puerto 3001)
      const response = await fetch(`${API_URLS.auth}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          ci: formData.ci, // Enviando CI por si el backend lo requiere
          phone: formData.phone, // Enviando teléfono por si el backend lo requiere
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar el usuario en el backend');
      }

      toast.success('Registro exitoso. Ahora puedes iniciar sesión');
      setTimeout(() => {
        setLoading(false);
        navigate('/');
      }, 1500);
    } catch (error: any) {
      console.error('Error al registrar:', error);
      toast.error(error.message || 'Error de conexión con el backend de Auth');
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-lg border border-gray-200 bg-white">
      <CardHeader className="space-y-1 pb-6 pt-6">
        <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
        <CardDescription>Complete el formulario para registrarse como paciente</CardDescription>
      </CardHeader>

      <form onSubmit={handleRegister}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
              Nombre Completo
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="fullName"
                placeholder="Juan Pérez García"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                className="pl-9 h-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ci" className="text-sm font-medium text-gray-700">
              Carnet de Identidad
            </Label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="ci"
                placeholder="12345678"
                value={formData.ci}
                onChange={(e) => handleChange('ci', e.target.value)}
                className="pl-9 h-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Correo Electrónico
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="pl-9 h-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Teléfono
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="phone"
                type="tel"
                placeholder="70123456"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="pl-9 h-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Contraseña
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className="pl-9 h-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              Confirmar Contraseña
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                className="pl-9 h-10"
                required
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pt-2 pb-6">
          <Button
            type="submit"
            className="w-full h-11 bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </Button>

          <p className="text-sm text-center text-gray-600">
            ¿Ya tiene cuenta?{' '}
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors"
            >
              Inicie sesión aquí
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
