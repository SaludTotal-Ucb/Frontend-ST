import { Outlet } from 'react-router';
import logo from '../../assets/ef6b1b356c372c4c3cd408e1518a34485f7432b6.png';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        {/* Left side - Branding (visible on desktop, top on mobile) */}
        <div className="text-center lg:text-left space-y-6">
          <div className="w-full max-w-[120px] mx-auto lg:mx-0">
            <img src={logo} alt="Salud Total Logo" className="w-full h-auto" />
          </div>
          <div className="space-y-3">
            <h1 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
              Sistema Hospitalario
            </h1>
            <p className="text-base lg:text-lg text-blue-100">Portal de Gestión Médica</p>
          </div>

          <div className="pt-80">
            <p className="text-blue-100 mb-3 text-base">Acceso seguro para:</p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-2">
              <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-white/30 hover:bg-white/30 transition-colors">
                Pacientes
              </span>
              <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-white/30 hover:bg-white/30 transition-colors">
                Médicos
              </span>
              <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-white/30 hover:bg-white/30 transition-colors">
                Administradores
              </span>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
