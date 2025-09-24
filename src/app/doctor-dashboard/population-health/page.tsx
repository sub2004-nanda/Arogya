
"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell } from "recharts"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BarChart4 } from "lucide-react"

const conditionsData = {
  Ramgarh: [
    { condition: "Hypertension", cases: 120 },
    { condition: "Diabetes", cases: 90 },
    { condition: "Asthma", cases: 45 },
    { condition: "Arthritis", cases: 60 },
    { condition: "Allergies", cases: 75 },
  ],
  Alipur: [
    { condition: "Hypertension", cases: 110 },
    { condition: "Diabetes", cases: 85 },
    { condition: "Asthma", cases: 50 },
    { condition: "Arthritis", cases: 55 },
    { condition: "Allergies", cases: 80 },
  ],
  "Nabha Town": [
    { condition: "Hypertension", cases: 250 },
    { condition: "Diabetes", cases: 180 },
    { condition: "Asthma", cases: 95 },
    { condition: "Arthritis", cases: 120 },
    { condition: "Allergies", cases: 150 },
  ],
};

const symptomsData = [
    { symptom: "Fever", village: "Ramgarh", count: 45 },
    { symptom: "Fever", village: "Alipur", count: 55 },
    { symptom: "Cough", village: "Ramgarh", count: 60 },
    { symptom: "Cough", village: "Alipur", count: 70 },
    { symptom: "Headache", village: "Ramgarh", count: 30 },
    { symptom: "Headache", village: "Alipur", count: 40 },
    { symptom: "Fatigue", village: "Ramgarh", count: 50 },
    { symptom: "Fatigue", village: "Alipur", count: 60 },
]

const demographicsData = [
  { name: '0-18 years', value: 400, fill: "hsl(var(--chart-1))" },
  { name: '19-40 years', value: 300, fill: "hsl(var(--chart-2))" },
  { name: '41-60 years', value: 300, fill: "hsl(var(--chart-3))" },
  { name: '60+ years', value: 200, fill: "hsl(var(--chart-4))" },
];

const chartConfigBar = {
  cases: {
    label: "Cases",
    color: "hsl(var(--chart-1))",
  },
}

const chartConfigPie = {
  visitors: {
    label: "Visitors",
  },
  "0-18 years": {
    label: "0-18 years",
    color: "hsl(var(--chart-1))",
  },
  "19-40 years": {
    label: "19-40 years",
    color: "hsl(var(--chart-2))",
  },
  "41-60 years": {
    label: "41-60 years",
    color: "hsl(var(--chart-3))",
  },
  "60+ years": {
    label: "60+ years",
    color: "hsl(var(--chart-4))",
  },
} satisfies React.ComponentProps<typeof ChartContainer>["config"]


export default function PopulationHealthPage() {
  const [selectedVillage, setSelectedVillage] = React.useState<keyof typeof conditionsData>("Ramgarh");

  const chartData = conditionsData[selectedVillage];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-primary/5">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-10">
              <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl flex items-center justify-center gap-3">
                <BarChart4 /> Population Health Insights
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Aggregated, anonymized data for village-level health patterns.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Common Conditions by Village</CardTitle>
                        <CardDescription>Number of reported cases for prevalent conditions.</CardDescription>
                      </div>
                      <Select value={selectedVillage} onValueChange={(value) => setSelectedVillage(value as keyof typeof conditionsData)}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select Village" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(conditionsData).map(village => (
                            <SelectItem key={village} value={village}>{village}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfigBar} className="h-[300px] w-full">
                      <BarChart data={chartData} accessibilityLayer>
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey="condition"
                          tickLine={false}
                          tickMargin={10}
                          axisLine={false}
                        />
                         <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="cases" fill="var(--color-cases)" radius={4} />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>

               <div className="lg:col-span-1">
                 <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Patient Demographics</CardTitle>
                        <CardDescription>Age distribution across all villages.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 pb-0">
                         <ChartContainer
                            config={chartConfigPie}
                            className="mx-auto aspect-square max-h-[300px]"
                            >
                            <PieChart>
                                <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                                />
                                <Pie
                                data={demographicsData}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={60}
                                strokeWidth={5}
                                >
                                    {demographicsData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
               </div>
            </div>

            <div className="mt-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Symptom Trends</CardTitle>
                        <CardDescription>Weekly reported symptoms - potential outbreak indicators.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <ChartContainer config={chartConfigBar} className="h-[300px] w-full">
                            <BarChart data={symptomsData} accessibilityLayer>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                dataKey="symptom"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                />
                                <YAxis />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="count" fill="hsl(var(--destructive))" radius={4}>
                                </Bar>
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
