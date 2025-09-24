
'use server';

/**
 * @fileOverview An AI agent that summarizes a consultation for a patient.
 *
 * - generateSummary - A function that handles the summary generation.
 * - GenerateSummaryInput - The input type for the generateSummary function.
 * - GenerateSummaryOutput - The return type for the generateSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {marked} from 'marked';

const GenerateSummaryInputSchema = z.object({
  diagnosis: z.string().describe("The diagnosis from the doctor."),
  doctorsNotes: z.string().describe("The notes from the doctor."),
  prescription: z.string().optional().describe("The prescription from the doctor."),
  language: z.string().default('English').describe("The language for the summary (e.g., English, Punjabi, Hindi).")
});
export type GenerateSummaryInput = z.infer<typeof GenerateSummaryInputSchema>;

const GenerateSummaryOutputSchema = z.object({
  summary: z.object({
    mainProblem: z.string().describe("A simple, one-sentence explanation of the main health issue."),
    whatToDo: z.string().describe("A simple, one-sentence instruction on what the patient should do next."),
    medicine: z.string().optional().describe("A simple, one-sentence summary of how to take the prescribed medicine."),
  }),
  htmlSummary: z.string().describe("An HTML version of the summary, including all sections, suitable for display.")
});
export type GenerateSummaryOutput = z.infer<typeof GenerateSummaryOutputSchema>;

export async function generateSummary(input: GenerateSummaryInput): Promise<GenerateSummaryOutput> {
  return generateSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSummaryPrompt',
  input: {schema: GenerateSummaryInputSchema},
  output: {schema: GenerateSummaryOutputSchema},
  prompt: `You are a medical AI assistant. Your task is to create a very simple, one-sentence summary for a patient based on a doctor's notes.
The summary must be in the requested language: {{{language}}}.

The patient needs to understand three things:
1.  **Main Problem:** What is the main health issue? (e.g., "You have a minor cold.")
2.  **What to Do:** What is the most important action they need to take? (e.g., "You need to rest and drink plenty of water.")
3.  **Medicine (if any):** How should they take their medicine? (e.g., "Take the painkiller pill twice a day after eating.")

Generate a structured summary based on the following consultation details. Keep each part to a single, simple sentence.

For the 'htmlSummary' field, provide a clean, formatted HTML version of the summary. Use h3 tags for each section header (Main Problem, What to Do, Medicine) and p tags for the content.

Doctor's Diagnosis: {{{diagnosis}}}
Doctor's Notes: {{{doctorsNotes}}}
{{#if prescription}}
Prescription: {{{prescription}}}
{{/if}}`,
});

const generateSummaryFlow = ai.defineFlow(
  {
    name: 'generateSummaryFlow',
    inputSchema: GenerateSummaryInputSchema,
    outputSchema: GenerateSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    const html = marked.parse(output!.htmlSummary);
    return { ...output!, htmlSummary: html as string };
  }
);
