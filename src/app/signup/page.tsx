
"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { User, Stethoscope, HeartHandshake, ArrowRight, ArrowLeft, Store } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-primary/5 p-4">
      <div className="absolute top-4 left-4">
        <Button asChild variant="outline">
          <Link href="/"><ArrowLeft className="mr-2" /> Back to Home</Link>
        </Button>
      </div>
      <div className="mb-8">
        <Link href="/"><Logo className="h-16 w-auto" /></Link>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Join Arogya</CardTitle>
          <CardDescription>
            Please select your role to get started with the registration process.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button asChild size="lg" className="w-full justify-between">
            <Link href="/signup/patient">
              <div className="flex items-center gap-2">
                <User />
                <span>Register as a Patient</span>
              </div>
              <ArrowRight />
            </Link>
          </Button>
          <Button asChild size="lg" className="w-full justify-between">
            <Link href="/signup/doctor">
              <div className="flex items-center gap-2">
                <Stethoscope />
                <span>Register as a Doctor</span>
              </div>
              <ArrowRight />
            </Link>
          </Button>
          <Button asChild size="lg" className="w-full justify-between">
            <Link href="/signup/asha">
              <div className="flex items-center gap-2">
                <HeartHandshake />
                <span>Register as an ASHA Worker</span>
              </div>
              <ArrowRight />
            </Link>
          </Button>
           <Button asChild size="lg" className="w-full justify-between">
            <Link href="/signup/pharmacy">
              <div className="flex items-center gap-2">
                <Store />
                <span>Register as a Pharmacy</span>
              </div>
              <ArrowRight />
            </Link>
          </Button>
        </CardContent>
      </Card>
       <div className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Log In
            </Link>
        </div>
    </div>
  );
}
