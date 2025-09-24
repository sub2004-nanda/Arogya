
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Trash2, User, Users } from "lucide-react";

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
  patientType: z.enum(["user", "family"]),
  patientName: z.string().min(2, "Name must be at least 2 characters."),
  familyMemberId: z.string().optional(),
  age: z.coerce.number().min(0, "Age must be a positive number.").max(120),
  gender: z.enum(["male", "female", "other"]),
  appointmentDate: z.date({ required_error: "An appointment date is required." }),
  department: z.string().min(1, "Please select a department."),
}).refine(data => {
  if (data.patientType === 'family') {
    return !!data.familyMemberId;
  }
  return true;
}, {
  message: "Please select a family member.",
  path: ["familyMemberId"],
});


type AppointmentFormValues = z.infer<typeof appointmentSchema>;

const departments = ["Cardiology", "Dermatology", "General Medicine", "Neurology", "Pediatrics"];

// Mock family members data. In a real app, this would come from a database or a global state.
const mockFamilyMembers: FamilyMember[] = [
  { id: 'fm1', name: 'Jane Doe', age: 38, gender: 'female', relationship: 'Wife' },
  { id: 'fm2', name: 'Sam Doe', age: 12, gender: 'male', relationship: 'Son' },
  { id: 'fm3', name: 'Mary Doe', age: 8, gender: 'female', relationship: 'Daughter' },
];

function PatientDetailsFields({ control, familyMembers }: { control: any, familyMembers: FamilyMember[] }) {
  const patientType = useWatch({ control, name: "patientType" });
  const { setValue } = useFormContext<AppointmentFormValues>();

  const handleFamilyMemberChange = (memberId: string) => {
      const member = familyMembers.find(m => m.id === memberId);
      if(member) {
          setValue('patientName', member.name);
          setValue('age', member.age);
          setValue('gender', member.gender);
          setValue('familyMemberId', member.id);
      }
  };
  
  return (
    <>
      <FormField
        control={control}
        name="patientType"
        render={({ field }) => (
          <FormItem className="col-span-full">
            <FormLabel>Patient</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={(value) => {
                  field.onChange(value);
                  if (value === 'user') {
                      // Reset fields when switching to 'user'
                      setValue('patientName', 'Me');
                      setValue('age', 42); // Example user age
                      setValue('gender', 'male'); // Example user gender
                      setValue('familyMemberId', undefined);
                  } else {
                     // Clear fields for family member selection
                     setValue('patientName', '');
                     setValue('age', 0);
                     setValue('gender', 'other');
                  }
                }}
                defaultValue={field.value}
                className="flex gap-4 items-center"
              >
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="user" id="user" />
                  </FormControl>
                  <FormLabel htmlFor="user" className="font-normal flex items-center gap-2"><User/> Myself</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="family" id="family" />
                  </FormControl>
                  <FormLabel htmlFor="family" className="font-normal flex items-center gap-2"><Users/> Family Member</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {patientType === 'family' && (
        <FormField
          control={control}
          name="familyMemberId"
          render={({ field }) => (
            <FormItem className="col-span-full sm:col-span-1">
              <FormLabel>Select Family Member</FormLabel>
              <Select onValueChange={handleFamilyMemberChange} defaultValue={field.value}>
                  <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select a family member" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                      {familyMembers.map(member => (
                          <SelectItem key={member.id} value={member.id}>
                              {member.name} ({member.relationship})
                          </SelectItem>
                      ))}
                  </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {patientType === 'user' && (
        <FormField
            control={control}
            name="patientName"
            render={({ field }) => (
                <FormItem className="hidden">
                    <FormControl><Input {...field} /></FormControl>
                </FormItem>
            )}
        />
      )}

      <FormField
        control={control}
        name="age"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Age</FormLabel>
            <FormControl><Input type="number" placeholder="42" {...field} readOnly={patientType === 'family'} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="gender"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gender</FormLabel>
            <Select onValueChange={field.onChange} value={field.value} disabled={patientType === 'family'}>
              <FormControl><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger></FormControl>
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
    </>
  );
}

export default function AppointmentsPage() {
  const { toast } = useToast();
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>("appointments", []);
  
  // Using React state for family members for now. Could also be in local storage.
  const [familyMembers] = useState<FamilyMember[]>(mockFamilyMembers);

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientType: "user",
      patientName: "Me",
      age: 42, // Example user age
      gender: "male", // Example user gender
      department: undefined,
    },
  });

  const { control } = form;

  function onSubmit(data: AppointmentFormValues) {
    const finalPatientName = data.patientType === 'user' ? "Myself" : data.patientName;

    const newAppointment: Appointment = {
      ...data,
      patientName: finalPatientName,
      id: new Date().toISOString(),
    };
    setAppointments([...appointments, newAppointment]);
    toast({
      title: "Appointment Booked!",
      description: `Your appointment for ${finalPatientName} is confirmed.`,
    });
    form.reset();
  }

  function deleteAppointment(id: string) {
    setAppointments(appointments.filter(app => app.id !== id));
    toast({
      title: "Appointment Cancelled",
      description: "The appointment has been removed.",
      variant: "destructive"
    });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-primary/5">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">Book an Appointment</h1>
              <p className="mt-4 text-lg text-muted-foreground">Fill out the form below to schedule your consultation.</p>
            </div>

            <Card className="mt-10">
              <CardHeader>
                <CardTitle>New Appointment Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <PatientDetailsFields control={control} familyMembers={familyMembers} />
                      
                      <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Department</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger></FormControl>
                              <SelectContent>
                                {departments.map(dep => <SelectItem key={dep} value={dep}>{dep}</SelectItem>)}
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
                    </div>

                    <Button type="submit" className="w-full sm:w-auto" disabled={form.formState.isSubmitting}>
                      Book Appointment
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <div className="mt-12">
              <h2 className="font-headline text-2xl font-bold tracking-tight">Your Upcoming Appointments</h2>
              <div className="mt-6 space-y-4">
                {appointments.length > 0 ? (
                  [...appointments].sort((a,b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()).map((app) => (
                    <Card key={app.id} className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-semibold">{app.patientName}, {app.age}</p>
                        <p className="text-sm text-muted-foreground">
                          {app.department} on {format(new Date(app.appointmentDate), "PPP")}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => deleteAppointment(app.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Delete appointment</span>
                      </Button>
                    </Card>
                  ))
                ) : (
                  <Card className="flex items-center justify-center p-10">
                    <p className="text-muted-foreground">You have no upcoming appointments.</p>
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

    