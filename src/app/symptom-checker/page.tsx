"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { checkSymptoms } from "@/lib/actions";
import { AlertCircle, Bot, Camera, VideoOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SymptomResult {
  potentialConditions?: string;
  error?: string;
}

export default function SymptomCheckerPage() {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState<SymptomResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Cleanup function to stop camera stream when the component unmounts
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

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasCameraPermission(true);
      setIsCameraEnabled(true);
      setCapturedImage(null); // Clear previous image
    } catch (error) {
      console.error("Error accessing camera:", error);
      setHasCameraPermission(false);
      setIsCameraEnabled(false);
      toast({
        variant: "destructive",
        title: "Camera Access Denied",
        description: "Please enable camera permissions in your browser settings to use this app.",
      });
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

  const takePicture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match the video feed
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext("2d");
      if (context) {
        // Flip the context horizontally to create a mirror image
        context.translate(video.videoWidth, 0);
        context.scale(-1, 1);
        
        // Draw the video frame onto the canvas
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        
        // Reset the transformation
        context.setTransform(1, 0, 0, 1, 0, 0);

        const dataUrl = canvas.toDataURL("image/jpeg");
        setCapturedImage(dataUrl);
        disableCamera();
      }
    }
  };
  
  const resetCapture = () => {
    setCapturedImage(null);
    setHasCameraPermission(null);
    setIsCameraEnabled(false);
    disableCamera();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim() && !capturedImage) return;

    startTransition(async () => {
      setResult(null);
      const response = await checkSymptoms({ symptoms, photoDataUri: capturedImage || undefined });
      setResult(response);
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-primary/5">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
              AI Symptom Checker
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Describe your symptoms and/or provide a photo, and our AI will provide you with potential insights.
            </p>
          </div>

          <Card className="mx-auto mt-10 max-w-3xl">
            <CardHeader>
              <CardTitle>Enter Your Symptoms</CardTitle>
              <CardDescription>
                Be as detailed as possible for a more accurate analysis. For example, "I have a sharp headache on my left side, and a fever of 101°F."
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                  placeholder="e.g., fever, cough, headache..."
                  className="min-h-[120px] resize-none"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  disabled={isPending}
                />
                 <Card>
                  <CardHeader>
                    <CardTitle>Visual Analysis (Optional)</CardTitle>
                    <CardDescription>
                      Use your camera to provide a photo of the symptom.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!isCameraEnabled && !capturedImage && (
                      <Button onClick={enableCamera} type="button" variant="outline">
                        <Camera className="mr-2" /> Start Camera
                      </Button>
                    )}
                     {isCameraEnabled && (
                        <div className="space-y-4">
                            <div className="relative w-full aspect-video rounded-md bg-muted overflow-hidden">
                               <video ref={videoRef} className="w-full h-full object-cover transform -scale-x-100" autoPlay muted playsInline />
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={takePicture} type="button">
                                    <Camera className="mr-2" /> Capture
                                </Button>
                                <Button onClick={disableCamera} type="button" variant="ghost">
                                    <VideoOff className="mr-2" /> Stop Camera
                                </Button>
                            </div>
                        </div>
                    )}
                    {hasCameraPermission === false && !isCameraEnabled && (
                       <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Camera Access Denied</AlertTitle>
                        <AlertDescription>
                          Please enable camera permissions in your browser settings to use this feature.
                        </AlertDescription>
                      </Alert>
                    )}
                    {capturedImage && (
                      <div className="space-y-4">
                        <p>Photo captured:</p>
                        <div className="relative">
                            <img src={capturedImage} alt="Symptom" className="rounded-md max-h-60" />
                        </div>
                        <Button onClick={resetCapture} type="button" variant="outline">
                          Remove Photo
                        </Button>
                      </div>
                    )}
                    <canvas ref={canvasRef} className="hidden" />
                  </CardContent>
                </Card>

                <Button type="submit" disabled={isPending || (!symptoms.trim() && !capturedImage) } className="w-full">
                  {isPending ? "Analyzing..." : "Check Symptoms"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {isPending && (
            <Card className="mx-auto mt-6 max-w-3xl">
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          )}

          {result && !isPending && (
            <div className="mx-auto mt-6 max-w-3xl">
              {result.error ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{result.error}</AlertDescription>
                </Alert>
              ) : (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Bot className="h-6 w-6 text-primary" />
                      <CardTitle>AI Analysis Results</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="prose prose-sm max-w-none text-foreground">
                    <p>{result.potentialConditions}</p>
                    <Alert className="mt-6">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Important Disclaimer</AlertTitle>
                      <AlertDescription>
                        This is an AI-generated analysis and not a medical diagnosis. Please consult a qualified healthcare professional for any health concerns.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
