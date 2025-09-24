'use server';

/**
 * @fileOverview An AI agent that summarizes a consultation for a patient.
 *
 * - getConsultationSummary - A function that handles the summary generation.
 * - ConsultationSummaryInput - The input type for the getConsultationSummary function.
 * - ConsultationSummaryOutput - The return type for the getConsultationSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ConsultationSummaryInputSchema = z.object({
  diagnosis: z.string().describe("The diagnosis from the doctor."),
  doctorsNotes: z.string().describe("The notes from the doctor."),
  prescription: z.string().optional().describe("The prescription from the doctor."),
  language: z.string().default('English').describe("The language for the summary (e.g., English, Punjabi, Hindi).")
});
export type ConsultationSummaryInput = z.infer<typeof ConsultationSummaryInputSchema>;

const ConsultationSummaryOutputSchema = z.object({
  summary: z.object({
    mainProblem: z.string().describe("A simple, one-sentence explanation of the main health issue."),
    whatToDo: z.string().describe("A simple, one-sentence instruction on what the patient should do next."),
    medicine: z.string().optional().describe("A simple, one-sentence summary of how to take the prescribed medicine."),
  })
});
export type ConsultationSummaryOutput = z.infer<typeof ConsultationSummaryOutputSchema>;

export async function getConsultationSummary(input: ConsultationSummaryInput): Promise<ConsultationSummaryOutput> {
  return consultationSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'consultationSummaryPrompt',
  input: {schema: ConsultationSummaryInputSchema},
  output: {schema: ConsultationSummaryOutputSchema},
  prompt: `You are a medical AI assistant. Your task is to create a very simple, one-sentence summary for a patient based on a doctor's notes.
The summary must be in the requested language: {{{language}}}.

The patient needs to understand three things:
1.  **Main Problem:** What is the main health issue? (e.g., "You have a minor cold.")
2.  **What to Do:** What is the most important action they need to take? (e.g., "You need to rest and drink plenty of water.")
3.  **Medicine (if any):** How should they take their medicine? (e.g., "Take the painkiller pill twice a day after eating.")

Generate a structured summary based on the following consultation details. Keep each part to a single, simple sentence.

Doctor's Diagnosis: {{{diagnosis}}}
Doctor's Notes: {{{doctorsNotes}}}
{{#if prescription}}
Prescription: {{{prescription}}}
{{/if}}`,
});

const consultationSummaryFlow = ai.defineFlow(
  {
    name: 'consultationSummaryFlow',
    inputSchema: ConsultationSummaryInputSchema,
    outputSchema: ConsultationSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
