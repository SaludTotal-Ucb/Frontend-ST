import { createBrowserRouter } from 'react-router';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AllAppointments from './pages/admin/AllAppointments';
import RegisterClinic from './pages/admin/RegisterClinic';
import RegisterDoctor from './pages/admin/RegisterDoctor';
import RegisterPatient from './pages/admin/RegisterPatient';
import DoctorAgenda from './pages/doctor/DoctorAgenda';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import PatientHistoryView from './pages/doctor/PatientHistoryView';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import BookAppointment from './pages/patient/BookAppointment';
import Inbox from './pages/patient/Inbox';
import MedicalHistory from './pages/patient/MedicalHistory';
import MyAppointments from './pages/patient/MyAppointments';
import PatientDashboard from './pages/patient/PatientDashboard';
import RecoverPassword from './pages/RecoverPassword';
import Register from './pages/Register';
import Profile from './pages/shared/Profile';

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
    element: <DashboardLayout role="patient" />,
    children: [
      { index: true, Component: PatientDashboard },
      { path: 'book-appointment', Component: BookAppointment },
      { path: 'my-appointments', Component: MyAppointments },
      { path: 'medical-history', Component: MedicalHistory },
      { path: 'inbox', Component: Inbox },
      { path: 'profile', element: <Profile role="patient" /> },
    ],
  },
  {
    path: '/doctor',
    element: <DashboardLayout role="doctor" />,
    children: [
      { index: true, Component: DoctorDashboard },
      { path: 'agenda', Component: DoctorAgenda },
      { path: 'patient-history/:id', Component: PatientHistoryView },
      { path: 'inbox', Component: Inbox },
      { path: 'profile', element: <Profile role="doctor" /> },
    ],
  },
  {
    path: '/admin',
    element: <DashboardLayout role="admin" />,
    children: [
      { index: true, Component: AdminDashboard },
      { path: 'register-clinic', Component: RegisterClinic },
      { path: 'register-doctor', Component: RegisterDoctor },
      { path: 'register-patient', Component: RegisterPatient },
      { path: 'all-appointments', Component: AllAppointments },
      { path: 'inbox', Component: Inbox },
      { path: 'profile', element: <Profile role="admin" /> },
    ],
  },
  {
    path: '*',
    Component: NotFound,
  },
]);
