import { ArrowLeft, CreditCard, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'sonner';
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

export default function RecoverPassword() {
  const [step, setStep] = useState<'email' | 'verify' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [ci, setCi] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success('Se ha enviado un enlace de recuperación a tu correo');
      setLoading(false);
      setStep('verify');
    }, 800);
  };

  const handleVerifyCI = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success('Identidad verificada correctamente');
      setLoading(false);
      setStep('reset');
    }, 800);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      toast.success('Contraseña actualizada exitosamente');
      setLoading(false);
      setStep('email');
      setEmail('');
      setCi('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1000);
  };

  return (
    <Card className="shadow-lg border border-gray-200 bg-white">
      <CardHeader className="space-y-1 pb-6 pt-6">
        <CardTitle className="text-2xl">Recuperar Contraseña</CardTitle>
        <CardDescription>
          {step === 'email' && 'Ingrese su correo electrónico registrado'}
          {step === 'verify' && 'Verifique su identidad con su CI'}
          {step === 'reset' && 'Cree una nueva contraseña segura'}
        </CardDescription>
      </CardHeader>

      {step === 'email' && (
        <form onSubmit={handleSendEmail}>
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
              <p className="text-xs text-gray-500 mt-1">
                Le enviaremos instrucciones para restablecer su contraseña
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-2 pb-6">
            <Button
              type="submit"
              className="w-full h-11 bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar Instrucciones'}
            </Button>
            <Link
              to="/"
              className="flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio de sesión
            </Link>
          </CardFooter>
        </form>
      )}

      {step === 'verify' && (
        <form onSubmit={handleVerifyCI}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ci" className="text-sm font-medium text-gray-700">
                Carnet de Identidad
              </Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="ci"
                  placeholder="12345678"
                  value={ci}
                  onChange={(e) => setCi(e.target.value)}
                  className="pl-9 h-11"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Ingrese su CI para verificar su identidad
              </p>
            </div>
          </CardContent>
          <CardFooter className="pb-6">
            <Button
              type="submit"
              className="w-full h-11 bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Verificando...' : 'Verificar Identidad'}
            </Button>
          </CardFooter>
        </form>
      )}

      {step === 'reset' && (
        <form onSubmit={handleResetPassword}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                Nueva Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-9 h-11"
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
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-9 h-11"
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="pb-6">
            <Button
              type="submit"
              className="w-full h-11 bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
            </Button>
          </CardFooter>
        </form>
      )}
    </Card>
  );
}
