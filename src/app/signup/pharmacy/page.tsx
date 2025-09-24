
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

const pharmacySchema = z.object({
  shopName: z.string().min(1, "Shop Name is required."),
  pharmacistName: z.string().min(1, "Pharmacist Name is required."),
  licenseNumber: z.string().min(1, "License Number is required."),
  contact: z.string().regex(/^\d{10}$/, "Please enter a valid 10-digit mobile number."),
  address: z.string().min(1, "Full address is required."),
});

type PharmacyFormValues = z.infer<typeof pharmacySchema>;

export default function PharmacySignupPage() {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [pharmacyId, setPharmacyId] = useState("");

  const form = useForm<PharmacyFormValues>({
    resolver: zodResolver(pharmacySchema),
    defaultValues: {
        shopName: "",
        pharmacistName: "",
        licenseNumber: "",
        contact: "",
        address: "",
    }
  });

  const onSubmit = (data: PharmacyFormValues) => {
    console.log("Pharmacy Registration data:", data);
    const newPharmacyId = `PHARM${Date.now()}`;
    setPharmacyId(newPharmacyId);
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
            <CardTitle className="text-2xl">Pharmacy Registration</CardTitle>
            <CardDescription>
              Please fill in your pharmacy details to create a professional account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="shopName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shop Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Arogya Pharmacy" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="pharmacistName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pharmacist Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Suresh Gupta" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="licenseNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Drug License Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your official license number" {...field} />
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
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Address</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Shop No. 1, Main Market, City" {...field} />
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
              Your pharmacy profile has been created. Your mock Pharmacy ID is <span className="font-bold">{pharmacyId}</span>. You can now log in.
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
