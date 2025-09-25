
"use client";

import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Construction } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-primary/5">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6">
              <Button asChild variant="outline">
                <Link href="/pharmacy-dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
            <div className="text-center mb-10">
              <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl flex items-center justify-center gap-3">
                <User /> Pharmacy Profile
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Update your pharmacy's details, hours, and contact information.
              </p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Feature Under Development</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground py-12">
                <Construction className="h-12 w-12 mx-auto mb-4" />
                <p>This page is currently under construction. Please check back later!</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
