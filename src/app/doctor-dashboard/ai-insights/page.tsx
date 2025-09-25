
'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { getPatientRiskSummary } from '@/lib/actions';
import { AlertCircle, Bot, Activity, Loader2, ArrowLeft } from 'lucide-react';
import type { Appointment } from '@/lib/types';
import { format } from 'date-fns';

// Mock patient data and their medical histories
const mockPatients = [
  { id: 'PAT-EMG-001', name: 'Sunita Sharma' },
  { id: 'PAT-HR-002', name: 'Rajesh Kumar' },
  { id: 'PAT-REG-003', name: 'Anita Verma' },
];

const getMockMedicalHistories = (): { [key: string]: Partial<Appointment>[] } => ({
  'PAT-EMG-001': [
    {
      diagnosis: 'Acute Myocardial Infarction',
      doctorsNotes: 'Patient presented with severe chest pain. ECG confirmed STEMI. Sent for immediate PCI.',
      prescription: 'Aspirin, Clopidogrel, Atorvastatin',
      appointmentDate: new Date('2024-05-10'),
    },
    {
      diagnosis: 'Hypertension',
      doctorsNotes: 'Follow-up for blood pressure management. BP currently 150/95. Medication adjusted.',
      prescription: 'Amlodipine 10mg, Losartan 50mg',
      appointmentDate: new Date('2024-03-20'),
    },
  ],
  'PAT-HR-002': [
    {
      diagnosis: 'Uncontrolled Diabetes Mellitus',
      doctorsNotes: 'HbA1c at 9.5%. Counseled on diet and exercise. Insulin regimen started.',
      prescription: 'Metformin 1000mg, Glimepiride 4mg, Lantus 10 units',
      appointmentDate: new Date('2024-06-01'),
    },
     {
      diagnosis: 'High Blood Pressure',
      doctorsNotes: 'Patient self-reported a reading of 180/120 at home. Advised to monitor closely and started on medication.',
      prescription: 'Lisinopril 20mg',
      appointmentDate: new Date('2024-05-15'),
    },
  ],
  'PAT-REG-003': [
      {
      diagnosis: 'Seasonal Allergies',
      doctorsNotes: 'Patient complains of sneezing and itchy eyes. Consistent with seasonal allergies.',
      prescription: 'Cetirizine 10mg daily as needed.',
      appointmentDate: new Date('2024-04-22'),
    },
  ]
});

interface SummaryResult {
  summary?: string;
  riskHighlights?: string[];
  error?: string;
}

export default function AiInsightsPage() {
  const { toast } = useToast();
  const [selectedPatient, setSelectedPatient] = useState('');
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleAnalyze = () => {
    if (!selectedPatient) {
      toast({
        variant: 'destructive',
        title: 'No Patient Selected',
        description: 'Please select a patient to analyze their health records.',
      });
      return;
    }

    const mockMedicalHistories = getMockMedicalHistories();
    const patientHistory = mockMedicalHistories[selectedPatient]?.map(record => ({
        ...record,
        date: format(new Date(record.appointmentDate!), 'yyyy-MM-dd'),
        diagnosis: record.diagnosis || '',
        doctorsNotes: record.doctorsNotes || '',
        prescription: record.prescription || ''
    })) || [];
    
    const patient = mockPatients.find(p => p.id === selectedPatient);

    if (!patient || patientHistory.length === 0) {
        toast({
            title: 'No Records Found',
            description: `No medical history available for ${patient?.name || 'the selected patient'}.`,
        });
        return;
    }

    startTransition(async () => {
      setResult(null);
      const response = await getPatientRiskSummary({ patientName: patient.name, medicalHistory: patientHistory });
      setResult(response);
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-primary/5">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6">
                <Button asChild variant="outline">
                    <Link href="/doctor-dashboard">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </Button>
            </div>
            <div className="text-center mb-10">
              <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
                AI Patient Insights
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Get an AI-generated summary and risk analysis of a patient's health history.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Select Patient</CardTitle>
                <CardDescription>
                  Choose a patient to generate their health summary and risk highlights.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row gap-4">
                <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                  <SelectTrigger className="w-full sm:w-[280px]">
                    <SelectValue placeholder="Select a patient..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPatients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAnalyze} disabled={isPending || !selectedPatient} className="w-full sm:w-auto">
                    {isPending ? (
                        <>
                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                         Analyzing...
                        </>
                    ) : (
                         "Analyze Patient Records"
                    )}
                </Button>
              </CardContent>
            </Card>

            {isPending && (
                <Card className="mx-auto mt-6">
                    <CardHeader>
                        <Skeleton className="h-6 w-1/3" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <Skeleton className="h-5 w-1/4 mb-2" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                            </div>
                        </div>
                         <div>
                            <Skeleton className="h-5 w-1/4 mb-2" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {result && !isPending && (
              <div className="mx-auto mt-6">
                {result.error ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{result.error}</AlertDescription>
                  </Alert>
                ) : (
                  <Card>
                    <CardHeader>
                       <div className="flex items-center gap-2">
                        <Bot className="h-6 w-6 text-primary" />
                        <CardTitle>AI Analysis for {mockPatients.find(p=>p.id === selectedPatient)?.name}</CardTitle>
                       </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Health Summary</h3>
                            <p className="text-sm text-muted-foreground">{result.summary}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2 text-destructive"><Activity/> Risk Highlights</h3>
                             <ul className="list-disc list-inside space-y-1">
                                {result.riskHighlights?.map((highlight, index) => (
                                    <li key={index} className="text-sm text-destructive/90">{highlight}</li>
                                ))}
                            </ul>
                        </div>
                         <Alert className="mt-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>For Informational Purposes Only</AlertTitle>
                            <AlertDescription>
                                This AI-generated summary is intended to assist healthcare professionals and is not a substitute for clinical judgment.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
