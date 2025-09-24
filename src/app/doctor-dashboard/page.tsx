
"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Calendar, Users, Video, ArrowRight, NotebookPen, Bot } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const features = [
  {
    icon: Calendar,
    title: "Upcoming Appointments",
    description: "View and manage your daily schedule.",
    link: "#",
    stat: "5 today",
    cta: "View Schedule",
  },
  {
    icon: Users,
    title: "Patient Queue",
    description: "Manage real-time and smart patient queues.",
    link: "/doctor-dashboard/patient-queue",
    stat: "12 waiting",
    cta: "Manage Queue",
  },
   {
    icon: Bot,
    title: "AI Patient Insights",
    description: "Get AI summaries of patient health.",
    link: "/doctor-dashboard/ai-insights",
    stat: "Review",
    cta: "Analyze",
  },
  {
    icon: Video,
    title: "Video Consultations",
    description: "Start or join video calls with patients.",
    link: "/video-consultation",
    stat: "2 pending",
    cta: "Start Call",
  },
  {
    icon: NotebookPen,
    title: "Quick Notes",
    description: "Jot down notes for patient records.",
    link: "/doctor-dashboard/quick-notes",
    stat: "Add Notes",
    cta: "Add Note",
  },
];

export default function DoctorDashboardPage() {
  const { user } = useAuth();
  const heroImage = PlaceHolderImages.find((img) => img.id === 'doctor-dashboard-hero');

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        {/* Hero Section */}
        <section className="relative py-20 sm:py-28">
            {heroImage && (
                <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                priority
                data-ai-hint={heroImage.imageHint}
                />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/50 to-transparent" />

            <div className="container relative mx-auto px-4 text-left">
                <div className="max-w-2xl">
                <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                    Welcome back, {user?.name}!
                </h1>
                <p className="mt-6 text-lg leading-8 text-foreground/80">
                    Here is your professional dashboard. Manage appointments, review patient records, and start consultations.
                </p>
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section className="bg-primary/5 py-20 sm:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">Your Professional Hub</h2>
                <p className="mt-4 text-lg text-muted-foreground">
                    Everything you need for a productive day, right at your fingertips.
                </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-none grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
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
        </section>
      </main>
      <Footer />
    </div>
  );
}
