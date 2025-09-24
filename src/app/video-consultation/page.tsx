
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Video, Mic, PhoneOff, Send, Loader2, User, Stethoscope } from 'lucide-react';

export default function VideoConsultationPage() {
  const { toast } = useToast();
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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

    // Simulate connecting to a doctor
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
      // Clean up camera stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      clearTimeout(connectionTimeout);
    };
  }, [hasCameraPermission, toast]);

  const handleEndCall = () => {
    setIsConnected(false);
    setIsConnecting(false);
    toast({
      title: "Call Ended",
      description: "Your consultation has ended.",
    });
    // In a real app, you would also navigate the user away or to a summary page.
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
                    {/* Doctor's Video Placeholder */}
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
                    
                    {/* Patient's Video */}
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
                    <CardTitle>Live Chat</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4 overflow-y-auto p-4">
                    {/* Mock Chat Messages */}
                    <div className="flex items-end gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="https://picsum.photos/seed/doc1/100/100" />
                            <AvatarFallback>DA</AvatarFallback>
                        </Avatar>
                        <div className="max-w-[75%] rounded-lg bg-muted p-3 text-sm">
                            <p>Hello! I'm Dr. Anand. How can I help you today?</p>
                        </div>
                    </div>
                     <div className="flex items-end gap-2 justify-end">
                        <div className="max-w-[75%] rounded-lg bg-primary p-3 text-sm text-primary-foreground">
                            <p>Hi Doctor, I have a persistent headache.</p>
                        </div>
                         <Avatar className="h-8 w-8">
                            <AvatarFallback><User/></AvatarFallback>
                        </Avatar>
                    </div>

                  </CardContent>
                  <div className="border-t p-4">
                    <div className="flex items-center gap-2">
                      <Input placeholder="Type your message..." disabled={!isConnected} />
                      <Button size="icon" disabled={!isConnected}>
                        <Send />
                      </Button>
                    </div>
                  </div>
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

    