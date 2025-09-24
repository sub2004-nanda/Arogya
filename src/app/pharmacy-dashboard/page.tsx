
"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Package, ClipboardList, BarChart, Bell, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import { PlaceHolderImages } from "@/lib/placeholder-images";


const features = [
    {
        icon: Package,
        title: "Inventory Management",
        description: "Manage medicine stock, add new items, and track expiry dates.",
        link: "#",
        cta: "Manage Inventory",
    },
    {
        icon: ClipboardList,
        title: "Orders & Reservations",
        description: "View and process incoming orders and patient reservations.",
        link: "#",
        cta: "View Orders",
    },
    {
        icon: Bell,
        title: "Nearby Requests",
        description: "See real-time requests for medicines from nearby patients.",
        link: "#",
        cta: "Check Requests",
    },
    {
        icon: BarChart,
        title: "Sales Analytics",
        description: "Analyze your sales data, top-selling items, and revenue.",
        link: "#",
        cta: "View Analytics",
    },
    {
        icon: User,
        title: "Pharmacy Profile",
        description: "Update your pharmacy's details, hours, and contact information.",
        link: "#",
        cta: "Edit Profile",
    }
];

export default function PharmacyDashboardPage() {
    const { user } = useAuth();
    const heroImage = PlaceHolderImages.find((img) => img.id === 'pharmacy-dashboard-hero');

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
                    Welcome, {user?.name}!
                </h1>
                <p className="mt-6 text-lg leading-8 text-foreground/80">
                    This is your pharmacy management hub. Here you can manage your inventory, process orders, and view analytics.
                </p>
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section className="bg-primary/5 py-20 sm:py-24">
            <div className="container mx-auto px-4">
                 <div className="mx-auto max-w-2xl text-center">
                    <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">Your Management Hub</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        All the tools you need to run your pharmacy efficiently.
                    </p>
                </div>
                <div className="mx-auto mt-16 grid max-w-none grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map(feature => (
                        <Card key={feature.title} className="flex flex-col text-left transition-shadow hover:shadow-xl">
                            <CardHeader>
                                <div className="bg-primary/10 p-3 rounded-lg w-fit">
                                    <feature.icon className="h-6 w-6 text-primary" />
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                                <CardDescription className="pt-2">{feature.description}</CardDescription>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full">
                                    <Link href={feature.link}>
                                        {feature.cta} <ArrowRight className="ml-2"/>
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
