export interface Appointment {
  id: string;
  patientName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  appointmentDate: Date;
  department: string;
}
