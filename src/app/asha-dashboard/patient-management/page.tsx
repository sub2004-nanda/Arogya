
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Users, UserPlus, Search, ArrowRight, AlertTriangle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLocalStorage } from '@/hooks/use-local-storage';

const initialHouseholds = [
  { id: 'HH-001', head: 'Rakesh Sharma', members: 4, village: 'Ramgarh', risk: 'Low', notes: '' },
  { id: 'HH-002', head: 'Sunita Devi', members: 3, village: 'Alipur', risk: 'High', notes: 'Pregnancy' },
  { id: 'HH-003', head: 'Amit Kumar', members: 5, village: 'Ramgarh', risk: 'Low', notes: '' },
  { id: 'HH-004', head: 'Meena Kumari', members: 2, village: 'Ramgarh', risk: 'High', notes: 'Elderly care' },
  { id: 'HH-005', head: 'Rajinder Singh', members: 6, village: 'Alipur', risk: 'Medium', notes: 'Child immunization due' },
];

const addHouseholdSchema = z.object({
  headName: z.string().min(1, "Head of household name is required."),
  village: z.string().min(1, "Village is required."),
  members: z.coerce.number().min(1, "Number of members is required."),
});

type AddHouseholdFormValues = z.infer<typeof addHouseholdSchema>;

type ReferredPatient = {
  id: string;
  name: string;
  age: number;
  reason: string;
  priority: 'Emergency' | 'High Risk' | 'Routine';
  referredBy: string;
  waitTime: string;
}

export default function PatientManagementPage() {
    const { toast } = useToast();
    const [households, setHouseholds] = useLocalStorage('households', initialHouseholds);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddHouseholdOpen, setIsAddHouseholdOpen] = useState(false);
    const [referredPatients, setReferredPatients] = useLocalStorage<ReferredPatient[]>('referredPatients', []);


    const filteredHouseholds = households.filter(
        (h) =>
        h.head.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.village.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const form = useForm<AddHouseholdFormValues>({
        resolver: zodResolver(addHouseholdSchema),
    });

    const onAddHousehold = (data: AddHouseholdFormValues) => {
        const newHousehold = {
            id: `HH-${Date.now()}`,
            head: data.headName,
            members: data.members,
            village: data.village,
            risk: 'Low', // Default risk
            notes: ''
        };
        setHouseholds(prev => [...prev, newHousehold]);
        toast({
            title: "Household Added",
            description: `${data.headName}'s household has been registered.`,
        });
        form.reset({ headName: "", village: "", members: undefined });
        setIsAddHouseholdOpen(false);
    }
    
    const getRiskBadgeVariant = (risk: string) => {
        if (risk === 'High') return 'destructive';
        if (risk === 'Medium') return 'secondary';
        return 'default';
    }

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('');
    }

    const handleReferPatient = (household: typeof initialHouseholds[0]) => {
      // Create a mock referred patient object
      const newReferredPatient: ReferredPatient = {
        id: `PAT-REF-${household.id}`,
        name: household.head,
        age: 68, // Mock age
        reason: household.notes || 'High-risk patient identified by ASHA worker',
        priority: household.risk === 'High' ? 'Emergency' : 'High Risk',
        referredBy: 'ASHA Worker',
        waitTime: 'N/A', // Wait time will be calculated in the doctor's queue
      };

      // Check if patient is already referred
      if (referredPatients.some(p => p.id === newReferredPatient.id)) {
        toast({
          variant: 'destructive',
          title: "Already Referred",
          description: `${household.head} is already in the doctor's smart queue.`
        });
        return;
      }
      
      setReferredPatients(prev => [...prev, newReferredPatient]);

      toast({
        title: "Patient Referred!",
        description: `${household.head} has been sent to the doctor's smart queue for immediate attention.`
      });
    }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-primary/5">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6">
              <Button asChild variant="outline">
                <Link href="/asha-dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
              <div>
                <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl flex items-center gap-3">
                  <Users /> Patient Management
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                  Manage households and patient records in your assigned area.
                </p>
              </div>
               <Dialog open={isAddHouseholdOpen} onOpenChange={setIsAddHouseholdOpen}>
                  <DialogTrigger asChild>
                    <Button><UserPlus className="mr-2" /> Add Household</Button>
                  </DialogTrigger>
                  <DialogContent>
                      <DialogHeader>
                          <DialogTitle>Add a New Household</DialogTitle>
                          <DialogDescription>Enter the details below to register a new household.</DialogDescription>
                      </DialogHeader>
                      <Form {...form}>
                          <form onSubmit={form.handleSubmit(onAddHousehold)} className="space-y-4">
                              <FormField
                                  control={form.control}
                                  name="headName"
                                  render={({ field }) => (
                                      <FormItem>
                                          <FormLabel>Head of Household Name</FormLabel>
                                          <FormControl><Input placeholder="e.g., Harpreet Singh" {...field} /></FormControl>
                                          <FormMessage />
                                      </FormItem>
                                  )}
                              />
                               <FormField
                                  control={form.control}
                                  name="village"
                                  render={({ field }) => (
                                      <FormItem>
                                          <FormLabel>Village/Area</FormLabel>
                                          <FormControl><Input placeholder="e.g., Ramgarh" {...field} /></FormControl>
                                          <FormMessage />
                                      </FormItem>
                                  )}
                              />
                               <FormField
                                  control={form.control}
                                  name="members"
                                  render={({ field }) => (
                                      <FormItem>
                                          <FormLabel>Number of Members</FormLabel>
                                          <FormControl><Input type="number" placeholder="e.g., 4" {...field} /></FormControl>
                                          <FormMessage />
                                      </FormItem>
                                  )}
                              />
                              <DialogFooter>
                                  <Button type="submit">Save Household</Button>
                              </DialogFooter>
                          </form>
                      </Form>
                  </DialogContent>
                </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Household List</CardTitle>
                <CardDescription>
                  A list of all households in your area. High-risk households should be referred to a doctor.
                </CardDescription>
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or village..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Head of Household</TableHead>
                      <TableHead>Village</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHouseholds.length > 0 ? (
                      filteredHouseholds.map((household) => (
                        <TableRow key={household.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={`https://i.pravatar.cc/150?u=${household.id}`} />
                                    <AvatarFallback>{getInitials(household.head)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-medium">{household.head}</div>
                                    <div className="text-sm text-muted-foreground">{household.notes}</div>
                                </div>
                            </div>
                          </TableCell>
                          <TableCell>{household.village}</TableCell>
                          <TableCell>{household.members}</TableCell>
                          <TableCell>
                            <Badge variant={getRiskBadgeVariant(household.risk)}>
                              {household.risk}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                           {household.risk === 'Low' ? (
                                <Button variant="outline" size="sm">
                                  View Details <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                           ) : (
                                <Button variant="destructive" size="sm" onClick={() => handleReferPatient(household)}>
                                  <AlertTriangle className="mr-2 h-4 w-4" /> Refer to Doctor
                                </Button>
                           )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No households found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
