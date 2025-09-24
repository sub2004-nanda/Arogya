

export interface Appointment {
  id: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  appointmentDate: Date;
  type: 'in-person' | 'teleconsult';
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  reason: string;
}

export interface FamilyMember {
    id: string;
    name: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    relationship: string;
}

    
