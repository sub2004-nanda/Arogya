
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ClipboardList, BarChart, Bell, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const features = [
    {
        icon: Package,
        title: "Inventory",
        description: "Manage your medicine stock, add new items, and track expiry dates.",
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
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-primary/5">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">Pharmacy Dashboard</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Welcome to your pharmacy management hub.
            </p>
          </div>
          <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(feature => (
                  <Card key={feature.title} className="flex flex-col">
                      <CardHeader>
                          <div className="flex items-center gap-3">
                              <div className="bg-primary/10 p-3 rounded-lg w-fit">
                                <feature.icon className="h-6 w-6 text-primary" />
                              </div>
                              <CardTitle>{feature.title}</CardTitle>
                          </div>
                          <CardDescription className="pt-2">{feature.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow flex items-end">
                         <Button asChild className="w-full">
                            <Link href={feature.link}>
                                {feature.cta} <ArrowRight className="ml-2"/>
                            </Link>
                         </Button>
                      </CardContent>
                  </Card>
              ))}
          </div>
           <div className="mt-10 text-center text-muted-foreground">
              <p>More pharmacy-specific features are coming soon. Stay tuned!</p>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
