
"use client";

import Link from "next/link";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart as BarChartIcon, Wallet, Package } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const salesData = [
    { medicine: "Paracetamol", sold: 150, revenue: 300 },
    { medicine: "Benadryl Syrup", sold: 95, revenue: 1140 },
    { medicine: "Aspirin", sold: 80, revenue: 160 },
    { medicine: "Ibuprofen", sold: 120, revenue: 360 },
    { medicine: "Calpol 500mg", sold: 110, revenue: 275 },
    { medicine: "Brufen 400mg", sold: 105, revenue: 315 },
];

const chartConfig = {
  sold: {
    label: "Units Sold",
    color: "hsl(var(--primary))",
  },
}

export default function AnalyticsPage() {

  const totalRevenue = salesData.reduce((acc, item) => acc + item.revenue, 0);
  const totalItemsSold = salesData.reduce((acc, item) => acc + item.sold, 0);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-primary/5">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-5xl">
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
                <BarChartIcon /> Sales Analytics
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Analyze your sales data, top-selling items, and revenue.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">from {salesData.length} medicines</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Items Sold</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalItemsSold.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">across all sales</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Selling Medicines</CardTitle>
                <CardDescription>Units sold in the last 30 days.</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[350px] w-full">
                    <BarChart data={salesData} accessibilityLayer>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="medicine"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 10)}
                        />
                        <YAxis />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Bar
                            dataKey="sold"
                            fill="var(--color-sold)"
                            radius={4}
                        />
                    </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
