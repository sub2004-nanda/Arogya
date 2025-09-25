
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bell, PackageCheck, ShoppingCart } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

type MedicineRequest = {
    id: string;
    patientName: string;
    medicine: string;
    quantity: number;
    requestedBy: string; // ASHA Worker's name
    status: 'Pending' | 'Reserved' | 'Ordered';
};

const initialRequests: MedicineRequest[] = [
    { id: 'req-1', patientName: 'Ramesh Singh', medicine: 'Amlodipine 5mg', quantity: 30, requestedBy: 'Geeta Devi', status: 'Pending' },
    { id: 'req-2', patientName: 'Sunita Kaur', medicine: 'Folic Acid', quantity: 60, requestedBy: 'Geeta Devi', status: 'Pending' },
    { id: 'req-3', patientName: 'Priya Sharma', medicine: 'Paracetamol Syrup', quantity: 1, requestedBy: 'Seema Rani', status: 'Pending' },
    { id: 'req-4', patientName: 'Amit Kumar', medicine: 'Digene Antacid', quantity: 1, requestedBy: 'Geeta Devi', status: 'Pending' },
    { id: 'req-5', patientName: 'Rakesh Sharma', medicine: 'Aspirin 75mg', quantity: 30, requestedBy: 'Seema Rani', status: 'Pending' },
];


export default function RequestsPage() {
    const { toast } = useToast();
    const [requests, setRequests] = useState<MedicineRequest[]>(initialRequests);

    const handleAction = (requestId: string, action: 'Reserve' | 'Order') => {
        const newStatus = action === 'Reserve' ? 'Reserved' : 'Ordered';
        setRequests(prevRequests => 
            prevRequests.map(req => 
                req.id === requestId ? { ...req, status: newStatus } : req
            )
        );
        
        toast({
            title: `Request ${newStatus}!`,
            description: `The medicine has been marked as ${newStatus.toLowerCase()}.`,
        });
    };

    const getStatusBadgeVariant = (status: string) => {
        if (status === 'Pending') return 'destructive';
        if (status === 'Reserved') return 'default';
        if (status === 'Ordered') return 'secondary';
        return 'outline';
    }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-primary/5">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-4xl">
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
                <Bell /> Nearby Requests
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                See real-time requests for medicines from nearby patients and ASHA workers.
              </p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Incoming Medicine Requests</CardTitle>
                <CardDescription>Review the pending requests and take action to reserve or order the medicines.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Patient</TableHead>
                            <TableHead>Medicine</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.length > 0 ? (
                            requests.map(req => (
                                <TableRow key={req.id}>
                                    <TableCell>
                                        <div className="font-medium">{req.patientName}</div>
                                        <div className="text-sm text-muted-foreground">Requested by: {req.requestedBy}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div>{req.medicine}</div>
                                        <div className="text-sm text-muted-foreground">Qty: {req.quantity}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusBadgeVariant(req.status)}>{req.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {req.status === 'Pending' ? (
                                            <div className="flex gap-2 justify-end">
                                                <Button size="sm" onClick={() => handleAction(req.id, 'Reserve')}>
                                                    <PackageCheck className="mr-2 h-4 w-4"/> Reserve
                                                </Button>
                                                <Button size="sm" variant="outline" onClick={() => handleAction(req.id, 'Order')}>
                                                    <ShoppingCart className="mr-2 h-4 w-4"/> Order
                                                </Button>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-muted-foreground">Action Taken</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24">No pending requests.</TableCell>
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
