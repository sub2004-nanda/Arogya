
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Trash2, Video, Hospital, Clock, MessageSquare, PlusCircle } from "lucide-react";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { Appointment } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

const appointmentSchema = z.object({
  doctorId: z.string().min(1, "Please select a doctor."),
  appointmentDate: z.date({ required_error: "An appointment date is required." }),
  type: z.enum(["in-person", "teleconsult"]),
  reason: z.string().min(5, "Please provide a brief reason for your visit."),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

const mockDoctors = [
    { id: "dr-sharma-cardio", name: "Dr. Sharma", specialty: "Cardiology" },
    { id: "dr-gupta-derma", name: "Dr. Gupta", specialty: "Dermatology" },
    { id: "dr-singh-neuro", name: "Dr. Singh", specialty: "Neurology" },
];

export default function AppointmentsPage() {
  const { toast } = useToast();
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>("appointments", []);

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
        doctorId: undefined,
        type: "in-person",
        reason: "",
    },
  });

  function onSubmit(data: AppointmentFormValues) {
    const doctor = mockDoctors.find(d => d.id === data.doctorId);
    if (!doctor) return;

    const newAppointment: Appointment = {
      ...data,
      id: new Date().toISOString(),
      patientName: "Myself", // Placeholder until full patient management is built
      status: "Scheduled",
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
    };
    setAppointments(prev => [...prev, newAppointment]);
    toast({
      title: "Appointment Booked!",
      description: `Your appointment with ${doctor.name} is confirmed.`,
    });
    form.reset();
  }

  function cancelAppointment(id: string) {
    setAppointments(prev => prev.map(app => app.id === id ? {...app, status: 'Cancelled'} : app));
    toast({
      title: "Appointment Cancelled",
      description: "The appointment has been cancelled.",
      variant: "destructive"
    });
  }

  const upcomingAppointments = appointments
    .filter(app => new Date(app.appointmentDate) >= new Date() && app.status === 'Scheduled')
    .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());

  const pastAppointments = appointments
    .filter(app => new Date(app.appointmentDate) < new Date() || app.status !== 'Scheduled')
    .sort((a,b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-primary/5">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">Appointments</h1>
              <p className="mt-4 text-lg text-muted-foreground">Manage your consultations and book new ones.</p>
            </div>

            {/* Book New Appointment */}
            <Card className="mb-12">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><PlusCircle /> Book a New Appointment</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                       <FormField
                        control={form.control}
                        name="doctorId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Doctor</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Select a doctor" /></SelectTrigger></FormControl>
                              <SelectContent>
                                {mockDoctors.map(doc => <SelectItem key={doc.id} value={doc.id}>{doc.name} - {doc.specialty}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="appointmentDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Appointment Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                                  >
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="reason"
                        render={({ field }) => (
                            <FormItem className="sm:col-span-2">
                                <FormLabel>Reason for Visit</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Briefly describe why you are booking this appointment..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                      />

                       <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 sm:col-span-2">
                                    <div className="space-y-0.5">
                                        <FormLabel>Consultation Mode</FormLabel>
                                        <FormDescription>
                                            Choose between an online video call or an in-person visit.
                                        </FormDescription>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Hospital className="h-5 w-5 text-muted-foreground" />
                                        <FormControl>
                                            <Switch
                                                checked={field.value === 'teleconsult'}
                                                onCheckedChange={(checked) => {
                                                    field.onChange(checked ? 'teleconsult' : 'in-person');
                                                }}
                                            />
                                        </FormControl>
                                        <Video className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button type="submit" className="w-full sm:w-auto" disabled={form.formState.isSubmitting}>
                      Confirm Appointment
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <div className="mb-12">
              <h2 className="font-headline text-2xl font-bold tracking-tight mb-6">Upcoming Appointments</h2>
              <div className="space-y-4">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((app) => (
                    <Card key={app.id} className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <p className="font-bold text-lg">{app.doctorName}</p>
                                <p className="text-sm text-muted-foreground">{app.doctorSpecialty}</p>
                                <div className="flex items-center gap-4 mt-2 text-sm">
                                    <span className="flex items-center gap-1.5"><CalendarIcon className="h-4 w-4 text-muted-foreground" /> {format(new Date(app.appointmentDate), "PPP")}</span>
                                    <span className="flex items-center gap-1.5 capitalize">{app.type === 'teleconsult' ? <Video className="h-4 w-4 text-muted-foreground" /> : <Hospital className="h-4 w-4 text-muted-foreground" />} {app.type.replace('-', ' ')}</span>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-4 sm:mt-0">
                                {app.type === 'teleconsult' && <Button>Join Consultation</Button>}
                                <Button variant="destructive" onClick={() => cancelAppointment(app.id)}>Cancel</Button>
                            </div>
                        </div>
                    </Card>
                  ))
                ) : (
                  <Card className="flex items-center justify-center p-10">
                    <p className="text-muted-foreground">You have no upcoming appointments.</p>
                  </Card>
                )}
              </div>
            </div>

             {/* Past Appointments */}
            <div>
              <h2 className="font-headline text-2xl font-bold tracking-tight mb-6">Past Appointments</h2>
              <div className="space-y-4">
                {pastAppointments.length > 0 ? (
                  pastAppointments.map((app) => (
                    <Card key={app.id} className="p-4 opacity-70">
                         <div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold">{app.doctorName} - {app.doctorSpecialty}</p>
                                    <p className="text-sm text-muted-foreground">{format(new Date(app.appointmentDate), "PPP")}</p>
                                </div>
                                <Badge variant={app.status === 'Cancelled' ? 'destructive' : 'secondary'}>{app.status}</Badge>
                            </div>
                            {app.status === 'Completed' && (
                                <div className="mt-4 border-t pt-4">
                                   <p className="text-sm font-semibold">Consultation Notes Summary:</p>
                                   <p className="text-sm text-muted-foreground italic">"Patient reported mild symptoms. Advised rest and hydration."</p>
                                   <Button variant="link" className="px-0 h-auto mt-2">View Full Notes & Prescription</Button>
                                </div>
                            )}
                         </div>
                    </Card>
                  ))
                ) : (
                  <Card className="flex items-center justify-center p-10">
                    <p className="text-muted-foreground">You have no past appointments.</p>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
