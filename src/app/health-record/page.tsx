
"use client";

import React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useAuth } from "@/hooks/use-auth";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { Appointment } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileText, Calendar, Clock, Pill, Clipboard, Stethoscope, Beaker } from "lucide-react";
import { format } from "date-fns";

// Mock data for past appointments
const mockDiagnoses = ["Common Cold", "Seasonal Allergies", "Minor Sprain", "Hypertension Checkup"];
const mockNotes = [
    "Patient advised to rest, stay hydrated, and take over-the-counter medication as needed. Follow up if symptoms persist after 7 days.",
    "Prescribed antihistamines and advised to avoid known allergens. Suggested using an air purifier at home.",
    "Applied R.I.C.E (Rest, Ice, Compression, Elevation) protocol. Prescribed pain relief gel. Follow up in 2 weeks if pain continues.",
    "Blood pressure is stable. Continue with current medication. Recommended dietary changes and light exercise.",
];
const mockPrescriptions = [
    "Paracetamol 500mg (as needed for fever/pain)",
    "Cetirizine 10mg (once daily at night)",
    "Diclofenac Gel (apply locally twice a day)",
    "Amlodipine 5mg (once daily in the morning)",
];
const mockReports = [
    "Blood Test Results: All values within normal range.",
    "Allergy Panel: Mild reaction to pollen. Otherwise normal.",
    "X-Ray (Ankle): No fracture detected. Mild ligament inflammation observed.",
    "ECG Report: Normal sinus rhythm. No abnormalities detected.",
];


export default function HealthRecordPage() {
  const { user } = useAuth();
  const [appointments] = useLocalStorage<Appointment[]>("appointments", []);

  const upcomingAppointments = appointments
    .filter(a => new Date(a.appointmentDate) >= new Date())
    .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());
    
  const pastAppointments = appointments
    .filter(a => new Date(a.appointmentDate) < new Date())
    .map((appt, index) => {
        // If the past appointment is missing details, fill them in with mock data.
        if (appt.status === "Completed" && !appt.diagnosis) {
            const randomIndex = index % mockDiagnoses.length;
            return {
                ...appt,
                diagnosis: mockDiagnoses[randomIndex],
                doctorsNotes: mockNotes[randomIndex],
                prescription: mockPrescriptions[randomIndex],
                testReports: mockReports[randomIndex],
            };
        }
        return appt;
    })
    .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" => {
    switch(status) {
        case "Scheduled": return "default";
        case "Completed": return "secondary";
        case "Cancelled": return "destructive";
        default: return "default";
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-primary/5">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 text-center">
                <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">Medical Records</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Your personal health history and upcoming appointments for {user?.name}.
                </p>
            </div>
            
            <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Upcoming Appointments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {upcomingAppointments.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Doctor</TableHead>
                                    <TableHead>Patient</TableHead>
                                    <TableHead>Date & Time</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {upcomingAppointments.map(appt => (
                                    <TableRow key={appt.id}>
                                        <TableCell>
                                            <div className="font-medium">{appt.doctorName}</div>
                                            <div className="text-xs text-muted-foreground capitalize">{appt.doctorSpecialty}</div>
                                        </TableCell>
                                        <TableCell>{appt.patientName}</TableCell>
                                        <TableCell>{format(new Date(appt.appointmentDate), "PPP 'at' h:mm a")}</TableCell>
                                        <TableCell className="text-right"><Badge variant={getStatusVariant(appt.status)}>{appt.status}</Badge></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-muted-foreground text-center py-4">No upcoming appointments.</p>
                    )}
                  </CardContent>
                </Card>

                 <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Medical Records
                    </CardTitle>
                    <CardDescription>Details from your past consultations.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {pastAppointments.length > 0 ? (
                        <Accordion type="single" collapsible className="w-full">
                            {pastAppointments.map(appt => (
                                <AccordionItem value={appt.id} key={appt.id}>
                                    <AccordionTrigger>
                                        <div className="flex justify-between items-center w-full pr-4">
                                            <div className="text-left">
                                                <div className="font-medium">{appt.patientName} with {appt.doctorName}</div>
                                                <div className="text-xs text-muted-foreground">{format(new Date(appt.appointmentDate), "PPP")} - <span className="capitalize">{appt.doctorSpecialty}</span></div>
                                            </div>
                                            <Badge variant={getStatusVariant(appt.status)}>{appt.status}</Badge>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="p-4 bg-primary/5 rounded-md mt-2">
                                        {appt.status === "Completed" && (appt.diagnosis || appt.doctorsNotes || appt.prescription || appt.testReports) ? (
                                            <div className="space-y-4">
                                                {appt.diagnosis && (
                                                <div>
                                                    <h4 className="font-semibold flex items-center gap-2 mb-1"><Stethoscope className="h-4 w-4"/> Diagnosis</h4>
                                                    <p className="text-sm pl-6">{appt.diagnosis}</p>
                                                </div>
                                                )}
                                                {appt.doctorsNotes && (
                                                <div>
                                                    <h4 className="font-semibold flex items-center gap-2 mb-1"><Clipboard className="h-4 w-4"/> Doctor's Notes</h4>
                                                    <p className="text-sm pl-6">{appt.doctorsNotes}</p>
                                                </div>
                                                )}
                                                {appt.prescription && (
                                                <div>
                                                    <h4 className="font-semibold flex items-center gap-2 mb-1"><Pill className="h-4 w-4"/> Prescription</h4>
                                                    <p className="text-sm pl-6">{appt.prescription}</p>
                                                </div>
                                                )}
                                                {appt.testReports && (
                                                <div>
                                                    <h4 className="font-semibold flex items-center gap-2 mb-1"><Beaker className="h-4 w-4"/> Test Reports</h4>
                                                    <p className="text-sm pl-6">{appt.testReports}</p>
                                                </div>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-muted-foreground text-sm">No detailed record available for this appointment.</p>
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    ) : (
                        <p className="text-muted-foreground text-center py-4">No past appointments found.</p>
                    )}
                  </CardContent>
                </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
