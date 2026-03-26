import { createBrowserRouter } from 'react-router-dom';
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
import MedicalHistory from './pages/patient/MedicalHistory';
import MyAppointments from './pages/patient/MyAppointments';
import PatientDashboard from './pages/patient/PatientDashboard';
import RecoverPassword from './pages/RecoverPassword';
import Register from './pages/Register';
import Inbox from './pages/shared/Inbox';
import Profile from './pages/shared/Profile';

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
    Component: DoctorLayout,
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
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: 'register-clinic', Component: RegisterClinic },
      { path: 'register-doctor', Component: RegisterDoctor },
      { path: 'register-patient', Component: RegisterPatient },
      { path: 'appointments', Component: AllAppointments },
      { path: 'inbox', Component: Inbox },
      { path: 'profile', element: <Profile role="admin" /> },
    ],
  },
  {
    path: '*',
    Component: NotFound,
  },
]);
