
"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/logo";

export default function SignupDisabledPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-primary/5 p-4">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/"><Logo className="h-16 w-auto" /></Link>
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up Disabled</CardTitle>
          <CardDescription>
            User registration is not available at this time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm">
            Please contact support if you believe this is an error.
          </p>
          <div className="mt-4 text-center text-sm">
            <Link href="/login" className="underline">
              Return to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
