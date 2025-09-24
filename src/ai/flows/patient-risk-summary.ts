'use server';

/**
 * @fileOverview An AI agent that summarizes patient health history and highlights risks.
 *
 * - getPatientRiskSummary - A function that handles the summary and risk analysis.
 * - PatientRiskSummaryInput - The input type for the getPatientRiskSummary function.
 * - PatientRiskSummaryOutput - The return type for the getPatientRiskSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PatientMedicalRecordSchema = z.object({
    diagnosis: z.string(),
    doctorsNotes: z.string(),
    prescription: z.string(),
    date: z.string(),
});

const PatientRiskSummaryInputSchema = z.object({
  patientName: z.string().describe("The name of the patient."),
  medicalHistory: z.array(PatientMedicalRecordSchema).describe("An array of the patient's past medical records."),
});
export type PatientRiskSummaryInput = z.infer<typeof PatientRiskSummaryInputSchema>;

const PatientRiskSummaryOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise summary of the patient\'s overall health based on their history.'),
  riskHighlights: z
    .array(z.string())
    .describe('A list of key risk factors or recurring issues identified from the medical history.'),
});
export type PatientRiskSummaryOutput = z.infer<typeof PatientRiskSummaryOutputSchema>;

export async function getPatientRiskSummary(input: PatientRiskSummaryInput): Promise<PatientRiskSummaryOutput> {
  return patientRiskSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'patientRiskSummaryPrompt',
  input: {schema: PatientRiskSummaryInputSchema},
  output: {schema: PatientRiskSummaryOutputSchema},
  prompt: `You are an expert medical AI assistant. Your task is to analyze a patient's medical history and provide a concise summary and a list of risk highlights.

Patient Name: {{{patientName}}}

Medical History:
{{#each medicalHistory}}
- Date: {{this.date}}
  Diagnosis: {{this.diagnosis}}
  Notes: {{this.doctorsNotes}}
  Prescription: {{this.prescription}}
{{/each}}

Based on the provided history, generate a brief health summary and identify any significant risk factors, recurring problems, or important patterns to bring to the doctor's attention. For example: "Patient has recurring chest pain + high bp".`,
});

const patientRiskSummaryFlow = ai.defineFlow(
  {
    name: 'patientRiskSummaryFlow',
    inputSchema: PatientRiskSummaryInputSchema,
    outputSchema: PatientRiskSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
