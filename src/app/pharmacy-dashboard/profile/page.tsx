
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, User, MapPin, Save } from "lucide-react";

const profileSchema = z.object({
  shopName: z.string().min(1, "Shop name is required."),
  pharmacistName: z.string().min(1, "Pharmacist name is required."),
  licenseNumber: z.string().min(1, "License number is required."),
  contact: z.string().regex(/^\d{10}$/, "Please enter a valid 10-digit mobile number."),
  address: z.string().min(1, "Full address is required."),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const initialProfile: ProfileFormValues = {
    shopName: "Gupta Medical Hall",
    pharmacistName: "Suresh Gupta",
    licenseNumber: "PB-12345-DL",
    contact: "9876543210",
    address: "Shop No. 12, Sadar Bazar, Near Civil Hospital, Nabha, Punjab 147201",
};

export default function ProfilePage() {
  const { toast } = useToast();
  const [profile, setProfile] = useLocalStorage("pharmacyProfile", initialProfile);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialProfile, // Use initial values for server render
  });

  // Populate form with local storage data on client side
  useEffect(() => {
    form.reset(profile);
  }, [profile, form]);

  const onSubmit = (data: ProfileFormValues) => {
    setProfile(data);
    toast({
      title: "Profile Updated",
      description: "Your pharmacy details have been successfully saved.",
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-primary/5">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-2xl">
            <div className="mb-6">
              <Button asChild variant="outline">
                <Link href="/pharmacy-dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
            <div className="text-center mb-10">
              <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl flex items-center justify-center gap-3">
                <User /> Pharmacy Profile
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Update your pharmacy's details, hours, and contact information.
              </p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Edit Pharmacy Details</CardTitle>
                <CardDescription>
                  This information will be visible to patients searching for pharmacies.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="shopName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shop Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                          <FormLabel>Owner / Pharmacist Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                        control={form.control}
                        name="licenseNumber"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Drug License Number</FormLabel>
                            <FormControl>
                                <Input {...field} />
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
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                     <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2"><MapPin className="h-4 w-4"/> Full Address</FormLabel>
                          <FormControl>
                            <Textarea
                                placeholder="This address will be used to show your location on the map for patients."
                                className="resize-none"
                                {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">
                        <Save className="mr-2"/>
                        Save Changes
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
