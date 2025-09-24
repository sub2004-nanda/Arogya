
"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pill, ArrowLeft } from "lucide-react";

// Mock data - In a real app, this would come from a database
const mockPharmacies = [
  { id: "gupta-medical-hall", name: "Gupta Medical Hall" },
  { id: "aggarwal-medicos", name: "Aggarwal Medicos" },
  { id: "jindal-medical-store", name: "Jindal Medical Store" },
  { id: "sharma-pharmacy", name: "Sharma Pharmacy" },
  { id: "singla-health-care", name: "Singla Health Care" },
];

const mockMedicineStock: { [key: string]: { name: string; stock: string; type: string }[] } = {
  "gupta-medical-hall": [
    { name: "Paracetamol", stock: "In Stock", type: "Tablet" },
    { name: "Cough Syrup", stock: "In Stock", type: "Syrup" },
    { name: "Aspirin", stock: "Low Stock", type: "Tablet" },
    { name: "Antacid", stock: "Out of Stock", type: "Liquid" },
  ],
  "aggarwal-medicos": [
    { name: "Ibuprofen", stock: "In Stock", type: "Tablet" },
    { name: "Band-Aids", stock: "In Stock", type: "Medical Supply" },
    { name: "Vitamins", stock: "In Stock", type: "Capsule" },
  ],
  "jindal-medical-store": [
    { name: "Paracetamol", stock: "In Stock", type: "Tablet" },
    { name: "Allergy Pills", stock: "Out of Stock", type: "Tablet" },
  ],
  "sharma-pharmacy": [
    { name: "Cough Syrup", stock: "In Stock", type: "Syrup" },
    { name: "Pain Balm", stock: "Low Stock", type: "Ointment" },
  ],
  "singla-health-care": [
    { name: "Paracetamol", stock: "In Stock", type: "Tablet" },
    { name: "Ibuprofen", stock: "In Stock", type: "Tablet" },
    { name: "Cough Syrup", stock: "In Stock", type: "Syrup" },
    { name: "Antacid", stock: "In Stock", type: "Liquid" },
  ],
};

function getStockStatusColor(stock: string) {
    switch (stock) {
        case 'In Stock': return 'bg-green-100 text-green-800';
        case 'Low Stock': return 'bg-yellow-100 text-yellow-800';
        case 'Out of Stock': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}


export default function PharmacyStockPage({ params }: { params: { id: string } }) {
  const [searchTerm, setSearchTerm] = useState("");
  const pharmacy = mockPharmacies.find((p) => p.id === params.id);
  const stock = mockMedicineStock[params.id] || [];

  if (!pharmacy) {
    notFound();
  }

  const filteredStock = stock.filter((medicine) =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-primary/5">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6">
                <Button asChild variant="outline">
                    <Link href="/pharmacies">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Pharmacies
                    </Link>
                </Button>
            </div>
            <div className="text-center">
              <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">{pharmacy.name}</h1>
              <p className="mt-4 text-lg text-muted-foreground">Check available medicine stock.</p>
            </div>

            <Card className="mt-10">
              <CardHeader>
                <CardTitle>Medicine Inventory</CardTitle>
                <div className="mt-4">
                  <Input
                    type="search"
                    placeholder="Search for a medicine..."
                    className="w-full bg-background"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Medicine</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Availability</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStock.length > 0 ? (
                      filteredStock.map((medicine, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium flex items-center gap-3">
                            <Pill className="h-4 w-4 text-muted-foreground"/>
                            {medicine.name}
                          </TableCell>
                          <TableCell>{medicine.type}</TableCell>
                          <TableCell className="text-right">
                            <Badge className={`${getStockStatusColor(medicine.stock)}`}>{medicine.stock}</Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground py-10">
                          No medicines found matching your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
