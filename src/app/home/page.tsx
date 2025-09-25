
"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Faq } from "@/components/faq";
import { Stethoscope, Bot, Video, Pill, Users, HeartHandshake, ArrowRight, FileText, BookHeart } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";


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
   {
    icon: HeartHandshake,
    title: "Community Hub",
    description: "Explore health schemes.",
    link: "/community",
  },
];

const announcements = [
    {
        id: "feat-visual-analyzer",
        title: "Visual Symptom Analyzer",
        description: "Have a visible symptom like a rash or swelling? Upload a photo for our AI to analyze.",
        link: "/symptom-checker",
        linkText: "Analyze Photo"
    },
    {
        id: "feat-symptom-checker",
        title: "Feeling Unwell?",
        description: "Use our AI Symptom Checker for instant insights. Describe your symptoms and get guidance on potential next steps.",
        link: "/symptom-checker",
        linkText: "Try the Checker",
    },
    {
        id: "feat-video-consult",
        title: "Video Consultations",
        description: "Connect with a qualified doctor from the comfort of your home. No travel, no waiting rooms.",
        link: "/video-consultation",
        linkText: "Start a Call",
    },
    {
        id: "feat-health-records",
        title: "Your Health, Organized",
        description: "Access your complete medical history, including past diagnoses, prescriptions, and test reports, anytime.",
        link: "/health-record",
        linkText: "View Records",
    },
]

export default function HomePage() {
  const { user } = useAuth();
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-home');
  const announcementsWithImages = announcements.map(item => ({
    ...item,
    image: PlaceHolderImages.find(img => img.id === item.id)
  }));


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

         {/* Announcements Carousel */}
        <section className="py-20 sm:py-24">
            <div className="container mx-auto px-4">
                 <h2 className="text-center font-headline text-3xl font-bold tracking-tight mb-8">What's New at Arogya</h2>
                 <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    plugins={[
                        Autoplay({
                          delay: 5000,
                        }),
                    ]}
                    className="w-full"
                    >
                    <CarouselContent>
                        {announcementsWithImages.map((item) => (
                        <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
                           <Card className="overflow-hidden h-full flex flex-col">
                             <CardContent className="flex flex-col flex-grow p-6">
                                {item.image && (
                                    <div className="mb-4 -mx-6 -mt-6">
                                        <Image src={item.image.imageUrl} alt={item.image.description} width={600} height={400} className="w-full h-auto object-cover"/>
                                    </div>
                                )}
                                <CardTitle>{item.title}</CardTitle>
                                <p className="text-muted-foreground mt-2 mb-4 flex-grow">{item.description}</p>
                                <Button asChild>
                                    <Link href={item.link}>{item.linkText} <ArrowRight className="ml-2"/></Link>
                                </Button>
                             </CardContent>
                           </Card>
                        </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </section>


        {/* Features Section */}
        <section className="bg-primary/5 py-20 sm:py-24">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <h2 className="font-headline text-3xl font-bold tracking-tight mb-8">What would you like to do?</h2>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
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
