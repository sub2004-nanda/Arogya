
export interface Appointment {
  id: string;
  patientType: 'user' | 'family';
  patientName: string;
  familyMemberId?: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  appointmentDate: Date;
  department: string;
}

export interface FamilyMember {
    id: string;
    name: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    relationship: string;
}

    