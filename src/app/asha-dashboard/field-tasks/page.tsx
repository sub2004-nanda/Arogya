
"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, ClipboardList, ArrowLeft } from "lucide-react";
import { format, addDays } from "date-fns";

const mockTasks = [
  {
    id: "task-1",
    type: "Patient Visit",
    subject: "Sunita Kaur - Post-natal checkup",
    location: "House #12, Ramgarh Village",
    status: "Pending",
    dueDate: addDays(new Date(), 2),
  },
  {
    id: "task-2",
    type: "Health Survey",
    subject: "Household Water Source Survey",
    location: "Alipur Village, Sector 3",
    status: "Pending",
    dueDate: addDays(new Date(), 3),
  },
  {
    id: "task-3",
    type: "Patient Visit",
    subject: "Ramesh Singh - Blood Pressure Monitoring",
    location: "House #45, Ramgarh Village",
    status: "Pending",
    dueDate: addDays(new Date(), 1),
  },
  {
    id: "task-4",
    type: "Patient Visit",
    subject: "Geeta Devi - Immunization Reminder",
    location: "House #8, Alipur Village",
    status: "Completed",
    dueDate: addDays(new Date(), -1),
  },
  {
    id: "task-5",
    type: "Health Survey",
    subject: "Nutrition Habits Survey",
    location: "Community Center, Ramgarh",
    status: "Pending",
    dueDate: addDays(new Date(), 5),
  },
];

export default function FieldTasksPage() {

    const getStatusVariant = (status: string) => {
        switch(status) {
            case "Pending": return "destructive";
            case "Completed": return "secondary";
            default: return "default";
        }
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
                        <div className="text-center mb-10">
                            <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl flex items-center justify-center gap-3">
                                <ClipboardList /> Field Tasks
                            </h1>
                            <p className="mt-4 text-lg text-muted-foreground">
                                A list of your assigned patient visits and health surveys.
                            </p>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Task List</CardTitle>
                                <CardDescription>Here are your current and past tasks. Prioritize the pending items.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Task</TableHead>
                                            <TableHead>Location</TableHead>
                                            <TableHead>Due Date</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {mockTasks.sort((a,b) => a.dueDate.getTime() - b.dueDate.getTime()).map(task => (
                                            <TableRow key={task.id} className={task.status === 'Pending' ? 'font-medium' : ''}>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span>{task.subject}</span>
                                                        <span className="text-xs text-muted-foreground">{task.type}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{task.location}</TableCell>
                                                <TableCell>{format(task.dueDate, "PPP")}</TableCell>
                                                <TableCell>
                                                    <Badge variant={getStatusVariant(task.status)}>{task.status}</Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button size="sm" disabled={task.status === 'Completed'}>
                                                        {task.type === 'Patient Visit' ? 'Start Visit' : 'Start Survey'} 
                                                        <ArrowRight className="ml-2 h-4 w-4"/>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
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
