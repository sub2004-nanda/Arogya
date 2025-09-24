
"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HealthTips } from "@/components/health-tips";
import { Stethoscope, Bot, Video, Pill, Users, HeartHandshake, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Stethoscope,
    title: "Book an Appointment",
    description: "Schedule consultations.",
    link: "/appointments",
    bg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: Bot,
    title: "AI Symptom Checker",
    description: "Get instant AI insights.",
    link: "/symptom-checker",
    bg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    icon: Video,
    title: "Video Consultation",
    description: "Connect with a doctor.",
    link: "/video-consultation",
    bg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    icon: Pill,
    title: "Find Pharmacies",
    description: "Locate nearby pharmacies.",
    link: "/pharmacies",
    bg: "bg-red-100",
    iconColor: "text-red-600",
  },
  {
    icon: Users,
    title: "Family Health",
    description: "Manage family profiles.",
    link: "/family-health",
    bg: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    icon: HeartHandshake,
    title: "Community Hub",
    description: "Health schemes & info.",
    link: "/community",
    bg: "bg-teal-100",
    iconColor: "text-teal-600",
  },
];

export default function HomePage() {
  const { user } = useAuth();
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-home');

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
                Your personal health dashboard. Here you can manage appointments, check symptoms, and explore health resources.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <Button asChild size="lg">
                  <Link href="/appointments">
                    Book Appointment <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-primary/5 py-20 sm:py-24">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <h2 className="font-headline text-3xl font-bold tracking-tight mb-8">What would you like to do?</h2>
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
                        <h2 className="font-headline text-3xl font-bold tracking-tight mb-8">Health & Wellness</h2>
                        <HealthTips />
                    </div>
                </div>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
