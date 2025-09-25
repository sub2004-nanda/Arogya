
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import type { Appointment } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";

export default function DoctorSchedulePage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const heroImage = PlaceHolderImages.find((img) => img.id === 'doctor-schedule-hero');

  useEffect(() => {
    // In a real app, you would fetch this data from your backend.
    // For now, we'll use the mock data and sort it.
    const mockDoctorAppointments: Appointment[] = [
        {
            id: 'doc-apt-1',
            patientName: 'Sunita Sharma',
            doctorId: 'dr-ankit',
            doctorName: 'Dr. Ankit',
            doctorSpecialty: 'General Physician',
            appointmentDate: new Date(new Date().setHours(9, 30, 0, 0)),
            type: 'in-person',
            status: 'Scheduled',
            reason: 'Chest Pain, Shortness of Breath',
            priority: 'Emergency',
        },
        {
            id: 'doc-apt-2',
            patientName: 'Rajesh Kumar',
            doctorId: 'dr-ankit',
            doctorName: 'Dr. Ankit',
            doctorSpecialty: 'General Physician',
            appointmentDate: new Date(new Date().setHours(10, 0, 0, 0)),
            type: 'in-person',
            status: 'Scheduled',
            reason: 'High Blood Pressure Reading (180/120)',
            priority: 'High Risk',
        },
        {
            id: 'doc-apt-3',
            patientName: 'Anita Verma',
            doctorId: 'dr-ankit',
            doctorName: 'Dr. Ankit',
            doctorSpecialty: 'General Physician',
            appointmentDate: new Date(new Date().setHours(11, 0, 0, 0)),
            type: 'in-person',
            status: 'Scheduled',
            reason: 'Follow-up Consultation',
            priority: 'Routine',
        },
        {
            id: 'doc-apt-4',
            patientName: 'Rohan Joshi',
            doctorId: 'dr-ankit',
            doctorName: 'Dr. Ankit',
            doctorSpecialty: 'General Physician',
            appointmentDate: new Date(new Date().setHours(11, 30, 0, 0)),
            type: 'video-consultation',
            status: 'Scheduled',
            reason: 'Common Cold & Cough',
            priority: 'Routine',
        },
        {
            id: 'doc-apt-5',
            patientName: 'Priya Singh',
            doctorId: 'dr-ankit',
            doctorName: 'Dr. Ankit',
            doctorSpecialty: 'General Physician',
            appointmentDate: new Date(new Date().setHours(12, 0, 0, 0)),
            type: 'in-person',
            status: 'Scheduled',
            reason: 'Annual Health Checkup',
            priority: 'Routine',
        },
    ];

    const sortedAppointments = [...mockDoctorAppointments].sort(
      (a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()
    );
    setAppointments(sortedAppointments);
  }, []);

  const getPriorityBadge = (priority: Appointment['priority']): "default" | "secondary" | "destructive" => {
    switch(priority) {
        case "Emergency": return "destructive";
        case "High Risk": return "secondary";
        default: return "default";
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        
        {/* Hero Section */}
        <section className="relative py-20 sm:py-28">
            {heroImage && (
                <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                priority
                data-ai-hint={heroImage.imageHint}
                />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/50 to-transparent" />

            <div className="container relative mx-auto px-4 text-left">
                <div className="max-w-2xl">
                <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                    Today's Schedule
                </h1>
                <p className="mt-6 text-lg leading-8 text-foreground/80">
                    Here are your appointments for {format(new Date(), 'PPP')}.
                </p>
                </div>
            </div>
        </section>

        {/* Schedule Table Section */}
        <section className="bg-primary/5 py-20 sm:py-24">
            <div className="container mx-auto px-4">
                 <div className="mb-6">
                    <Button asChild variant="outline">
                        <Link href="/doctor-dashboard">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Dashboard
                        </Link>
                    </Button>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Upcoming Appointments
                    </CardTitle>
                    <CardDescription>A list of your scheduled appointments for today.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {appointments.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Patient</TableHead>
                                    <TableHead>Reason for Visit</TableHead>
                                    <TableHead className="text-right">Priority</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {appointments.map(appt => (
                                    <TableRow key={appt.id}>
                                        <TableCell className="font-medium">
                                            {format(new Date(appt.appointmentDate), "h:mm a")}
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium flex items-center gap-2">
                                                <User className="h-4 w-4 text-muted-foreground"/>
                                                {appt.patientName}
                                            </div>
                                        </TableCell>
                                        <TableCell>{appt.reason}</TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant={getPriorityBadge(appt.priority)}>{appt.priority}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-muted-foreground text-center py-4">No upcoming appointments scheduled for today.</p>
                    )}
                  </CardContent>
                </Card>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
