
'use client';

import { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { UserPlus, Calendar, Pill, ShieldCheck, User } from "lucide-react";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { FamilyMember } from "@/lib/types";


const initialFamilyMembers: FamilyMember[] = [
  { id: "fm-1", name: "Ramesh Sharma", age: 68, gender: "male", relationship: "Father" },
  { id: "fm-2", name: "Sita Sharma", age: 65, gender: "female", relationship: "Mother" },
  { id: "fm-3", name: "Priya Sharma", age: 12, gender: "female", relationship: "Daughter" },
];

const addMemberSchema = z.object({
  name: z.string().min(1, "Name is required."),
  relationship: z.string().min(1, "Relationship is required."),
  age: z.coerce.number().min(0, "Age must be a positive number."),
  gender: z.enum(["male", "female", "other"], { required_error: "Gender is required." }),
});

type AddMemberFormValues = z.infer<typeof addMemberSchema>;


export default function FamilyHealthPage() {
    const { toast } = useToast();
    const [familyMembers, setFamilyMembers] = useLocalStorage<FamilyMember[]>("familyMembers", initialFamilyMembers);
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
    const [mockFamilyAppointments, setMockFamilyAppointments] = useState<any[]>([]);
    const [mockFamilyPrescriptions, setMockFamilyPrescriptions] = useState<any[]>([]);
    const [mockVaccinations, setMockVaccinations] = useState<any[]>([]);

    useEffect(() => {
        setMockFamilyAppointments([
            { id: "apt-1", memberId: "fm-1", memberName: "Ramesh Sharma", doctor: "Dr. Sharma", specialty: "Cardiology", date: new Date(new Date().setDate(new Date().getDate() + 5)), status: "Scheduled" },
            { id: "apt-2", memberId: "fm-3", memberName: "Priya Sharma", doctor: "Dr. Gupta", specialty: "Pediatrics", date: new Date(new Date().setDate(new Date().getDate() + 10)), status: "Scheduled" },
        ]);
        setMockFamilyPrescriptions([
            { id: "pre-1", memberName: "Ramesh Sharma", medicine: "Amlodipine 5mg", doctor: "Dr. Sharma", date: new Date(new Date().setDate(new Date().getDate() - 15)) },
            { id: "pre-2", memberName: "Sita Sharma", medicine: "Calcium Tablets", doctor: "Dr. Joshi", date: new Date(new Date().setDate(new Date().getDate() - 30)) },
        ]);
        setMockVaccinations([
            { id: "vac-1", memberName: "Priya Sharma", vaccine: "HPV Vaccine (2nd Dose)", status: "Due", dueDate: new Date(new Date().setDate(new Date().getDate() + 20)) },
            { id: "vac-2", memberName: "Priya Sharma", vaccine: "Tdap Booster", status: "Completed", dueDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) },
        ]);
    }, []);

    const form = useForm<AddMemberFormValues>({
        resolver: zodResolver(addMemberSchema),
        defaultValues: {
            name: "",
            relationship: "",
            age: undefined,
            gender: undefined,
        },
    });

    function onAddMember(data: AddMemberFormValues) {
        const newMember: FamilyMember = {
            id: `fm-${Date.now()}`,
            ...data,
        };
        setFamilyMembers(prev => [...prev, newMember]);
        toast({
            title: "Member Added",
            description: `${data.name} has been added to your family profile.`,
        });
        form.reset();
        setIsAddMemberOpen(false);
    }

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
                      <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
                        <DialogTrigger asChild>
                           <Button variant="outline"><UserPlus className="mr-2"/>Add Member</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add a New Family Member</DialogTitle>
                                <DialogDescription>Enter the details below to add a new member to your profile.</DialogDescription>
                            </DialogHeader>
                             <Form {...form}>
                                <form onSubmit={form.handleSubmit(onAddMember)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., Sunil Sharma" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                     <FormField
                                        control={form.control}
                                        name="relationship"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>Relationship</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., Son, Spouse" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="age"
                                            render={({ field }) => (
                                                <FormItem>
                                                <FormLabel>Age</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="e.g., 35" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="gender"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Gender</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl><SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger></FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="male">Male</SelectItem>
                                                            <SelectItem value="female">Female</SelectItem>
                                                            <SelectItem value="other">Other</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit">Save Member</Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                      </Dialog>
                   </div>
                   <CardDescription>View and manage profiles for your family members.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {familyMembers.map(member => (
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
