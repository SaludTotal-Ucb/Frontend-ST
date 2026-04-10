import { Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { API_URLS } from '../../config/api-config';
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

    try {
      const response = await fetch(`${API_URLS.auth}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Credenciales incorrectas');
      }

      const token = data.token || data.session?.access_token || 'real-jwt-token';
      const user = data.user || data.data?.user || data;

      const userRole = user.role || user.rol || 'patient';
      const userName = user.name || user.nombre || user.fullName || email.split('@')[0];
      const userId = user.id || user.usuario_id || user.uid;

      const userToSave = {
        id: userId,
        name: userName,
        role: userRole,
        email: user.email || email,
      };

      localStorage.setItem('currentUser', JSON.stringify(userToSave));
      login(token, userToSave);

      toast.success('¡Bienvenido/a ' + userName + '!');

      setTimeout(() => {
        navigate('/' + userRole);
      }, 500);
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Error al iniciar sesión. Revisa tus credenciales.');
      setLoading(false);
    }
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
