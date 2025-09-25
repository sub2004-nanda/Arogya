
"use client";

import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Users, ClipboardList, Activity, CalendarPlus, Megaphone, QrCode, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ashaFeatures = [
    {
        icon: ClipboardList,
        title: "Field Tasks",
        description: "View your list of assigned patient visits and health surveys.",
        link: "#",
        stat: "5 pending",
        cta: "View Tasks"
    },
    {
        icon: Users,
        title: "Patient Management",
        description: "Access and update health records for community members.",
        link: "#",
        stat: "85 households",
        cta: "Manage Patients"
    },
    {
        icon: Activity,
        title: "Vitals Collection",
        description: "Record patient vitals like BP and temperature during visits.",
        link: "#",
        stat: "Offline Ready",
        cta: "Collect Vitals"
    },
    {
        icon: CalendarPlus,
        title: "Appointment Assistance",
        description: "Help community members book appointments with doctors.",
        link: "/appointments",
        stat: "New Booking",
        cta: "Book Appointment"
    },
    {
        icon: Megaphone,
        title: "Health Campaigns",
        description: "Get information on current and upcoming health campaigns.",
        link: "#",
        stat: "2 Active",
        cta: "View Campaigns"
    },
    {
        icon: QrCode,
        title: "Scan Patient QR",
        description: "Quickly verify and pull up patient records by scanning their QR code.",
        link: "/doctor-dashboard/qr-scanner",
        stat: "Verify",
        cta: "Scan QR"
    }
];

export default function AshaDashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-primary/5">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">ASHA Worker Dashboard</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Your hub for managing community health tasks and patient information.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {ashaFeatures.map((feature) => (
                 <Card key={feature.title} className="flex flex-col text-left transition-shadow hover:shadow-xl">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="bg-primary/10 p-3 rounded-lg w-fit">
                                <feature.icon className="h-6 w-6 text-primary" />
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold">{feature.stat.split(' ')[0]}</p>
                                <p className="text-xs text-muted-foreground">{feature.stat.split(' ').slice(1).join(' ')}</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <CardTitle className="text-xl font-semibold">
                            {feature.title}
                        </CardTitle>
                        <p className="mt-2 text-muted-foreground">
                            {feature.description}
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Button asChild className="w-full">
                            <Link href={feature.link}>
                                {feature.cta} <ArrowRight className="ml-2" />
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
              ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
