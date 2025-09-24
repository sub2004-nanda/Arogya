// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview Provides localized health and wellness tips.
 *
 * - getLocalizedHealthTips - A function that retrieves health tips adapted to the user's dialect.
 * - LocalizedHealthTipsInput - The input type for the getLocalizedHealthTips function.
 * - LocalizedHealthTipsOutput - The return type for the getLocalizedHealthTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LocalizedHealthTipsInputSchema = z.object({
  dialect: z.string().describe('The local dialect to adapt the health tips to.'),
});
export type LocalizedHealthTipsInput = z.infer<typeof LocalizedHealthTipsInputSchema>;

const LocalizedHealthTipsOutputSchema = z.object({
  tips: z.array(z.string()).describe('An array of health and wellness tips adapted to the specified dialect.'),
});
export type LocalizedHealthTipsOutput = z.infer<typeof LocalizedHealthTipsOutputSchema>;

export async function getLocalizedHealthTips(input: LocalizedHealthTipsInput): Promise<LocalizedHealthTipsOutput> {
  return localizedHealthTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'localizedHealthTipsPrompt',
  input: {
    schema: LocalizedHealthTipsInputSchema,
  },
  output: {
    schema: LocalizedHealthTipsOutputSchema,
  },
  prompt: `You are a helpful AI assistant providing health and wellness tips adapted to the user's local dialect.

  Provide 5 general health and wellness tips adapted to the following dialect: {{{dialect}}}.`,
});

const localizedHealthTipsFlow = ai.defineFlow(
  {
    name: 'localizedHealthTipsFlow',
    inputSchema: LocalizedHealthTipsInputSchema,
    outputSchema: LocalizedHealthTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
