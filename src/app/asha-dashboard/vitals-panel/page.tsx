
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Activity, ArrowLeft, HeartPulse, Wind, Thermometer, Save } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const mockPatients = [
  { id: "pat-1", name: "Sunita Kaur" },
  { id: "pat-2", name: "Ramesh Singh" },
  { id: "pat-3", name: "Geeta Devi" },
];

export default function VitalsPanelPage() {
    const { toast } = useToast();
    const [selectedPatient, setSelectedPatient] = useState("");
    const [bpSystolic, setBpSystolic] = useState("");
    const [bpDiastolic, setBpDiastolic] = useState("");
    const [heartRate, setHeartRate] = useState("");
    const [temperature, setTemperature] = useState("");
    const [oxygen, setOxygen] = useState("");

    const handleSaveVitals = () => {
        if (!selectedPatient) {
            toast({ variant: "destructive", title: "Please select a patient." });
            return;
        }

        // Basic validation
        if (!bpSystolic || !bpDiastolic || !heartRate || !temperature || !oxygen) {
            toast({ variant: "destructive", title: "Please fill all vital fields." });
            return;
        }

        console.log("Saving Vitals for patient:", selectedPatient, {
            bloodPressure: `${bpSystolic}/${bpDiastolic}`,
            heartRate,
            temperature,
            oxygenSaturation: oxygen,
        });

        toast({
            title: "Vitals Saved",
            description: `Vitals for ${mockPatients.find(p => p.id === selectedPatient)?.name} have been recorded locally.`,
        });

        // Reset form
        setSelectedPatient("");
        setBpSystolic("");
        setBpDiastolic("");
        setHeartRate("");
        setTemperature("");
        setOxygen("");
    };

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 bg-primary/5">
                <div className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="mx-auto max-w-2xl">
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
                                <Activity /> Vitals Panel
                            </h1>
                            <p className="mt-4 text-lg text-muted-foreground">
                                Record patient vitals during a field visit. This data can be synced later.
                            </p>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Record Vitals</CardTitle>
                                <CardDescription>Select a patient and enter their latest vital signs.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <Label htmlFor="patient-select">Patient</Label>
                                    <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                                        <SelectTrigger id="patient-select">
                                            <SelectValue placeholder="Select patient from visit list" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mockPatients.map(patient => (
                                                <SelectItem key={patient.id} value={patient.id}>{patient.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-4 rounded-lg border p-4">
                                     <h3 className="text-lg font-medium flex items-center gap-2"><Activity className="h-5 w-5"/> Blood Pressure</h3>
                                     <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="bp-systolic">Systolic (mmHg)</Label>
                                            <Input id="bp-systolic" type="number" placeholder="e.g., 120" value={bpSystolic} onChange={e => setBpSystolic(e.target.value)} />
                                        </div>
                                        <div>
                                            <Label htmlFor="bp-diastolic">Diastolic (mmHg)</Label>
                                            <Input id="bp-diastolic" type="number" placeholder="e.g., 80" value={bpDiastolic} onChange={e => setBpDiastolic(e.target.value)} />
                                        </div>
                                     </div>
                                </div>
                                <div className="space-y-4 rounded-lg border p-4">
                                    <h3 className="text-lg font-medium flex items-center gap-2"><HeartPulse className="h-5 w-5"/> Heart Rate</h3>
                                    <div>
                                        <Label htmlFor="heart-rate">Beats Per Minute (BPM)</Label>
                                        <Input id="heart-rate" type="number" placeholder="e.g., 72" value={heartRate} onChange={e => setHeartRate(e.target.value)} />
                                    </div>
                                </div>
                               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                 <div className="space-y-4 rounded-lg border p-4">
                                        <h3 className="text-lg font-medium flex items-center gap-2"><Thermometer className="h-5 w-5"/> Temperature</h3>
                                        <div>
                                            <Label htmlFor="temperature">Fahrenheit (°F)</Label>
                                            <Input id="temperature" type="number" placeholder="e.g., 98.6" step="0.1" value={temperature} onChange={e => setTemperature(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="space-y-4 rounded-lg border p-4">
                                        <h3 className="text-lg font-medium flex items-center gap-2"><Wind className="h-5 w-5"/> Oxygen Saturation</h3>
                                        <div>
                                            <Label htmlFor="oxygen">SpO2 (%)</Label>
                                            <Input id="oxygen" type="number" placeholder="e.g., 98" value={oxygen} onChange={e => setOxygen(e.target.value)} />
                                        </div>
                                    </div>
                               </div>

                                <Button onClick={handleSaveVitals} className="w-full">
                                    <Save className="mr-2" />
                                    Save Vitals Locally
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
