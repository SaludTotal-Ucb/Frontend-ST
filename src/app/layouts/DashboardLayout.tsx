import logo from 'figma:asset/ef6b1b356c372c4c3cd408e1518a34485f7432b6.png';
import {
  Bell,
  Building2,
  Calendar,
  ClipboardList,
  FileText,
  Home,
  Inbox,
  LogOut,
  Menu,
  Settings,
  Stethoscope,
  User,
  UserCircle,
  UserPlus,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

interface DashboardLayoutProps {
  role: 'patient' | 'doctor' | 'admin';
}

export default function DashboardLayout({ role }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount] = useState(3);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Obtener datos del usuario desde localStorage
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const userName = currentUser.name || 'Usuario Demo';

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const notifications = [
    {
      id: 1,
      title: 'Nueva cita confirmada',
      message: 'Tu cita para mañana ha sido confirmada',
      time: 'Hace 5 min',
      unread: true,
    },
    {
      id: 2,
      title: 'Recordatorio de cita',
      message: 'Tienes una cita en 24 horas',
      time: 'Hace 1 hora',
      unread: true,
    },
    {
      id: 3,
      title: 'Resultado disponible',
      message: 'Tu resultado de laboratorio está listo',
      time: 'Hace 3 horas',
      unread: true,
    },
    {
      id: 4,
      title: 'Mensaje del médico',
      message: 'Dr. García te ha enviado un mensaje',
      time: 'Ayer',
      unread: false,
    },
  ];

  const patientMenuItems = [
    { path: '/patient', icon: Home, label: 'Inicio' },
    {
      path: '/patient/book-appointment',
      icon: Calendar,
      label: 'Reservar Cita',
    },
    {
      path: '/patient/my-appointments',
      icon: ClipboardList,
      label: 'Mis Citas',
    },
    {
      path: '/patient/medical-history',
      icon: FileText,
      label: 'Historial Médico',
    },
    {
      path: '/patient/inbox',
      icon: Inbox,
      label: 'Bandeja de Entrada',
      badge: unreadCount,
    },
  ];

  const doctorMenuItems = [
    { path: '/doctor', icon: Home, label: 'Inicio' },
    { path: '/doctor/agenda', icon: Calendar, label: 'Mi Agenda' },
    {
      path: '/doctor/inbox',
      icon: Inbox,
      label: 'Bandeja de Entrada',
      badge: unreadCount,
    },
  ];

  const adminMenuItems = [
    { path: '/admin', icon: Home, label: 'Inicio' },
    {
      path: '/admin/register-clinic',
      icon: Building2,
      label: 'Registrar Clínica',
    },
    {
      path: '/admin/register-doctor',
      icon: Stethoscope,
      label: 'Registrar Médico',
    },
    {
      path: '/admin/register-patient',
      icon: UserPlus,
      label: 'Registrar Paciente',
    },
    {
      path: '/admin/inbox',
      icon: Inbox,
      label: 'Bandeja de Entrada',
      badge: unreadCount,
    },
  ];

  const menuItems =
    role === 'patient' ? patientMenuItems : role === 'doctor' ? doctorMenuItems : adminMenuItems;

  const roleNames = {
    patient: 'Paciente',
    doctor: 'Médico',
    admin: 'Administrador',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Logo and mobile menu */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>

              <div className="flex items-center gap-2">
                <img
                  src={logo}
                  alt="Sistema Hospitalario"
                  className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                />
                <div className="hidden sm:block">
                  <h1 className="font-bold text-gray-900 text-sm sm:text-base">
                    Sistema Hospitalario
                  </h1>
                  <p className="text-xs text-gray-500">{roleNames[role]}</p>
                </div>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowUserMenu(false);
                  }}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg border border-gray-200 py-2 max-h-[500px] overflow-y-auto">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">Notificaciones</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${notif.unread ? 'bg-blue-50/50' : ''}`}
                        >
                          <div className="flex gap-3">
                            {notif.unread && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {notif.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-0.5">{notif.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2 border-t border-gray-200">
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium w-full text-center">
                        Ver todas las notificaciones
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowNotifications(false);
                  }}
                  className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-2 py-1.5 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block max-w-[120px] truncate">
                    {userName}
                  </span>
                </button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{userName}</p>
                      <p className="text-xs text-gray-500">
                        {currentUser.email || 'demo@hospital.com'}
                      </p>
                    </div>
                    <Link
                      to={`/${role}/profile`}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <UserCircle className="w-4 h-4" />
                      Mi Perfil
                    </Link>
                    <Link
                      to={`/${role}/settings`}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Configuración
                    </Link>
                    <div className="border-t border-gray-200 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="p-4 h-full overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <Badge variant={isActive ? 'default' : 'secondary'} className="h-5 px-2">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <div className="lg:max-w-7xl lg:mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg border border-gray-200 p-4 sticky top-20">
              <ul className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="flex-1">{item.label}</span>
                        {item.badge && item.badge > 0 && (
                          <Badge variant={isActive ? 'default' : 'secondary'} className="h-5 px-2">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
