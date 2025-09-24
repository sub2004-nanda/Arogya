
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
import { AlertCircle, Bot, Camera, Mic, MicOff, VideoOff, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface SymptomResult {
  potentialConditions?: string;
  error?: string;
}

// Add this type definition for SpeechRecognition
interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onresult: (event: any) => void;
    onerror: (event: any) => void;
    onend: () => void;
}

interface SpeechRecognitionStatic {
    new(): SpeechRecognition;
}

declare global {
    interface Window {
        SpeechRecognition: SpeechRecognitionStatic;
        webkitSpeechRecognition: SpeechRecognitionStatic;
    }
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    // Cleanup function to stop camera and microphone when the component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleMic = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        variant: "destructive",
        title: "Browser Not Supported",
        description: "Your browser does not support speech recognition.",
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      setSymptoms(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
       toast({
        variant: "destructive",
        title: "Recognition Error",
        description: "An error occurred during speech recognition.",
      });
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    setIsListening(true);
  };


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
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext("2d");
      if (context) {
        context.translate(video.videoWidth, 0);
        context.scale(-1, 1);
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        context.setTransform(1, 0, 0, 1, 0, 0);
        const dataUrl = canvas.toDataURL("image/webp");
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

  const handleSubmit = (e: React.FormEvent, type: 'text' | 'visual') => {
    e.preventDefault();
    const textInput = symptoms.trim();
    const isTextSumbit = type === 'text' && textInput;
    const isVisualSubmit = type === 'visual' && capturedImage;

    if (!isTextSumbit && !isVisualSubmit) return;

    startTransition(async () => {
      setResult(null);
      const input = {
          symptoms: isTextSumbit ? textInput : "Analyzing image for symptoms.",
          photoDataUri: isVisualSubmit ? capturedImage! : undefined
      }
      const response = await checkSymptoms(input);
      setResult(response);
    });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUrl = loadEvent.target?.result as string;
        setCapturedImage(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
            const dataUrl = loadEvent.target?.result as string;
            setCapturedImage(dataUrl);
        };
        reader.readAsDataURL(file);
    } else {
        toast({
            variant: "destructive",
            title: "Invalid File Type",
            description: "Please drop an image file."
        });
    }
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
              <form onSubmit={(e) => handleSubmit(e, 'text')} className="space-y-4">
                <div className="relative">
                  <Textarea
                    placeholder="e.g., fever, cough, headache..."
                    className="min-h-[120px] resize-none pr-12"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    disabled={isPending}
                  />
                  <Button
                    type="button"
                    variant={isListening ? "destructive" : "outline"}
                    size="icon"
                    onClick={handleMic}
                    className="absolute right-2 top-2"
                    aria-label={isListening ? "Stop listening" : "Start listening"}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                </div>
                <Button type="submit" disabled={isPending || !symptoms.trim()} className="w-full">
                  {isPending ? "Analyzing..." : "Analyze Symptoms"}
                </Button>
              </form>
            </CardContent>
          </Card>
          
           <Card className="mx-auto mt-10 max-w-3xl">
              <CardHeader>
                <CardTitle>Visual Symptom Analyzer</CardTitle>
                <CardDescription>
                  Upload or take a photo of a visible symptom (e.g., a rash or swelling) for analysis.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => handleSubmit(e, 'visual')} className="space-y-4">
                    {isCameraEnabled ? (
                        <div className="space-y-4">
                            <div className="relative w-full aspect-video rounded-md bg-muted overflow-hidden">
                               <video ref={videoRef} className="w-full h-full object-cover transform -scale-x-100" autoPlay muted playsInline />
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={takePicture} type="button">
                                    <Camera className="mr-2" /> Capture
                                </Button>
                                <Button onClick={disableCamera} type="button" variant="ghost">
                                    <VideoOff className="mr-2" /> Cancel
                                </Button>
                            </div>
                        </div>
                    ) : capturedImage ? (
                        <div className="relative w-full aspect-video rounded-md bg-muted overflow-hidden group">
                           <img src={capturedImage} alt="Symptom" className="w-full h-full object-contain" />
                           <Button onClick={resetCapture} type="button" variant="destructive" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="h-4 w-4" />
                           </Button>
                        </div>
                    ) : (
                        <div 
                          className={cn("relative w-full aspect-video rounded-md border-2 border-dashed border-muted-foreground/50 flex flex-col items-center justify-center text-center p-4 transition-colors", { "bg-primary/10 border-primary": isDragging})}
                          onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                        >
                            <Upload className="h-10 w-10 text-muted-foreground mb-4"/>
                            <p className="font-semibold text-muted-foreground">Drag & drop your photo here</p>
                            <p className="text-sm text-muted-foreground">or</p>
                            <div className="mt-4 flex flex-col sm:flex-row gap-2">
                                <Button type="button" onClick={() => fileInputRef.current?.click()}>
                                    Upload a file
                                </Button>
                                 <Button type="button" onClick={enableCamera} variant="outline">
                                    <Camera className="mr-2" /> Use Camera
                                </Button>
                            </div>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                        </div>
                    )}
                    
                    {hasCameraPermission === false && !isCameraEnabled && !capturedImage && (
                       <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Camera Access Denied</AlertTitle>
                        <AlertDescription>
                          Please enable camera permissions in your browser settings to use this feature.
                        </AlertDescription>
                      </Alert>
                    )}
                    <canvas ref={canvasRef} className="hidden" />

                    <Button type="submit" disabled={isPending || !capturedImage} className="w-full">
                      {isPending ? "Analyzing..." : "Analyze Photo"}
                    </Button>
                </form>
              </CardContent>
           </Card>

          {(isPending) && (
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
