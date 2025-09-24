
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Video, Mic, PhoneOff, Loader2, Stethoscope, HeartPulse, Activity, Wind, Thermometer } from 'lucide-react';

interface Vitals {
  heartRate: number;
  bloodPressure: string;
  oxygenSaturation: number;
  temperature: number;
}

export default function VideoConsultationPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [vitals, setVitals] = useState<Vitals>({
    heartRate: 70,
    bloodPressure: '120/80',
    oxygenSaturation: 98,
    temperature: 98.6,
  });

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera and microphone permissions in your browser settings to use video consultation.',
        });
      }
    };

    getCameraPermission();

    const connectionTimeout = setTimeout(() => {
        setIsConnecting(false);
        if (hasCameraPermission !== false) {
            setIsConnected(true);
            toast({
                title: "Connected!",
                description: "You are now connected with Dr. Anand.",
            });
        }
    }, 3000);

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      clearTimeout(connectionTimeout);
    };
  }, [hasCameraPermission, toast]);
  
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      setVitals({
        heartRate: Math.floor(Math.random() * (90 - 65 + 1) + 65), // Random HR between 65 and 90
        bloodPressure: `${Math.floor(Math.random() * (125 - 115 + 1) + 115)}/${Math.floor(Math.random() * (85 - 75 + 1) + 75)}`,
        oxygenSaturation: Math.floor(Math.random() * (100 - 95 + 1) + 95), // Random O2 between 95 and 100
        temperature: parseFloat((Math.random() * (99.0 - 98.0) + 98.0).toFixed(1)),
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isConnected]);

  const handleEndCall = () => {
    setIsConnected(false);
    setIsConnecting(false);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    toast({
      title: "Call Ended",
      description: "Your consultation has ended.",
    });

    // Navigate back to the previous page
    router.back();
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-primary/5">
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-5xl">
             <h1 className="text-center font-headline text-4xl font-bold tracking-tight sm:text-5xl">Video Consultation</h1>
             
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="md:col-span-2">
                <Card className="overflow-hidden">
                    <CardHeader className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src="https://picsum.photos/seed/doc1/100/100" alt="Dr. Anand" />
                                    <AvatarFallback>DA</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-xl">Dr. Anand</CardTitle>
                                    <CardDescription>General Physician</CardDescription>
                                </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                               {isConnected ? "Connected" : isConnecting ? "Connecting..." : "Failed"}
                            </div>
                        </div>
                    </CardHeader>
                  <CardContent className="p-0 relative aspect-video bg-muted flex items-center justify-center">
                     {isConnecting && !isConnected && (
                        <div className="text-center">
                            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                            <p className="mt-4 text-muted-foreground">Finding an available doctor...</p>
                        </div>
                     )}
                     {isConnected && (
                         <div className="h-full w-full bg-gray-900 flex items-center justify-center text-white">
                            <Stethoscope className="h-24 w-24 opacity-20"/>
                            <p className="absolute bottom-4">Doctor's video feed</p>
                        </div>
                     )}
                     {hasCameraPermission === false && (
                         <Alert variant="destructive" className="m-4">
                            <Video className="h-4 w-4" />
                            <AlertTitle>Camera Required</AlertTitle>
                            <AlertDescription>
                            Camera access is required for video consultation. Please enable it in your browser settings.
                            </AlertDescription>
                        </Alert>
                     )}
                    
                    <div className="absolute bottom-4 right-4 h-1/4 w-1/4 min-w-[120px] rounded-md overflow-hidden border-2 border-background shadow-lg">
                      <video ref={videoRef} className="w-full h-full object-cover transform -scale-x-100" autoPlay muted playsInline />
                    </div>
                  </CardContent>
                </Card>

                 <div className="mt-4 flex justify-center gap-4">
                    <Button variant="outline" size="lg" disabled={!isConnected}>
                        <Mic className="mr-2" /> Mute
                    </Button>
                    <Button variant="destructive" size="lg" onClick={handleEndCall} disabled={!isConnected}>
                        <PhoneOff className="mr-2" /> End Call
                    </Button>
                </div>

              </div>
              <div className="md:col-span-1">
                <Card className="flex h-full flex-col">
                  <CardHeader>
                    <CardTitle>Live Vitals</CardTitle>
                    <CardDescription>Real-time data from ASHA worker.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-6 overflow-y-auto p-4">
                     <div className="flex items-center gap-4">
                        <HeartPulse className="h-8 w-8 text-primary" />
                        <div>
                            <div className="text-sm text-muted-foreground">Heart Rate</div>
                            <div className="font-bold text-2xl">{vitals.heartRate} <span className="text-base font-normal">BPM</span></div>
                        </div>
                    </div>
                     <div className="flex items-center gap-4">
                        <Activity className="h-8 w-8 text-primary" />
                        <div>
                            <div className="text-sm text-muted-foreground">Blood Pressure</div>
                            <div className="font-bold text-2xl">{vitals.bloodPressure} <span className="text-base font-normal">mmHg</span></div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Wind className="h-8 w-8 text-primary" />
                        <div>
                            <div className="text-sm text-muted-foreground">Oxygen Saturation</div>
                            <div className="font-bold text-2xl">{vitals.oxygenSaturation}<span className="text-base font-normal">%</span></div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Thermometer className="h-8 w-8 text-primary" />
                        <div>
                            <div className="text-sm text-muted-foreground">Temperature</div>
                            <div className="font-bold text-2xl">{vitals.temperature.toFixed(1)} <span className="text-base font-normal">°F</span></div>
                        </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
