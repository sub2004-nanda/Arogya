
"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useAuth } from "@/hooks/use-auth";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { Appointment } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Clock, User, Mail, Phone, MapPin } from "lucide-react";
import { format } from "date-fns";

export default function HealthRecordPage() {
  const { user } = useAuth();
  const [appointments] = useLocalStorage<Appointment[]>("appointments", []);

  const upcomingAppointments = appointments
    .filter(a => new Date(a.appointmentDate) >= new Date())
    .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());
    
  const pastAppointments = appointments
    .filter(a => new Date(a.appointmentDate) < new Date())
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
                <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">Health Records</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Your personal health history and upcoming appointments.
                </p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader className="flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src={`https://picsum.photos/seed/${user?.email}/100/100`} />
                      <AvatarFallback>{user?.name?.charAt(0) ?? 'U'}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-2xl">{user?.name}</CardTitle>
                    <CardDescription>Patient Profile</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                     <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{user?.email}</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>(555) 123-4567 (mock)</span>
                     </div>
                     <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <span>123 Health St, Wellness City (mock)</span>
                     </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2 space-y-8">
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
                        <Clock className="h-5 w-5" />
                        Past Appointments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {pastAppointments.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Doctor</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pastAppointments.map(appt => (
                                    <TableRow key={appt.id}>
                                        <TableCell>
                                            <div className="font-medium">{appt.doctorName}</div>
                                            <div className="text-xs text-muted-foreground capitalize">{appt.doctorSpecialty}</div>
                                        </TableCell>
                                        <TableCell>{format(new Date(appt.appointmentDate), "PPP")}</TableCell>
                                        <TableCell className="text-right"><Badge variant={getStatusVariant(appt.status)}>{appt.status}</Badge></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-muted-foreground text-center py-4">No past appointments found.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
