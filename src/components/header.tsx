import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Siren } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/symptom-checker", label: "Symptom Checker" },
  { href: "/appointments", label: "Appointments" },
  { href: "/family-health", label: "Family Health" },
  { href: "/pharmacies", label: "Pharmacies" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
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
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Button asChild variant="destructive">
            <Link href="/emergency"><Siren className="mr-2 h-4 w-4" />Emergency</Link>
          </Button>
          <Button asChild>
            <Link href="/appointments">Book Now</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
