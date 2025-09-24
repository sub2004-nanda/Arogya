
"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Faq } from "@/components/faq";
import { Stethoscope, Bot, Video, Pill, Users, HeartHandshake, ArrowRight, FileText, BookHeart } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Stethoscope,
    title: "Book an Appointment",
    description: "Schedule consultations.",
    link: "/appointments",
  },
  {
    icon: Bot,
    title: "AI Symptom Checker",
    description: "Get instant AI insights.",
    link: "/symptom-checker",
  },
   {
    icon: FileText,
    title: "Health Records",
    description: "View your medical history.",
    link: "/health-record",
  },
  {
    icon: Users,
    title: "Family Health",
    description: "Manage family profiles.",
    link: "/family-health",
  },
  {
    icon: Video,
    title: "Video Consultation",
    description: "Connect with a doctor.",
    link: "/video-consultation",
  },
  {
    icon: Pill,
    title: "Find Pharmacies",
    description: "Locate nearby pharmacies.",
    link: "/pharmacies",
  },
  {
    icon: BookHeart,
    title: "Treatment Guide",
    description: "Get AI-powered guides.",
    link: "/treatment-guide",
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
              <div className="mt-10 flex items-center gap-x-4">
                <Button asChild size="lg">
                  <Link href="/appointments">
                    Book Appointment <ArrowRight className="ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link href="/symptom-checker">
                    AI Symptom Checker
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
                                    <Card className="flex flex-col h-full text-left hover:shadow-lg transition-shadow">
                                        <CardHeader>
                                            <div className="bg-primary/10 p-3 rounded-lg w-fit">
                                                <feature.icon className="h-6 w-6 text-primary" />
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex flex-col flex-grow">
                                            <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                                            <p className="mt-2 text-muted-foreground flex-grow">{feature.description}</p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                    
                    <div className="lg:col-span-1">
                        <h2 className="font-headline text-3xl font-bold tracking-tight mb-8">FAQs & Support</h2>
                        <Faq />
                    </div>
                </div>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
