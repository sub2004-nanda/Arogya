
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Logo } from "@/components/logo";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

const doctorSchema = z.object({
  name: z.string().min(1, "Name is required."),
  specialization: z.string().min(1, "Specialization is required."),
  availability: z.string().min(1, "Please describe your availability."),
  registrationId: z.string().min(1, "Registration ID is required."),
  contact: z.string().regex(/^\d{10}$/, "Please enter a valid 10-digit mobile number."),
});

type DoctorFormValues = z.infer<typeof doctorSchema>;

export default function DoctorSignupPage() {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [doctorId, setDoctorId] = useState("");

  const form = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorSchema),
  });

  const onSubmit = (data: DoctorFormValues) => {
    console.log("Doctor Registration data:", data);
    const newDoctorId = `DOC${Date.now()}`;
    setDoctorId(newDoctorId);
    setShowSuccess(true);
  };

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center bg-primary/5 p-4">
        <div className="absolute top-4 left-4">
            <Button asChild variant="outline">
                <Link href="/signup"><ArrowLeft className="mr-2" /> Back to Role Selection</Link>
            </Button>
        </div>
        <div className="mb-8 flex items-center gap-4">
          <Link href="/"><Logo className="h-16 w-auto" /></Link>
        </div>
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Doctor Registration</CardTitle>
            <CardDescription>
              Please fill in your details to create a professional account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Dr. Sunita Sharma" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="specialization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialization</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Cardiology" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="registrationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medical Registration ID</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. MCI12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 9876543210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="availability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Availability</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g. Mon-Fri, 9am - 5pm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full mt-2">
                  Register
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Registration Successful!</AlertDialogTitle>
            <AlertDialogDescription>
              Your doctor profile has been created. Your mock Doctor ID is <span className="font-bold">{doctorId}</span>. You can now log in.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => router.push('/login')}>
              Proceed to Login
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
