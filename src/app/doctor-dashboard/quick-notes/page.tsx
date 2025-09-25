
"use client";

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Bot, Loader2, NotebookPen, Save, ArrowLeft } from 'lucide-react';
import { generateSummary } from '@/lib/actions';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Mock patient data
const patients = [
  { id: 'PAT-EMG-001', name: 'Sunita Sharma' },
  { id: 'PAT-HR-002', name: 'Rajesh Kumar' },
  { id: 'PAT-REG-003', name: 'Anita Verma' },
  { id: 'PAT-REG-004', name: 'Rohan Joshi' },
];

interface SummaryResult {
    htmlSummary?: string;
    error?: string;
}

export default function QuickNotesPage() {
  const { toast } = useToast();
  const [selectedPatient, setSelectedPatient] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [note, setNote] = useState('');
  const [prescription, setPrescription] = useState('');

  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);
  const [summaryResult, setSummaryResult] = useState<SummaryResult | null>(null);
  const [isPending, startTransition] = useTransition();


  const handleSaveNote = () => {
    if (!selectedPatient || !note.trim()) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please select a patient and write a note before saving.',
      });
      return;
    }

    // In a real application, you would save this to the database.
    console.log(`Saving note for patient ${selectedPatient}:`, { diagnosis, note, prescription });

    toast({
      title: 'Record Saved!',
      description: `Medical notes for ${patients.find(p => p.id === selectedPatient)?.name} have been saved.`,
    });
  };

  const handleGenerateSummary = () => {
    if (!diagnosis || !note) return;
    setSummaryResult(null);
    setIsSummaryDialogOpen(true);

    startTransition(async () => {
        const response = await generateSummary({
            diagnosis,
            doctorsNotes: note,
            prescription,
            language: "English", // This could be dynamic
        });
        setSummaryResult(response as SummaryResult);
    });
  }

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-primary/5">
          <div className="container mx-auto px-4 py-12 sm:py-16">
            <div className="mx-auto max-w-2xl">
                <div className="mb-6">
                    <Button asChild variant="outline">
                        <Link href="/doctor-dashboard">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Dashboard
                        </Link>
                    </Button>
                </div>
              <div className="text-center mb-10">
                <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">Quick Notes</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                  Quickly add notes to a patient's record after a consultation.
                </p>
              </div>
              
              <Card>
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2"><NotebookPen/> Add Consultation Notes</CardTitle>
                      <CardDescription>Select a patient and fill in the details of the consultation.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                      <div>
                          <label htmlFor="patient-select" className="text-sm font-medium mb-2 block">Select Patient</label>
                          <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                              <SelectTrigger id="patient-select">
                                  <SelectValue placeholder="Select a patient..." />
                              </SelectTrigger>
                              <SelectContent>
                                  {patients.map(patient => (
                                      <SelectItem key={patient.id} value={patient.id}>{patient.name}</SelectItem>
                                  ))}
                              </SelectContent>
                          </Select>
                      </div>

                      <div>
                          <label htmlFor="diagnosis" className="text-sm font-medium mb-2 block">Diagnosis</label>
                          <Input 
                              id="diagnosis"
                              placeholder="e.g., Viral Fever, Hypertension" 
                              value={diagnosis}
                              onChange={(e) => setDiagnosis(e.target.value)}
                          />
                      </div>

                      <div>
                          <label htmlFor="note-textarea" className="text-sm font-medium mb-2 block">Doctor's Notes</label>
                          <Textarea 
                              id="note-textarea"
                              placeholder="e.g., Patient reports improved symptoms after medication..." 
                              className="min-h-[150px]"
                              value={note}
                              onChange={(e) => setNote(e.target.value)}
                          />
                      </div>

                       <div>
                          <label htmlFor="prescription" className="text-sm font-medium mb-2 block">Prescription (Optional)</label>
                          <Textarea 
                              id="prescription"
                              placeholder="e.g., Paracetamol 500mg, twice a day for 3 days" 
                              className="min-h-[100px]"
                              value={prescription}
                              onChange={(e) => setPrescription(e.target.value)}
                          />
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button onClick={handleSaveNote} disabled={!selectedPatient || !note.trim()} className="w-full">
                            <Save className="mr-2" />
                            Save to Patient Record
                        </Button>
                         <Button onClick={handleGenerateSummary} disabled={isPending || !diagnosis || !note} variant="outline" className="w-full">
                            <Bot className="mr-2" />
                            {isPending ? "Generating..." : "Generate Patient Summary"}
                        </Button>
                      </div>
                  </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
      <Dialog open={isSummaryDialogOpen} onOpenChange={setIsSummaryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Bot /> AI Generated Summary</DialogTitle>
            <DialogDescription>
              A simple, shareable summary of the consultation for the patient.
            </DialogDescription>
          </DialogHeader>
          {isPending ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : summaryResult?.htmlSummary ? (
            <div className="space-y-4 py-4 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: summaryResult.htmlSummary }} />
          ) : (
             <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    {summaryResult?.error || "Could not generate summary. Please try again."}
                </AlertDescription>
            </Alert>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
