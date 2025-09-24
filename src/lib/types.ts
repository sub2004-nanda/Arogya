

export interface Appointment {
  id: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  appointmentDate: Date;
  type: 'in-person' | 'teleconsult';
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Waiting';
  reason: string;
  patientType?: 'myself' | 'family';
  familyMemberId?: string;
  age?: number;
  gender?: string;
  department?: string;
  diagnosis?: string;
  doctorsNotes?: string;
  prescription?: string;
  testReports?: string;
  priority?: 'Routine' | 'High Risk' | 'Emergency';
}

export interface FamilyMember {
    id: string;
    name: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    relationship: string;
}

    
