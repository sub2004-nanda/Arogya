
'use server';

/**
 * @fileOverview An AI agent that provides a general treatment guide for a medical condition.
 *
 * - getTreatmentGuide - A function that handles the treatment guide generation.
 * - TreatmentGuideInput - The input type for the getTreatmentGuide function.
 * - TreatmentGuideOutput - The return type for the getTreatmentGuide function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {marked} from 'marked';

const TreatmentGuideInputSchema = z.object({
  condition: z
    .string()
    .describe('The medical condition for which to generate a treatment guide.'),
});
export type TreatmentGuideInput = z.infer<typeof TreatmentGuideInputSchema>;

const TreatmentGuideOutputSchema = z.object({
  guide: z
    .string()
    .describe('A general treatment guide for the specified condition, formatted as markdown.'),
});
export type TreatmentGuideOutput = z.infer<typeof TreatmentGuideOutputSchema>;

export async function getTreatmentGuide(input: TreatmentGuideInput): Promise<TreatmentGuideOutput> {
  return treatmentGuideFlow(input);
}

const prompt = ai.definePrompt({
  name: 'treatmentGuidePrompt',
  input: {schema: TreatmentGuideInputSchema},
  output: {schema: TreatmentGuideOutputSchema},
  prompt: `You are an expert medical AI providing a general treatment guide for a specified condition.

  Your response should be informative and easy to understand for a general audience.
  Format your response using Markdown, including headings, bold text, and lists where appropriate.
  You MUST include a clear and prominent disclaimer that this is not a substitute for professional medical advice.

  Condition: {{{condition}}}
  
  Generate a treatment guide.`,
});

const treatmentGuideFlow = ai.defineFlow(
  {
    name: 'treatmentGuideFlow',
    inputSchema: TreatmentGuideInputSchema,
    outputSchema: TreatmentGuideOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    const htmlGuide = marked.parse(output!.guide);
    return { guide: htmlGuide as string };
  }
);
