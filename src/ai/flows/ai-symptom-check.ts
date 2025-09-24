'use server';

/**
 * @fileOverview An AI agent that suggests potential conditions based on entered symptoms.
 *
 * - aiSymptomCheck - A function that handles the symptom check process.
 * - AISymptomCheckInput - The input type for the aiSymptomCheck function.
 * - AISymptomCheckOutput - The return type for the aiSymptomCheck function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AISymptomCheckInputSchema = z.object({
  symptoms: z
    .string()
    .describe('The symptoms entered by the patient.'),
});
export type AISymptomCheckInput = z.infer<typeof AISymptomCheckInputSchema>;

const AISymptomCheckOutputSchema = z.object({
  potentialConditions: z
    .string()
    .describe('A list of potential conditions based on the symptoms entered.'),
});
export type AISymptomCheckOutput = z.infer<typeof AISymptomCheckOutputSchema>;

export async function aiSymptomCheck(input: AISymptomCheckInput): Promise<AISymptomCheckOutput> {
  return aiSymptomCheckFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiSymptomCheckPrompt',
  input: {schema: AISymptomCheckInputSchema},
  output: {schema: AISymptomCheckOutputSchema},
  prompt: `You are a helpful AI assistant that suggests potential conditions based on the symptoms entered by a patient.

Please provide a list of potential conditions based on the following symptoms:

Symptoms: {{{symptoms}}}

Potential Conditions:`,
});

const aiSymptomCheckFlow = ai.defineFlow(
  {
    name: 'aiSymptomCheckFlow',
    inputSchema: AISymptomCheckInputSchema,
    outputSchema: AISymptomCheckOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
