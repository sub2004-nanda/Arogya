
"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { getTreatmentGuide } from "@/lib/actions";
import { AlertCircle, BookHeart, Bot, Mic, MicOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GuideResult {
  guide?: string;
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

export default function TreatmentGuidePage() {
  const [condition, setCondition] = useState("");
  const [result, setResult] = useState<GuideResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Cleanup function to stop microphone when the component unmounts
    return () => {
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
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setCondition(transcript);
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


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!condition.trim()) return;

    startTransition(async () => {
      setResult(null);
      const response = await getTreatmentGuide({ condition });
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
              AI Treatment Guide
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Enter a medical condition to receive a general guide on treatment options and steps.
            </p>
          </div>

          <Card className="mx-auto mt-10 max-w-3xl">
            <CardHeader>
              <CardTitle>Find a Treatment Guide</CardTitle>
              <CardDescription>
                Enter a condition like "Common Cold", "Type 2 Diabetes", or "Sprained Ankle".
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <div className="relative flex-grow">
                    <Input
                    placeholder="e.g., Hypertension..."
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    disabled={isPending}
                    className="pr-12"
                    />
                    <Button
                        type="button"
                        variant={isListening ? "destructive" : "outline"}
                        size="icon"
                        onClick={handleMic}
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                        aria-label={isListening ? "Stop listening" : "Start listening"}
                    >
                        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                </div>
                <Button type="submit" disabled={isPending || !condition.trim()}>
                  {isPending ? "Generating..." : "Get Guide"}
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
                      <BookHeart className="h-6 w-6 text-primary" />
                      <CardTitle>Treatment Guide for {condition}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="prose prose-sm max-w-none text-foreground">
                    <p className="whitespace-pre-wrap">{result.guide}</p>
                    <Alert className="mt-6">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Important Disclaimer</AlertTitle>
                      <AlertDescription>
                        This is an AI-generated guide and not a medical diagnosis. Please consult a qualified healthcare professional for any health concerns or before making any medical decisions.
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

    