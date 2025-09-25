
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { QrCode, Camera, VideoOff, AlertCircle, ArrowLeft } from "lucide-react";

export default function QrScannerPage() {
  const { toast } = useToast();
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Cleanup camera on unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  const enableCamera = async () => {
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
    }

    const videoConstraints: MediaStreamConstraints = {
      video: { facingMode: "environment" }
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(videoConstraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasCameraPermission(true);
      setIsCameraEnabled(true);
    } catch (err) {
      // If environment camera fails, try with any camera
      console.warn("Environment camera failed, trying default camera:", err);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCameraPermission(true);
        setIsCameraEnabled(true);
      } catch (error) {
        console.error("Error accessing camera:", error);
        setHasCameraPermission(false);
        setIsCameraEnabled(false);
        toast({
          variant: "destructive",
          title: "Camera Access Denied",
          description: "Please enable camera permissions to scan a QR code.",
        });
      }
    }
  };

  const disableCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraEnabled(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-primary/5">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-2xl">
            <div className="mb-6">
                <Button asChild variant="outline">
                    <Link href="/doctor-dashboard">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </Button>
            </div>
            <div className="text-center">
              <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl flex items-center justify-center gap-3">
                <QrCode /> QR Patient Record Scanner
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Scan a patient's QR code to instantly access their medical history, even when offline.
              </p>
            </div>

            <Card className="mx-auto mt-10 max-w-2xl">
              <CardHeader>
                <CardTitle>Scan QR Code</CardTitle>
                <CardDescription>
                  Position the patient's QR code within the frame to scan.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative w-full aspect-square rounded-md bg-muted overflow-hidden flex items-center justify-center">
                  {isCameraEnabled ? (
                    <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                  ) : (
                    <div className="text-center text-muted-foreground p-4">
                      <Camera className="h-16 w-16 mx-auto mb-4" />
                      <p>Camera is off. Click below to start scanning.</p>
                    </div>
                  )}
                  {hasCameraPermission === false && !isCameraEnabled && (
                    <Alert variant="destructive" className="m-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Camera Access Denied</AlertTitle>
                      <AlertDescription>
                        Please enable camera permissions in your browser settings to use this feature.
                      </AlertDescription>
                    </Alert>
                  )}
                  {/* Placeholder for scanning frame */}
                  {isCameraEnabled && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-3/4 h-3/4 border-4 border-dashed border-primary/50 rounded-lg"/>
                      </div>
                  )}
                </div>
                <div className="flex justify-center gap-4">
                  {!isCameraEnabled ? (
                    <Button onClick={enableCamera}>
                      <Camera className="mr-2" /> Start Scanner
                    </Button>
                  ) : (
                    <Button onClick={disableCamera} variant="outline">
                      <VideoOff className="mr-2" /> Stop Scanner
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p>Scanning functionality is currently in development. This is a UI placeholder.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
