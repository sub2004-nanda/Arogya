
"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const healthSchemes = [
  {
    title: "Mukh Mantri Sehat Yojana",
    organization: "Punjab Govt",
    tags: ["Punjab", "State Scheme"],
    details: {
      useCase: "To provide cashless health insurance cover to the residents of Punjab.",
      eligibility: "All residents of Punjab who are not covered under any other government health insurance scheme.",
      beneficiaries: "Families can avail cashless treatment up to Rs. 5 Lakh per year.",
    },
  },
  {
    title: "Ayushman Bharat – Pradhan Mantri Jan Arogya Yojna (PM-JAY)",
    organization: "Central Govt",
    tags: ["National", "Central Scheme"],
    details: {
      useCase: "To provide health coverage to the bottom 40% of poor and vulnerable population.",
      eligibility: "Based on the Socio-Economic Caste Census (SECC) 2011 criteria.",
      beneficiaries: "Provides a cover of Rs. 5 lakhs per family per year for secondary and tertiary care hospitalization.",
    },
  },
  {
    title: "Janani Shishu Suraksha Karyakaram (JSSK)",
    organization: "Central Govt",
    tags: ["Maternal Health", "Child Health"],
    details: {
      useCase: "To eliminate out-of-pocket expenses for both pregnant women and sick infants.",
      eligibility: "All pregnant women and sick neonates up to 30 days after birth.",
      beneficiaries: "Free and cashless services including delivery, C-section, drugs, diet, and transport.",
    },
  },
  {
    title: "Rashtriya Bal Swasthya Karyakarm (RBSK)",
    organization: "Central Govt",
    tags: ["Child Health"],
    details: {
      useCase: "Early identification and intervention for children from birth to 18 years to cover 4 ‘D’s viz. Defects at birth, Deficiencies, Diseases, Development delays including disability.",
      eligibility: "Children aged 0–18 years in rural areas and urban slums.",
      beneficiaries: "Free treatment, including surgeries, for a wide range of health conditions.",
    },
  },
];

export default function CommunityPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-primary/5">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">Community & Health Hub</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Connect with others, share experiences, and stay informed on the latest health news.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-5xl">
            <h2 className="text-center font-headline text-3xl font-bold">Awareness Campaigns</h2>
            <p className="mt-2 text-center text-muted-foreground">
              Information about government health schemes for ASHA workers, NGOs, and the public.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              {healthSchemes.map((scheme) => (
                <Card key={scheme.title}>
                  <CardHeader>
                    <CardTitle>{scheme.title}</CardTitle>
                    <CardDescription>{scheme.organization}</CardDescription>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {scheme.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="item-1">
                        <AccordionTrigger>View Details</AccordionTrigger>
                        <AccordionContent className="space-y-3 text-sm">
                          <div>
                            <h4 className="font-semibold">Use Case</h4>
                            <p>{scheme.details.useCase}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold">Eligibility</h4>
                            <p>{scheme.details.eligibility}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold">Beneficiaries</h4>
                            <p>{scheme.details.beneficiaries}</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
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
