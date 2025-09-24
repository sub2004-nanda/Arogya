
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How do I book an appointment?",
    answer:
      "You can book an appointment by navigating to the 'Appointments' page from the main menu. From there, select a department, doctor, and a suitable date and time.",
  },
  {
    question: "Is the AI Symptom Checker a diagnosis?",
    answer:
      "No. The AI Symptom Checker provides potential insights based on the symptoms you enter, but it is not a medical diagnosis. Always consult a qualified healthcare professional for any health concerns.",
  },
  {
    question: "How can I view my past medical records?",
    answer:
      "You can access all your past and upcoming appointments, diagnoses, and prescriptions in the 'Health Records' section.",
  },
  {
    question: "What should I do in an emergency?",
    answer:
      "In a medical emergency, please use the 'Emergency' button in the header to contact local emergency services immediately. The app can help dispatch help to your location.",
  },
  {
    question: "How do I add a family member?",
    answer:
      "Go to the 'Family Health' page. You will find an 'Add Member' button to add a new family member to your profile.",
  },
];

export function Faq() {
  return (
    <Card>
      <CardContent className="pt-6">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem value={`item-${index + 1}`} key={index}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
