
"use client";

import React, { useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { NotebookPen, Save } from 'lucide-react';

// Mock patient data
const patients = [
  { id: 'PAT-EMG-001', name: 'Sunita Sharma' },
  { id: 'PAT-HR-002', name: 'Rajesh Kumar' },
  { id: 'PAT-REG-003', name: 'Anita Verma' },
  { id: 'PAT-REG-004', name: 'Rohan Joshi' },
];

export default function QuickNotesPage() {
  const { toast } = useToast();
  const [selectedPatient, setSelectedPatient] = useState('');
  const [note, setNote] = useState('');

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
    console.log(`Saving note for patient ${selectedPatient}:`, note);

    toast({
      title: 'Note Saved!',
      description: `Note for ${patients.find(p => p.id === selectedPatient)?.name} has been saved.`,
    });

    // Reset the form
    setSelectedPatient('');
    setNote('');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-primary/5">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-2xl">
            <div className="text-center mb-10">
              <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">Quick Notes</h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Quickly add notes to a patient's record.
              </p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><NotebookPen/> Add a New Note</CardTitle>
                    <CardDescription>Select a patient and write your notes below.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <label htmlFor="patient-select" className="text-sm font-medium mb-2 block">Select Patient</label>
                        <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                            <SelectTrigger id="patient-select">
                                <SelectValue placeholder="Select a patient from your queue..." />
                            </SelectTrigger>
                            <SelectContent>
                                {patients.map(patient => (
                                    <SelectItem key={patient.id} value={patient.id}>{patient.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label htmlFor="note-textarea" className="text-sm font-medium mb-2 block">Note</label>
                        <Textarea 
                            id="note-textarea"
                            placeholder="e.g., Patient reports improved symptoms after medication..." 
                            className="min-h-[200px]"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>

                    <Button onClick={handleSaveNote} disabled={!selectedPatient || !note.trim()} className="w-full">
                        <Save className="mr-2" />
                        Save Note to Patient Record
                    </Button>
                </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
