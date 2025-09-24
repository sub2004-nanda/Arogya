
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, User, Users, Building, Heart, Brain, Bone, Baby, Layers, Venus, Video } from "lucide-react";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { Appointment, FamilyMember } from "@/lib/types";
import { cn } from "@/lib/utils";

const appointmentSchema = z.object({
  patientType: z.enum(["myself", "family"], {
    required_error: "Please select who the appointment is for.",
  }),
  familyMemberId: z.string().optional(),
  department: z.string().min(1, "Please select a department."),
  doctorId: z.string().min(1, "Please select a doctor."),
  appointmentDate: z.date({
    required_error: "An appointment date is required.",
  }),
  age: z.number().positive().optional(),
  gender: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

const mockDoctors = {
    cardiology: [
        { id: "dr-sharma-cardio", name: "Dr. Sharma" },
        { id: "dr-verma-cardio", name: "Dr. Verma" },
    ],
    neurology: [
        { id: "dr-singh-neuro", name: "Dr. Singh" },
        { id: "dr-patel-neuro", name: "Dr. Patel" },
    ],
    orthopedics: [
        { id: "dr-joshi-ortho", name: "Dr. Joshi" },
        { id: "dr-mehta-ortho", name: "Dr. Mehta" },
    ],
    pediatrics: [
        { id: "dr-gupta-peds", name: "Dr. Gupta" },
        { id: "dr-roy-peds", name: "Dr. Roy" },
    ],
    dermatology: [
        { id: "dr-khan-derma", name: "Dr. Khan" },
        { id: "dr-iyer-derma", name: "Dr. Iyer" },
    ],
    gynecology: [
        { id: "dr-das-gyno", name: "Dr. Das" },
        { id: "dr-rao-gyno", name: "Dr. Rao" },
    ]
};

const mockFamilyMembers: FamilyMember[] = [
    { id: "fm-1", name: "Ramesh Sharma", age: 68, gender: "male", relationship: "Father" },
    { id: "fm-2", name: "Sita Sharma", age: 65, gender: "female", relationship: "Mother" },
    { id: "fm-3", name: "Priya Sharma", age: 12, gender: "female", relationship: "Daughter" },
];

export default function AppointmentsPage() {
  const { toast } = useToast();
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>("appointments", []);
  
  // Using React state for family members for now. Could also be in local storage.
  const [familyMembers] = useState<FamilyMember[]>(mockFamilyMembers);

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
        patientType: "myself",
        department: undefined,
        doctorId: undefined,
    },
  });

  const watchPatientType = form.watch("patientType");
  const watchDepartment = form.watch("department");
  const watchFamilyMemberId = form.watch("familyMemberId");

  // Reset doctor when department changes
  React.useEffect(() => {
    form.resetField("doctorId");
  }, [watchDepartment, form]);

  // Handle auto-filling age and gender
  React.useEffect(() => {
    if (watchPatientType === "family" && watchFamilyMemberId) {
        const member = familyMembers.find(m => m.id === watchFamilyMemberId);
        if (member) {
            form.setValue("age", member.age);
            form.setValue("gender", member.gender);
        }
    } else {
        form.setValue("age", undefined);
        form.setValue("gender", undefined);
    }
  }, [watchPatientType, watchFamilyMemberId, familyMembers, form]);

  function onSubmit(data: AppointmentFormValues) {
    const departmentDoctors = mockDoctors[data.department as keyof typeof mockDoctors] || [];
    const doctor = departmentDoctors.find(d => d.id === data.doctorId);
    if (!doctor) return;

    let patientName = "Myself";
    if (data.patientType === 'family') {
        const familyMember = familyMembers.find(m => m.id === data.familyMemberId);
        patientName = familyMember?.name || 'Unknown Family Member';
    }

    const isPastAppointment = new Date(data.appointmentDate) < new Date();

    // Mock data for past appointments
    const diagnoses = ["Common Cold", "Seasonal Allergies", "Minor Sprain", "Hypertension Checkup"];
    const notes = [
        "Patient advised to rest, stay hydrated, and take over-the-counter medication as needed. Follow up if symptoms persist after 7 days.",
        "Prescribed antihistamines and advised to avoid known allergens. Suggested using an air purifier at home.",
        "Applied R.I.C.E (Rest, Ice, Compression, Elevation) protocol. Prescribed pain relief gel. Follow up in 2 weeks if pain continues.",
        "Blood pressure is stable. Continue with current medication. Recommended dietary changes and light exercise.",
    ];
    const prescriptions = [
        "Paracetamol 500mg (as needed for fever/pain)",
        "Cetirizine 10mg (once daily at night)",
        "Diclofenac Gel (apply locally twice a day)",
        "Amlodipine 5mg (once daily in the morning)",
    ];
    const reports = [
        "Blood Test Results: All values within normal range.",
        "Allergy Panel: Mild reaction to pollen. Otherwise normal.",
        "X-Ray (Ankle): No fracture detected. Mild ligament inflammation observed.",
        "ECG Report: Normal sinus rhythm. No abnormalities detected.",
    ];
    const randomIndex = Math.floor(Math.random() * diagnoses.length);

    const newAppointment: Appointment = {
      ...data,
      id: `APT-${Date.now()}`,
      patientName: patientName,
      doctorName: doctor.name,
      doctorSpecialty: data.department,
      type: "in-person", 
      status: isPastAppointment ? "Completed" : "Scheduled",
      reason: "N/A",
      diagnosis: isPastAppointment ? diagnoses[randomIndex] : undefined,
      doctorsNotes: isPastAppointment ? notes[randomIndex] : undefined,
      prescription: isPastAppointment ? prescriptions[randomIndex] : undefined,
      testReports: isPastAppointment ? reports[randomIndex] : undefined,
    };
    setAppointments(prev => [...prev, newAppointment]);
    toast({
      title: "Appointment Booked!",
      description: `Your appointment with ${doctor.name} for ${patientName} is confirmed.`,
    });
    form.reset();
  }

  const departmentIcons: { [key: string]: React.ElementType } = {
    cardiology: Heart,
    neurology: Brain,
    orthopedics: Bone,
    pediatrics: Baby,
    dermatology: Layers,
    gynecology: Venus,
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-primary/5">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">Book an Appointment</h1>
            <p className="mt-4 text-lg text-muted-foreground">Schedule your consultation with one of our specialists.</p>
          </div>

          <Card className="mx-auto mt-10 max-w-4xl">
            <CardHeader>
              <CardTitle>Appointment Details</CardTitle>
              <CardDescription>Fill out the form below to book your appointment.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="patientType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Who is this appointment for?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl><RadioGroupItem value="myself" /></FormControl>
                              <FormLabel className="font-normal flex items-center gap-2"><User /> For Myself</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl><RadioGroupItem value="family" /></FormControl>
                              <FormLabel className="font-normal flex items-center gap-2"><Users /> For a Family Member</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {watchPatientType === 'family' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="familyMemberId"
                            render={({ field }) => (
                                <FormItem className="sm:col-span-1">
                                    <FormLabel>Family Member</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select member" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            {familyMembers.map(member => (
                                                <SelectItem key={member.id} value={member.id}>{member.name} ({member.relationship})</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="age"
                            render={({ field }) => (
                                <FormItem className="sm:col-span-1">
                                <FormLabel>Age</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="Age" {...field} value={field.value ?? ""} onChange={e => field.onChange(parseInt(e.target.value) || undefined)} readOnly={!!watchFamilyMemberId} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem className="sm:col-span-1">
                                    <FormLabel>Gender</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value} disabled={!!watchFamilyMemberId}>
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
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a department" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.keys(mockDoctors).map(dept => {
                                const Icon = departmentIcons[dept] || Building;
                                return (
                                    <SelectItem key={dept} value={dept} className="capitalize">
                                        <div className="flex items-center gap-2">
                                            <Icon className="h-4 w-4" />
                                            {dept}
                                        </div>
                                    </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="doctorId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Doctor</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!watchDepartment}>
                            <FormControl><SelectTrigger><SelectValue placeholder={watchDepartment ? "Select a doctor" : "Select department first"} /></SelectTrigger></FormControl>
                            <SelectContent>
                              {(mockDoctors[watchDepartment as keyof typeof mockDoctors] || []).map(doc => (
                                  <SelectItem key={doc.id} value={doc.id}>{doc.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

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
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date(new Date().setDate(new Date().getDate() - 1))
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Booking..." : "Book Appointment"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="mx-auto mt-10 max-w-4xl">
            <CardHeader>
              <CardTitle>General Consultation - 24/7</CardTitle>
              <CardDescription>No appointment needed. Connect with a doctor for an instant video consultation.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                      Our general physicians are available around the clock to help you with non-emergency health concerns.
                  </p>
                  <Button asChild size="lg">
                    <Link href="/video-consultation">
                      <Video className="mr-2 h-5 w-5" />
                      Start Video Consultation
                    </Link>
                  </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </main>
      <Footer />
    </div>
  );
}
