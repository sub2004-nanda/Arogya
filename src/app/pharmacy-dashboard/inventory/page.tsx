
"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Package, PlusCircle } from "lucide-react";
import { mockMedicineStock as initialMedicineStock } from "@/lib/mock-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";


type Medicine = {
  name: string;
  stock: string;
  type: string;
};

const addMedicineSchema = z.object({
  name: z.string().min(1, "Medicine name is required."),
  type: z.string().min(1, "Medicine type is required (e.g., Tablet, Syrup)."),
  stock: z.enum(["In Stock", "Low Stock", "Out of Stock"]),
});

type AddMedicineFormValues = z.infer<typeof addMedicineSchema>;

export default function InventoryPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  // For demonstration, we'll hardcode the pharmacyId. In a real app, this would come from the user's profile.
  const pharmacyId = "gupta-medical-hall";

  const [medicineStock, setMedicineStock] = useLocalStorage<{ [key: string]: Medicine[] }>("medicineStock", initialMedicineStock);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddMedicineOpen, setIsAddMedicineOpen] = useState(false);

  const inventory = medicineStock[pharmacyId] || [];

  const filteredInventory = inventory.filter((medicine) =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStockChange = (medicineName: string, newStock: string) => {
    const updatedInventory = inventory.map((med) =>
      med.name === medicineName ? { ...med, stock: newStock } : med
    );
    setMedicineStock(prev => ({...prev, [pharmacyId]: updatedInventory}));
  };
  
  const getStockBadgeVariant = (stock: string) => {
    if (stock === 'In Stock') return 'default';
    if (stock === 'Low Stock') return 'secondary';
    if (stock === 'Out of Stock') return 'destructive';
    return 'outline';
  }

  const form = useForm<AddMedicineFormValues>({
    resolver: zodResolver(addMedicineSchema),
  });

  const onAddMedicine = (data: AddMedicineFormValues) => {
      const newInventory = [...inventory, data];
      setMedicineStock(prev => ({...prev, [pharmacyId]: newInventory}));
      toast({
          title: "Medicine Added",
          description: `${data.name} has been added to your inventory.`,
      });
      form.reset({ name: "", type: "", stock: undefined });
      setIsAddMedicineOpen(false);
  }

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
                <Package /> Inventory Management
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Manage your medicine stock, add new items, and track expiry dates.
              </p>
            </div>
            
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <CardTitle>Current Inventory</CardTitle>
                    <CardDescription>View and update medicine stock for {user?.name}.</CardDescription>
                  </div>
                   <Dialog open={isAddMedicineOpen} onOpenChange={setIsAddMedicineOpen}>
                      <DialogTrigger asChild>
                        <Button><PlusCircle className="mr-2"/> Add Medicine</Button>
                      </DialogTrigger>
                      <DialogContent>
                          <DialogHeader>
                              <DialogTitle>Add New Medicine</DialogTitle>
                              <DialogDescription>Enter details for the new medicine to add it to your inventory.</DialogDescription>
                          </DialogHeader>
                          <Form {...form}>
                              <form onSubmit={form.handleSubmit(onAddMedicine)} className="space-y-4">
                                  <FormField
                                      control={form.control}
                                      name="name"
                                      render={({ field }) => (
                                          <FormItem>
                                              <FormLabel>Medicine Name</FormLabel>
                                              <FormControl><Input placeholder="e.g., Paracetamol 500mg" {...field} /></FormControl>
                                              <FormMessage />
                                          </FormItem>
                                      )}
                                  />
                                   <FormField
                                      control={form.control}
                                      name="type"
                                      render={({ field }) => (
                                          <FormItem>
                                              <FormLabel>Type</FormLabel>
                                              <FormControl><Input placeholder="e.g., Tablet, Syrup" {...field} /></FormControl>
                                              <FormMessage />
                                          </FormItem>
                                      )}
                                  />
                                   <FormField
                                      control={form.control}
                                      name="stock"
                                      render={({ field }) => (
                                          <FormItem>
                                              <FormLabel>Initial Stock Status</FormLabel>
                                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                  <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                                                  <SelectContent>
                                                      <SelectItem value="In Stock">In Stock</SelectItem>
                                                      <SelectItem value="Low Stock">Low Stock</SelectItem>
                                                      <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                                                  </SelectContent>
                                              </Select>
                                              <FormMessage />
                                          </FormItem>
                                      )}
                                  />
                                  <DialogFooter>
                                      <Button type="submit">Save Medicine</Button>
                                  </DialogFooter>
                              </form>
                          </Form>
                      </DialogContent>
                    </Dialog>
                </div>
                <div className="relative mt-4">
                    <Input
                        placeholder="Search by medicine name..."
                        className="w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Medicine Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Stock Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredInventory.length > 0 ? (
                            filteredInventory.map((med, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{med.name}</TableCell>
                                    <TableCell className="text-muted-foreground">{med.type}</TableCell>
                                    <TableCell className="text-right w-[200px]">
                                        <Select value={med.stock} onValueChange={(newStock) => handleStockChange(med.name, newStock)}>
                                            <SelectTrigger className="w-full" aria-label={`Update stock for ${med.name}`}>
                                                <SelectValue>
                                                    <Badge variant={getStockBadgeVariant(med.stock)}>{med.stock}</Badge>
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="In Stock">In Stock</SelectItem>
                                                <SelectItem value="Low Stock">Low Stock</SelectItem>
                                                <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center h-24">No medicines found.</TableCell>
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
