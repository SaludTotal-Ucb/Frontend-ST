import { createBrowserRouter } from 'react-router';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import RecoverPassword from './pages/RecoverPassword';
import Register from './pages/Register';

const PatientLayout = () => <DashboardLayout role="patient" />;
const DoctorLayout = () => <DashboardLayout role="doctor" />;
const AdminLayout = () => <DashboardLayout role="admin" />;

export const router = createBrowserRouter([
  {
    path: '/',
    Component: AuthLayout,
    children: [
      { index: true, Component: Login },
      { path: 'register', Component: Register },
      { path: 'recover-password', Component: RecoverPassword },
    ],
  },
  {
    path: '/patient',
    Component: PatientLayout,
  },
  {
    path: '/doctor',
    Component: DoctorLayout,
  },
  {
    path: '/admin',
    Component: AdminLayout,
  },
  {
    path: '*',
    Component: NotFound,
  },
]);
