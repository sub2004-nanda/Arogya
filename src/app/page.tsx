
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowRight, Bot, Calendar, Home, LogOut, Stethoscope, Pill } from "lucide-react";
import { Footer } from "@/components/footer";

const features = [
  {
    icon: Calendar,
    title: "Easy Appointments",
    description: "Book and manage appointments with specialists in just a few clicks.",
    link: "/appointments",
  },
  {
    icon: Bot,
    title: "AI Symptom Checker",
    description: "Get instant insights into your health concerns with our AI-powered tool.",
    link: "/symptom-checker",
  },
  {
    icon: Stethoscope,
    title: "Video Consultations",
    description: "Connect with doctors from the comfort of your home via video call.",
    link: "/video-consultation",
  },
  {
    icon: Pill,
    title: "Find Pharmacies",
    description: "Locate nearby pharmacies and check for medicine availability.",
    link: "/pharmacies",
  },
];


export default function LandingPage() {
  const { user, logout } = useAuth();
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-home');

  return (
    <div className="flex min-h-screen flex-col bg-background">
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2">
                    <Logo className="h-10 w-auto" />
                </Link>
                <div className="flex items-center gap-2">
                  <Button asChild variant="ghost">
                      <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild>
                      <Link href="/signup">Sign Up</Link>
                  </Button>
                </div>
            </div>
        </header>

        <main className="flex-1">
            {/* Hero Section */}
            <section className="relative py-20 sm:py-32">
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
                           Your Health, Connected To Arogya.
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-foreground/80">
                           Arogya provides a seamless healthcare experience, from booking appointments to instant AI-powered symptom checks, all in your language.
                        </p>
                        <div className="mt-10 flex items-center gap-x-6">
                            <Button asChild size="lg">
                                <Link href="/signup">
                                    Get Started <ArrowRight className="ml-2"/>
                                </Link>
                            </Button>
                             <Button asChild size="lg" variant="link">
                                <Link href="/login">
                                    Log In <span aria-hidden="true">→</span>
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-primary/5 py-20 sm:py-24">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">Everything you need for better health</h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Arogya brings comprehensive healthcare services to your fingertips.
                        </p>
                    </div>
                    <div className="mx-auto mt-16 grid max-w-none grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {features.map((feature) => (
                            <Card key={feature.title} className="flex flex-col items-start text-left hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="bg-primary/10 p-3 rounded-lg">
                                      <feature.icon className="h-6 w-6 text-primary" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                                    <p className="mt-2 text-muted-foreground">{feature.description}</p>
                                </CardContent>
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
