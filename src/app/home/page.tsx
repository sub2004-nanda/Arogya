
"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HealthTips } from "@/components/health-tips";
import { Stethoscope, Bot, Video, Pill, Users, HeartHandshake } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const features = [
  {
    icon: Stethoscope,
    title: "Book an Appointment",
    description: "Schedule in-person or video consultations with specialists.",
    link: "/appointments",
    bg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: Bot,
    title: "AI Symptom Checker",
    description: "Get instant insights into your health concerns with our AI tool.",
    link: "/symptom-checker",
    bg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    icon: Video,
    title: "Video Consultation",
    description: "Connect with a doctor instantly for non-emergency issues.",
    link: "/video-consultation",
    bg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    icon: Pill,
    title: "Find Pharmacies",
    description: "Locate nearby pharmacies and check for medicine availability.",
    link: "/pharmacies",
    bg: "bg-red-100",
    iconColor: "text-red-600",
  },
  {
    icon: Users,
    title: "Family Health",
    description: "Manage health profiles and appointments for your family members.",
    link: "/family-health",
    bg: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    icon: HeartHandshake,
    title: "Community Hub",
    description: "Learn about health schemes and awareness campaigns.",
    link: "/community",
    bg: "bg-teal-100",
    iconColor: "text-teal-600",
  },
];

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-primary/5">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="mb-12">
            <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
              Welcome back, {user?.name}!
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Your personal health dashboard. What would you like to do today?
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                {features.map((feature) => (
                  <Link href={feature.link} key={feature.title} className="group">
                    <Card className="h-full transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
                      <CardHeader>
                        <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg ${feature.bg}`}>
                          <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                        </div>
                        <CardTitle>{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-1">
                 <Card>
                    <CardHeader>
                        <CardTitle>Health & Wellness Tips</CardTitle>
                        <CardDescription>Stay informed with tips in your local dialect.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <HealthTips />
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
