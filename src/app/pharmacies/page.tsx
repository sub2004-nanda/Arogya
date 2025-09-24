"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Clock, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockPharmacies = [
  {
    name: "Wellness Pharmacy",
    address: "123 Health St, Green Valley",
    hours: "9:00 AM - 8:00 PM",
    phone: "(555) 123-4567",
    services: ["24/7", "Delivery"],
  },
  {
    name: "City Medicals",
    address: "456 Main Rd, Downtown",
    hours: "8:00 AM - 10:00 PM",
    phone: "(555) 987-6543",
    services: ["Delivery"],
  },
  {
    name: "Cure & Care Chemists",
    address: "789 Oak Ave, Suburbia",
    hours: "10:00 AM - 6:00 PM",
    phone: "(555) 234-5678",
    services: [],
  },
  {
    name: "Sunrise Health Store",
    address: "321 Pine Ln, Riverside",
    hours: "9:00 AM - 9:00 PM",
    phone: "(555) 345-6789",
    services: ["24/7"],
  },
  {
    name: "Community Pharma",
    address: "654 Elm St, Old Town",
    hours: "8:30 AM - 7:30 PM",
    phone: "(555) 456-7890",
    services: ["Delivery"],
  },
];

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
                filteredPharmacies.map((pharmacy, index) => (
                  <Card key={index}>
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
