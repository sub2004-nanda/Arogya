
"use client";

import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Siren, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const patientNavLinks = [
  { href: "/home", label: "Home" },
  { href: "/appointments", label: "Appointments" },
  { href: "/symptom-checker", label: "Symptom Checker" },
  { href: "/pharmacies", label: "Pharmacies" },
];

const doctorNavLinks = [
  { href: "/doctor-dashboard", label: "Home" },
  { href: "/appointments", label: "Appointments" },
  { href: "/doctor-dashboard", label: "My Patients" }, // Placeholder, can be a dedicated page
  { href: "/video-consultation", label: "Video Consultation" },
];

const ashaNavLinks = [
    { href: "/asha-dashboard", label: "Home" },
    { href: "/community", label: "Community" },
]


export function Header() {
  const { user, logout } = useAuth();
  
  if (!user) {
    return null; // Don't render header if not logged in
  }

  let navLinks = patientNavLinks;
  if (user.role === 'doctor') {
      navLinks = doctorNavLinks;
  } else if (user.role === 'asha') {
      navLinks = ashaNavLinks;
  }


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href={user.role === 'doctor' ? '/doctor-dashboard' : (user.role === 'asha' ? '/asha-dashboard' : '/home')} className="flex items-center gap-2">
            <Logo className="h-10 w-auto" />
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Button asChild variant="destructive">
            <Link href="/emergency"><Siren className="mr-2 h-4 w-4" />Emergency</Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
