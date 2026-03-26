import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Button } from '../../components/ui/button';
import { Calendar } from '../../components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

export default function BookAppointment() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedClinic, setSelectedClinic] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState('');

  const specialties = [
    'Cardiología',
    'Dermatología',
    'Ginecología',
    'Medicina General',
    'Neurología',
    'Oftalmología',
    'Pediatría',
    'Traumatología',
  ];

  const clinics = [
    'Hospital Central',
    'Clínica del Sur',
    'Centro Médico Norte',
    'Hospital San Juan',
  ];

  const doctors = {
    Cardiología: ['Dr. Carlos Mendoza', 'Dra. Ana García'],
    Dermatología: ['Dr. Luis Rojas', 'Dra. María Torres'],
    Ginecología: ['Dra. Patricia Luna', 'Dra. Carmen Díaz'],
  };

  const availableTimes = [
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
  ];

  const handleNext = () => {
    if (step === 1 && !selectedSpecialty) {
      toast.error('Por favor selecciona una especialidad');
      return;
    }
    if (step === 2 && (!selectedClinic || !selectedDoctor)) {
      toast.error('Por favor selecciona una clínica y un médico');
      return;
    }
    if (step === 3 && (!selectedDate || !selectedTime)) {
      toast.error('Por favor selecciona una fecha y hora');
      return;
    }

    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleConfirm = () => {
    toast.success('Cita reservada exitosamente');
    setTimeout(() => navigate('/patient/my-appointments'), 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Reservar Nueva Cita</h2>
        <p className="text-gray-600">Sigue los pasos para agendar tu consulta médica</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {[1, 2, 3, 4].map((num) => (
          <div key={num} className="flex items-center flex-1">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                step >= num
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-gray-300 text-gray-400'
              }`}
            >
              {step > num ? <CheckCircle2 className="w-6 h-6" /> : num}
            </div>
            {num < 4 && (
              <div className={`flex-1 h-1 mx-2 ${step > num ? 'bg-blue-600' : 'bg-gray-300'}`} />
            )}
          </div>
        ))}
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Importante:</strong> Solo puedes reservar una cita por especialidad al día. La
          cancelación debe hacerse con al menos 3 horas de anticipación para evitar penalizaciones.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 && 'Paso 1: Selecciona la Especialidad'}
            {step === 2 && 'Paso 2: Selecciona Clínica y Médico'}
            {step === 3 && 'Paso 3: Selecciona Fecha y Hora'}
            {step === 4 && 'Paso 4: Confirma tu Cita'}
          </CardTitle>
          <CardDescription>
            {step === 1 && 'Elige la especialidad médica que necesitas'}
            {step === 2 && 'Selecciona dónde y con quién deseas atenderte'}
            {step === 3 && 'Elige el día y la hora de tu preferencia'}
            {step === 4 && 'Revisa y confirma los detalles de tu cita'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Specialty */}
          {step === 1 && (
            <div className="space-y-3">
              <Label>Especialidad Médica</Label>
              <div className="grid grid-cols-2 gap-3">
                {specialties.map((specialty) => (
                  <button
                    key={specialty}
                    onClick={() => setSelectedSpecialty(specialty)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedSpecialty === specialty
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-medium text-gray-900">{specialty}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Clinic and Doctor */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clinic">Clínica u Hospital</Label>
                <Select value={selectedClinic} onValueChange={setSelectedClinic}>
                  <SelectTrigger id="clinic">
                    <SelectValue placeholder="Selecciona una clínica" />
                  </SelectTrigger>
                  <SelectContent>
                    {clinics.map((clinic) => (
                      <SelectItem key={clinic} value={clinic}>
                        {clinic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctor">Médico</Label>
                <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                  <SelectTrigger id="doctor">
                    <SelectValue placeholder="Selecciona un médico" />
                  </SelectTrigger>
                  <SelectContent>
                    {(doctors[selectedSpecialty as keyof typeof doctors] || []).map((doctor) => (
                      <SelectItem key={doctor} value={doctor}>
                        {doctor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 3: Date and Time */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Fecha de la Cita</Label>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date < new Date('1900-01-01')}
                    className="rounded-md border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Hora Disponible</Label>
                <div className="grid grid-cols-5 gap-2">
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 px-3 rounded-md border text-sm transition-all ${
                        selectedTime === time
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Especialidad</p>
                    <p className="font-medium text-gray-900">{selectedSpecialty}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Clínica</p>
                    <p className="font-medium text-gray-900">{selectedClinic}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Médico</p>
                    <p className="font-medium text-gray-900">{selectedDoctor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fecha</p>
                    <p className="font-medium text-gray-900">
                      {selectedDate?.toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Hora</p>
                    <p className="font-medium text-gray-900">{selectedTime} hrs</p>
                  </div>
                </div>
              </div>

              <Alert>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  Recibirás notificaciones 24h y 12h antes de tu cita. El pago se realizará
                  directamente en la clínica.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-4">
            {step > 1 && (
              <Button variant="outline" onClick={handleBack} className="flex-1">
                Anterior
              </Button>
            )}
            {step < 4 ? (
              <Button onClick={handleNext} className="flex-1">
                Siguiente
              </Button>
            ) : (
              <Button onClick={handleConfirm} className="flex-1">
                Confirmar Cita
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
