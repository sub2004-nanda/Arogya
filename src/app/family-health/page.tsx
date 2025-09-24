
'use client';

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, Calendar, Pill, ShieldCheck, User } from "lucide-react";
import { format } from "date-fns";
import type { FamilyMember } from "@/lib/types";

// Mock Data - In a real app, this would come from a user's account data
const mockFamilyMembers: FamilyMember[] = [
  { id: "fm-1", name: "Ramesh Sharma", age: 68, gender: "male", relationship: "Father" },
  { id: "fm-2", name: "Sita Sharma", age: 65, gender: "female", relationship: "Mother" },
  { id: "fm-3", name: "Priya Sharma", age: 12, gender: "female", relationship: "Daughter" },
];

const mockFamilyAppointments = [
  { id: "apt-1", memberId: "fm-1", memberName: "Ramesh Sharma", doctor: "Dr. Sharma", specialty: "Cardiology", date: new Date(new Date().setDate(new Date().getDate() + 5)), status: "Scheduled" },
  { id: "apt-2", memberId: "fm-3", memberName: "Priya Sharma", doctor: "Dr. Gupta", specialty: "Pediatrics", date: new Date(new Date().setDate(new Date().getDate() + 10)), status: "Scheduled" },
];

const mockFamilyPrescriptions = [
  { id: "pre-1", memberName: "Ramesh Sharma", medicine: "Amlodipine 5mg", doctor: "Dr. Sharma", date: new Date(new Date().setDate(new Date().getDate() - 15)) },
  { id: "pre-2", memberName: "Sita Sharma", medicine: "Calcium Tablets", doctor: "Dr. Joshi", date: new Date(new Date().setDate(new Date().getDate() - 30)) },
];

const mockVaccinations = [
  { id: "vac-1", memberName: "Priya Sharma", vaccine: "HPV Vaccine (2nd Dose)", status: "Due", dueDate: new Date(new Date().setDate(new Date().getDate() + 20)) },
  { id: "vac-2", memberName: "Priya Sharma", vaccine: "Tdap Booster", status: "Completed", dueDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) },
];

export default function FamilyHealthPage() {

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('');
    }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-primary/5">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-10">
              <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">Family Health Profile</h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Manage your family's health records and stay updated on their needs all in one place.
              </p>
            </div>

            {/* Multiple Member Profiles */}
            <Card className="mb-10">
                <CardHeader>
                   <div className="flex justify-between items-center">
                     <CardTitle className="flex items-center gap-2"><User className="text-primary"/> Family Members</CardTitle>
                     <Button variant="outline"><UserPlus className="mr-2"/>Add Member</Button>
                   </div>
                   <CardDescription>View and manage profiles for your family members.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {mockFamilyMembers.map(member => (
                            <Card key={member.id} className="p-4 flex items-center gap-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={`https://i.pravatar.cc/150?u=${member.id}`} />
                                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{member.name}</p>
                                    <p className="text-sm text-muted-foreground capitalize">{member.relationship} &middot; {member.age}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Family Dashboard */}
            <div className="space-y-10">
                <h2 className="text-center font-headline text-3xl font-bold">Family Health Dashboard</h2>

                {/* Upcoming Appointments */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Calendar className="text-primary"/> Upcoming Appointments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Patient</TableHead>
                                    <TableHead>Doctor</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockFamilyAppointments.map(appt => (
                                    <TableRow key={appt.id}>
                                        <TableCell>{appt.memberName}</TableCell>
                                        <TableCell>{appt.doctor} ({appt.specialty})</TableCell>
                                        <TableCell>{format(appt.date, "PPP 'at' h:mm a")}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Recent Prescriptions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Pill className="text-primary"/> Recent Prescriptions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Patient</TableHead>
                                    <TableHead>Medicine</TableHead>
                                    <TableHead>Prescribed On</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockFamilyPrescriptions.map(pre => (
                                    <TableRow key={pre.id}>
                                        <TableCell>{pre.memberName}</TableCell>
                                        <TableCell>{pre.medicine}</TableCell>
                                        <TableCell>{format(pre.date, "PPP")}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Vaccination Schedule */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ShieldCheck className="text-primary"/> Vaccination Schedule (Priya Sharma)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                             <TableHeader>
                                <TableRow>
                                    <TableHead>Vaccine</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockVaccinations.map(vac => (
                                     <TableRow key={vac.id}>
                                        <TableCell>{vac.vaccine}</TableCell>
                                        <TableCell>
                                            <Badge variant={vac.status === 'Completed' ? 'secondary' : 'default'}>{vac.status}</Badge>
                                        </TableCell>
                                        <TableCell>{format(vac.dueDate, "PPP")}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
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
