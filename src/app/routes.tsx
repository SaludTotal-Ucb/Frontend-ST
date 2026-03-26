import { createBrowserRouter } from 'react-router';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import DoctorAgenda from './pages/doctor/DoctorAgenda';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import PatientHistoryView from './pages/doctor/PatientHistoryView';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import BookAppointment from './pages/patient/BookAppointment';
import PatientInbox from './pages/patient/Inbox';
import MedicalHistory from './pages/patient/MedicalHistory';
import MyAppointments from './pages/patient/MyAppointments';
import PatientDashboard from './pages/patient/PatientDashboard';
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
    children: [
      { index: true, Component: PatientDashboard },
      { path: 'book-appointment', Component: BookAppointment },
      { path: 'my-appointments', Component: MyAppointments },
      { path: 'medical-history', Component: MedicalHistory },
      { path: 'inbox', Component: PatientInbox },
    ],
  },
  {
    path: '/doctor',
    Component: DoctorLayout,
    children: [
      { index: true, Component: DoctorDashboard },
      { path: 'agenda', Component: DoctorAgenda },
      { path: 'patient-history/:id', Component: PatientHistoryView },
    ],
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
