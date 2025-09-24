
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
import { Logo } from "@/components/logo";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

const ashaSchema = z.object({
  name: z.string().min(1, "Name is required."),
  workerId: z.string().min(1, "ASHA Worker ID is required."),
  village: z.string().min(1, "Assigned village is required."),
  contact: z.string().regex(/^\d{10}$/, "Please enter a valid 10-digit mobile number."),
});

type AshaFormValues = z.infer<typeof ashaSchema>;

export default function AshaSignupPage() {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [ashaId, setAshaId] = useState("");

  const form = useForm<AshaFormValues>({
    resolver: zodResolver(ashaSchema),
  });

  const onSubmit = (data: AshaFormValues) => {
    console.log("ASHA Worker Registration data:", data);
    const newAshaId = `ASHA${Date.now()}`;
    setAshaId(newAshaId);
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
            <CardTitle className="text-2xl">ASHA Worker Registration</CardTitle>
            <CardDescription>
              Please fill in your details to create your ASHA worker account.
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
                        <Input placeholder="e.g. Geeta Devi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="workerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ASHA Worker ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your official ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="village"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assigned Village/Area</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Alipur" {...field} />
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
              Your ASHA Worker profile has been created. Your mock ID for login is <span className="font-bold">{ashaId}</span>. You can now log in.
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
