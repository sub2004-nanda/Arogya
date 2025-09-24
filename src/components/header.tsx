
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
  { href: "/symptom-checker", label: "Voice-to-text bot" },
  { href: "/community", label: "Community Hub" },
  { href: "/pharmacies", label: "Pharmacies" },
];

const doctorNavLinks = [
  { href: "/doctor-dashboard", label: "Home" },
  { href: "/doctor-dashboard/patient-queue", label: "Patient Queue" },
  { href: "/doctor-dashboard/population-health", label: "Population Health" },
  { href: "/video-consultation", label: "Video Consultation" },
];

const ashaNavLinks = [
    { href: "/asha-dashboard", label: "Home" },
    { href: "/community", label: "Community" },
];

const pharmacyNavLinks = [
    { href: "/pharmacy-dashboard", label: "Dashboard" },
    { href: "#", label: "Inventory" },
    { href: "#", label: "Orders" },
];


export function Header() {
  const { user, logout } = useAuth();
  
  if (!user) {
    return null; // Don't render header if not logged in
  }

  let navLinks = patientNavLinks;
  let homeLink = "/home";
  if (user.role === 'doctor') {
      navLinks = doctorNavLinks;
      homeLink = "/doctor-dashboard";
  } else if (user.role === 'asha') {
      navLinks = ashaNavLinks;
      homeLink = "/asha-dashboard";
  } else if (user.role === 'pharmacy') {
      navLinks = pharmacyNavLinks;
      homeLink = "/pharmacy-dashboard";
  }


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href={homeLink} className="flex items-center gap-2">
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
          {user.role !== 'doctor' && user.role !== 'pharmacy' && (
            <Button asChild variant="destructive">
              <Link href="/emergency"><Siren className="mr-2 h-4 w-4" />Emergency</Link>
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
