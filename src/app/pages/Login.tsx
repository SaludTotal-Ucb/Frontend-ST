import { Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';
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

// Usuarios simulados para demo
const MOCK_USERS = [
  {
    id: '1',
    email: 'paciente@hospital.com',
    password: 'paciente123',
    role: 'patient',
    name: 'Ana García',
  },
  {
    id: '2',
    email: 'doctor@hospital.com',
    password: 'doctor123',
    role: 'doctor',
    name: 'Dr. Carlos Méndez',
  },
  {
    id: '3',
    email: 'admin@hospital.com',
    password: 'admin123',
    role: 'admin',
    name: 'Admin Sistema',
  },
];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    setLoading(true);

    // Simular verificación de usuario
    setTimeout(() => {
      const user = MOCK_USERS.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
      );

      if (user) {
        // Guardar para retrocompatibilidad temporal, aunque se usa AuthContext ahora
        localStorage.setItem('currentUser', JSON.stringify(user));

        // Log in via context
        login('fake-jwt-token', {
          id: user.id,
          name: user.name,
          role: user.role,
        });

        toast.success(`¡Bienvenido/a ${user.name}!`);

        setTimeout(() => {
          navigate(`/${user.role}`);
        }, 500);
      } else {
        toast.error('Error al iniciar sesión');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <Card className="shadow-lg border border-gray-200 bg-white">
      <CardHeader className="space-y-1 pb-6 pt-6">
        <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
        <CardDescription>Ingrese sus credenciales para acceder al sistema</CardDescription>
      </CardHeader>

      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Correo Electrónico
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="usuario@hospital.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 h-11"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 h-11"
                required
              />
            </div>
          </div>

          <div className="text-right">
            <Link
              to="/recover-password"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors"
            >
              ¿Olvidó su contraseña?
            </Link>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pt-2 pb-6">
          <Button
            type="submit"
            className="w-full h-11 bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>

          <p className="text-sm text-center text-gray-600">
            ¿No tiene cuenta?{' '}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors"
            >
              Regístrese aquí
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
