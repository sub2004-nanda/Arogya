
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowRight, UserPlus, ArrowLeft } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useLocalStorage } from '@/hooks/use-local-storage';

type ReferredPatient = {
  id: string;
  name: string;
  age: number;
  reason: string;
  priority: 'Emergency' | 'High Risk' | 'Routine';
  referredBy: string;
  waitTime: string;
}

const initialSmartQueue: ReferredPatient[] = [
  { id: 'PAT-EMG-001', name: 'Sunita Sharma', age: 65, reason: 'Chest Pain, Shortness of Breath', priority: 'Emergency', referredBy: 'ASHA Worker', waitTime: '5 mins' },
  { id: 'PAT-HR-002', name: 'Rajesh Kumar', age: 58, reason: 'High Blood Pressure Reading (180/120)', priority: 'High Risk', referredBy: 'Self', waitTime: '15 mins' },
];

const realTimeQueuePatients = [
  { id: 'PAT-REG-003', name: 'Anita Verma', age: 34, reason: 'Follow-up Consultation', priority: 'Routine', waitTime: '25 mins' },
  { id: 'PAT-REG-004', name: 'Rohan Joshi', age: 28, reason: 'Common Cold & Cough', priority: 'Routine', waitTime: '30 mins' },
  { id: 'PAT-REG-005', name: 'Priya Singh', age: 45, reason: 'Annual Health Checkup', priority: 'Routine', waitTime: '40 mins' },
  { id: 'PAT-REG-006', name: 'Karan Mehta', age: 19, reason: 'Minor Sports Injury', priority: 'Routine', waitTime: '45 mins' },
];

const getPriorityBadge = (priority: string) => {
    switch (priority) {
        case 'Emergency': return 'destructive';
        case 'High Risk': return 'secondary';
        default: return 'outline';
    }
}

export default function PatientQueuePage() {
  const [referredPatients] = useLocalStorage<ReferredPatient[]>('referredPatients', []);
  const [smartQueue, setSmartQueue] = useState(initialSmartQueue);

  useEffect(() => {
    // Combine initial mock data with data from localStorage
    const combinedQueue = [...initialSmartQueue];
    referredPatients.forEach(p => {
        if (!combinedQueue.some(sq => sq.id === p.id)) {
            combinedQueue.push(p);
        }
    });
    setSmartQueue(combinedQueue);
  }, [referredPatients]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-primary/5">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6">
                <Button asChild variant="outline">
                    <Link href="/doctor-dashboard">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </Button>
            </div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">Patient Queue</h1>
                    <p className="mt-2 text-lg text-muted-foreground">Manage your patient flow for the day.</p>
                </div>
                 <Button>
                    <UserPlus className="mr-2" /> Add Patient to Queue
                </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-8">
                {/* Smart Queue */}
                <Card className="border-destructive/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-destructive">
                            <AlertCircle /> Smart Queue (Priority Cases)
                        </CardTitle>
                        <CardDescription>Emergency and high-risk patients, including referrals from ASHA workers, are shown here first.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Patient</TableHead>
                                    <TableHead>Reason for Visit</TableHead>
                                    <TableHead>Priority</TableHead>
                                    <TableHead>Referred By</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {smartQueue.length > 0 ? smartQueue.map(patient => (
                                <TableRow key={patient.id} className="bg-destructive/5 hover:bg-destructive/10">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={`https://i.pravatar.cc/150?u=${patient.id}`} />
                                                <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{patient.name}</div>
                                                <div className="text-sm text-muted-foreground">Age: {patient.age}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{patient.reason}</TableCell>
                                    <TableCell><Badge variant={getPriorityBadge(patient.priority)}>{patient.priority}</Badge></TableCell>
                                    <TableCell>{patient.referredBy}</TableCell>
                                    <TableCell className="text-right">
                                         <Button size="sm">Start Consultation <ArrowRight className="ml-2"/></Button>
                                    </TableCell>
                                </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center">No priority cases at the moment.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Real-time Queue */}
                <Card>
                    <CardHeader>
                        <CardTitle>Real-time Patient Queue</CardTitle>
                        <CardDescription>Live updated list of patients waiting for consultation.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>#</TableHead>
                                    <TableHead>Patient</TableHead>
                                    <TableHead>Reason for Visit</TableHead>
                                    <TableHead>Wait Time</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {realTimeQueuePatients.map((patient, index) => (
                                <TableRow key={patient.id}>
                                    <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                                    <TableCell>
                                        <div className="font-medium">{patient.name}</div>
                                        <div className="text-sm text-muted-foreground">Age: {patient.age}</div>
                                    </TableCell>
                                    <TableCell>{patient.reason}</TableCell>
                                    <TableCell>{patient.waitTime}</TableCell>
                                    <TableCell className="text-right">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="outline" size="sm">Start Consultation <ArrowRight className="ml-2"/></Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                <p>Start consultation for {patient.name}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </TableCell>
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
