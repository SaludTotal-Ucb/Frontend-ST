import { Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/api';
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

export const getFrontendRole = (userObj: {
  role?: string;
  rol?: string;
  roles?: string[];
}): 'patient' | 'doctor' | 'admin' => {
  const rawRole = userObj.role || userObj.rol || userObj.roles?.[0] || 'patient';

  const normalized = String(rawRole).toLowerCase();

  if (normalized === 'paciente' || normalized === 'patient') {
    return 'patient';
  }
  if (normalized === 'medico' || normalized === 'doctor') {
    return 'doctor';
  }
  if (normalized === 'admin') {
    return 'admin';
  }
  return 'patient';
};

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
      const response = await authService.login(email, password);

      if (!response.success) {
        throw new Error(response.message || 'Credenciales incorrectas');
      }

      const responseData = (response.data || response) as Record<string, unknown>;
      const token = (responseData.accessToken || responseData.token || 'real-jwt-token') as string;
      const refreshToken = responseData.refreshToken as string | undefined;
      const user = (responseData.user || responseData) as Record<string, unknown>;

      const userRole = getFrontendRole(user as { role?: string; rol?: string; roles?: string[] });
      const userName = (user.name || user.nombre || user.fullName || email.split('@')[0]) as string;
      const userId = (user.id || user.usuario_id || user.uid) as string;

      const userToSave = {
        id: userId,
        name: userName,
        role: userRole,
        email: user.email || email,
      };

      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      localStorage.setItem('currentUser', JSON.stringify(userToSave));
      login(token, userToSave);

      toast.success(`¡Bienvenido/a ${userName}!`);

      setTimeout(() => {
        navigate(`/${userRole}`);
      }, 500);
    } catch (error) {
      console.error('Login error:', error);
      toast.error(
        (error as { message?: string })?.message ||
          'Error al iniciar sesión. Revisa tus credenciales.',
      );
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
