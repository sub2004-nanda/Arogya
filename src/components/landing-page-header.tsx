
"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Home, LogOut } from "lucide-react";

export function LandingPageHeader() {
  const { user, logout } = useAuth();

  let homeLink = "/home";
  if (user?.role === 'doctor') homeLink = "/doctor-dashboard";
  else if (user?.role === 'asha') homeLink = "/asha-dashboard";
  else if (user?.role === 'pharmacy') homeLink = "/pharmacy-dashboard";

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-10 w-auto" />
        </Link>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button asChild variant="outline">
                <Link href={homeLink}>
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
