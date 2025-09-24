
"use client";

import { useState, useTransition } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { checkSymptoms } from "@/lib/actions";
import { AlertCircle, Bot } from "lucide-react";

interface SymptomResult {
  potentialConditions?: string;
  error?: string;
}

export default function TreatmentGuidePage() {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState<SymptomResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    startTransition(async () => {
      setResult(null);
      const response = await checkSymptoms({ symptoms });
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
              AI Symptom Checker &amp; Guide
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Describe your symptoms, and our AI will provide you with potential insights and guidance.
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
                <Button type="submit" disabled={isPending || !symptoms.trim()} className="w-full">
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
                      </AlerteDescription>
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
