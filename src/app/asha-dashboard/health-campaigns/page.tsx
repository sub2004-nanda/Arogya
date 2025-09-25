
"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Megaphone, ArrowLeft, Download } from "lucide-react";
import { format } from "date-fns";

const healthCampaigns = [
    {
        id: 'campaign-1',
        title: 'Polio Immunization Drive',
        status: 'Active',
        targetAudience: 'Children under 5 years',
        startDate: new Date(new Date().getFullYear(), 9, 1), // Oct 1
        endDate: new Date(new Date().getFullYear(), 9, 31), // Oct 31
        description: 'Nationwide campaign to administer polio vaccine drops to all eligible children to eradicate polio.',
        materials: ['Posters', 'Pamphlets']
    },
    {
        id: 'campaign-2',
        title: 'Maternal Health Check-up Camp',
        status: 'Active',
        targetAudience: 'Pregnant and new mothers',
        startDate: new Date(new Date().getFullYear(), 9, 15), // Oct 15
        endDate: new Date(new Date().getFullYear(), 9, 20), // Oct 20
        description: 'Free health check-ups, nutritional advice, and iron supplements for expectant and new mothers at the community center.',
        materials: ['Checklist', 'Banners']
    },
    {
        id: 'campaign-3',
        title: 'Dengue & Malaria Awareness Program',
        status: 'Completed',
        targetAudience: 'General Public',
        startDate: new Date(new Date().getFullYear(), 7, 1), // Aug 1
        endDate: new Date(new Date().getFullYear(), 7, 31), // Aug 31
        description: 'An awareness drive about preventing mosquito breeding and recognizing symptoms of dengue and malaria.',
        materials: ['Flyers']
    },
    {
        id: 'campaign-4',
        title: 'Childhood Nutrition Week',
        status: 'Completed',
        targetAudience: 'Parents of children aged 1-10',
        startDate: new Date(new Date().getFullYear(), 8, 1), // Sep 1
        endDate: new Date(new Date().getFullYear(), 8, 7), // Sep 7
        description: 'A week-long program with workshops on balanced diets for children and distribution of nutritional kits.',
        materials: ['Recipe Book', 'Growth Chart']
    }
];

export default function HealthCampaignsPage() {
    
    const getStatusVariant = (status: string) => {
        return status === 'Active' ? 'default' : 'secondary';
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 bg-primary/5">
                <div className="container mx-auto px-4 py-12 sm:py-16">
                    <div className="mx-auto max-w-5xl">
                        <div className="mb-6">
                            <Button asChild variant="outline">
                                <Link href="/asha-dashboard">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Dashboard
                                </Link>
                            </Button>
                        </div>
                        <div className="text-center mb-10">
                            <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl flex items-center justify-center gap-3">
                                <Megaphone /> Health Campaigns
                            </h1>
                            <p className="mt-4 text-lg text-muted-foreground">
                                Information on current and past community health initiatives.
                            </p>
                        </div>

                        <div className="space-y-8">
                            {healthCampaigns.map((campaign) => (
                                <Card key={campaign.id}>
                                    <CardHeader>
                                        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                                            <CardTitle className="text-xl">{campaign.title}</CardTitle>
                                            <Badge variant={getStatusVariant(campaign.status)} className="w-fit">{campaign.status}</Badge>
                                        </div>
                                        <CardDescription>
                                            <span className="font-semibold">Target Audience:</span> {campaign.targetAudience}
                                        </CardDescription>
                                        <CardDescription>
                                            <span className="font-semibold">Dates:</span> {format(campaign.startDate, 'PPP')} - {format(campaign.endDate, 'PPP')}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground mb-4">{campaign.description}</p>
                                        <Button variant="outline">
                                            <Download className="mr-2 h-4 w-4" />
                                            Download Materials
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
