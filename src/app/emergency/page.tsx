"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Siren, MapPin, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function EmergencyPage() {
  const { toast } = useToast();
  const [isDispatching, setIsDispatching] = useState(false);

  const handleEmergencyDispatch = () => {
    setIsDispatching(true);
    
    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        title: "Geolocation Not Supported",
        description: "Your browser does not support geolocation.",
      });
      setIsDispatching(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const patientId = `P${Date.now()}`;

        // In a real application, you would send this data to an emergency service API.
        console.log("Dispatching emergency services for:", {
          patientId,
          location: { latitude, longitude },
        });

        toast({
          title: "Emergency Services Dispatched!",
          description: (
            <div>
              <p>Help is on the way to your current location.</p>
              <p className="font-semibold">Patient ID: {patientId}</p>
              <p className="text-xs">Location: {latitude.toFixed(4)}, {longitude.toFixed(4)}</p>
            </div>
          ),
        });
        setIsDispatching(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast({
          variant: "destructive",
          title: "Could Not Get Location",
          description: "Please ensure location services are enabled in your browser and try again.",
        });
        setIsDispatching(false);
      }
    );
  };

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
              In a critical situation, click the button below to automatically dispatch help to your location. If you can, call your local emergency number.
            </p>
            <div className="mt-10">
              <Button onClick={handleEmergencyDispatch} size="lg" variant="destructive" className="w-full sm:w-auto" disabled={isDispatching}>
                {isDispatching ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Dispatching...
                  </>
                ) : (
                  <>
                    <MapPin className="mr-2 h-5 w-5" /> One-Click Emergency Dispatch
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="mx-auto mt-16 max-w-4xl">
            <h2 className="text-center font-headline text-2xl font-bold">
              Other Emergency Contacts
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
                    <a href="tel:988"><Phone className="mr-2"/>Call 988</a>
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
                    <a href="tel:1-800-222-1222"><Phone className="mr-2"/>Call 1-800-222-1222</a>
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
