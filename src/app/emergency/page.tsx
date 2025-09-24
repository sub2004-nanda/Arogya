import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Siren } from "lucide-react";

export default function EmergencyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-destructive/10">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <Siren className="mx-auto h-16 w-16 text-destructive" />
            <h1 className="mt-4 font-headline text-4xl font-bold tracking-tight text-destructive sm:text-5xl">
              Emergency Assistance
            </h1>
            <p className="mt-6 text-lg text-foreground">
              If this is a life-threatening emergency, please call your local emergency number immediately.
            </p>
            <div className="mt-10">
              <Button asChild size="lg" variant="destructive" className="w-full sm:w-auto">
                <a href="tel:911">
                  <Phone className="mr-2 h-5 w-5" /> Call 911 Now
                </a>
              </Button>
            </div>
          </div>

          <div className="mx-auto mt-16 max-w-4xl">
            <h2 className="text-center font-headline text-2xl font-bold">
              Emergency Contacts
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>National Suicide Prevention Lifeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Available 24 hours. Languages: English, Spanish.
                  </p>
                  <Button asChild variant="outline" className="mt-4 w-full">
                    <a href="tel:988">Call 988</a>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Poison Control Center</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    24/7 assistance with poisoning emergencies.
                  </p>
                  <Button asChild variant="outline" className="mt-4 w-full">
                    <a href="tel:1-800-222-1222">Call 1-800-222-1222</a>
                  </Button>
                </CardContent>
              </Card>
            </div>
            <p className="mt-8 text-center text-sm text-muted-foreground">
                ArogyaSetu is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
