
"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Clock, Phone, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockPharmacies } from "@/lib/mock-data";

export default function PharmaciesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPharmacies = mockPharmacies.filter(
    (pharmacy) =>
      pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pharmacy.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-primary/5">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6">
                <Button asChild variant="outline">
                    <Link href="/home">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </Button>
            </div>
            <div className="text-center">
              <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">Find a Pharmacy</h1>
              <p className="mt-4 text-lg text-muted-foreground">Search for nearby pharmacies to get your prescriptions.</p>
            </div>

            <div className="mt-10">
              <Input
                type="search"
                placeholder="Search by name or address..."
                className="w-full bg-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {filteredPharmacies.length > 0 ? (
                filteredPharmacies.map((pharmacy) => (
                  <Link href={`/pharmacies/${pharmacy.id}`} key={pharmacy.id} className="group">
                    <Card className="h-full transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                      <CardHeader>
                        <CardTitle>{pharmacy.name}</CardTitle>
                        {pharmacy.services.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-2">
                              {pharmacy.services.map(service => (
                                  <Badge key={service} variant="secondary">{service}</Badge>
                              ))}
                          </div>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                          <span>{pharmacy.address}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                          <span>{pharmacy.hours}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                          <span>{pharmacy.phone}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-muted-foreground">No pharmacies found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
