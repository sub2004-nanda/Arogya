import Link from 'next/link';
import {
  Stethoscope,
  Pill,
  CalendarPlus,
  Users,
  HeartPulse,
  Contact,
} from 'lucide-react';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HealthTips } from '@/components/health-tips';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

const features = [
  {
    title: 'AI Symptom Checker',
    description: 'Get potential causes for your symptoms.',
    href: '/symptom-checker',
    icon: Stethoscope,
  },
  {
    title: 'Book Appointment',
    description: 'Schedule a consultation with a doctor.',
    href: '/appointments',
    icon: CalendarPlus,
  },
  {
    title: 'Health Records',
    description: 'View and manage your health records.',
    href: '/health-record',
    icon: HeartPulse,
  },
  {
    title: 'Family Health Profile',
    description: 'Manage health profiles for your family.',
    href: '/family-health',
    icon: Contact,
  },
  {
    title: 'Find a Pharmacy',
    description: 'Locate nearby pharmacies and check stock.',
    href: '/pharmacies',
    icon: Pill,
  },
  {
    title: 'Community & Health Hub',
    description: 'Connect with others and stay informed on health topics.',
    href: '/community',
    icon: Users,
  },
];

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-home');

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-primary/5 py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
              <div className="text-center lg:text-left">
                <p className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">Your Health, Connected</p>
                <h1 className="mt-4 font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  ArogyaSetu Healthcare Platform
                </h1>
                <p className="mt-6 text-lg leading-8 text-muted-foreground">
                  Access quality care, book appointments, check symptoms, and find pharmacies, even with low connectivity.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                  <Button asChild size="lg">
                    <Link href="/appointments">Book an Appointment</Link>
                  </Button>
                  <Button asChild variant="ghost" size="lg">
                    <Link href="/symptom-checker">Check Symptoms <span aria-hidden="true" className="ml-2">→</span></Link>
                  </Button>
                </div>
              </div>
              <div className="relative h-64 w-full overflow-hidden rounded-2xl shadow-xl sm:h-80 lg:h-96">
                 {heroImage && (
                  <div
                    className="h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${heroImage.imageUrl})` }}
                    data-ai-hint={heroImage.imageHint}
                  >
                     <div className="h-full w-full bg-gradient-to-t from-background/50 to-transparent"></div>
                  </div>
                 )}
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Comprehensive Healthcare at Your Fingertips</h2>
              <p className="mt-4 text-lg text-muted-foreground">Everything you need to manage your health, all in one place.</p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Link href={feature.href} key={feature.title} className="group">
                  <Card className="h-full transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center gap-4">
                      <div className="rounded-lg bg-primary/10 p-3 text-primary">
                        <feature.icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="font-headline">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-primary/5 py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Localized Health & Wellness Tips</h2>
              <p className="mt-4 text-lg text-muted-foreground">Stay informed with health advice adapted for you.</p>
            </div>
            <div className="mt-8 mx-auto max-w-2xl">
              <HealthTips />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
