
"use client";

import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Calendar, Users, Video, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Upcoming Appointments",
    description: "View and manage your schedule.",
    link: "#", // These links can be updated to point to real pages later
    stat: "5 today",
  },
  {
    icon: Users,
    title: "My Patients",
    description: "Access patient records and history.",
    link: "#",
    stat: "120 active",
  },
  {
    icon: Video,
    title: "Video Consultations",
    description: "Start or join video calls with patients.",
    link: "/video-consultation",
    stat: "2 pending",
  },
];

export default function DoctorDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-primary/5">
        {/* Welcome Section */}
        <section className="bg-background py-12">
          <div className="container mx-auto px-4">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Welcome back, {user?.name}!
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Here's your dashboard to manage your day.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 font-headline text-3xl font-bold">
              Your Dashboard
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Link href={feature.link} key={feature.title} className="group">
                  <Card className="flex h-full flex-col text-left transition-shadow hover:shadow-lg">
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
                    <CardContent className="flex flex-1 flex-col">
                      <CardTitle className="text-xl font-semibold">
                        {feature.title}
                      </CardTitle>
                      <p className="mt-2 flex-grow text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
             <div className="mt-12 text-center text-muted-foreground">
                <p>More features and detailed views are coming soon!</p>
             </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
