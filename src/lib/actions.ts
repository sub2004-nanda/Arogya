"use server";

import { aiSymptomCheck, AISymptomCheckInput } from "@/ai/flows/ai-symptom-check";
import { getLocalizedHealthTips as getLocalizedHealthTipsFlow, LocalizedHealthTipsInput } from "@/ai/flows/localized-health-tips";
import { getTreatmentGuide as getTreatmentGuideFlow, TreatmentGuideInput } from "@/ai/flows/treatment-guide";
import { getPatientRiskSummary as getPatientRiskSummaryFlow, PatientRiskSummaryInput } from "@/ai/flows/patient-risk-summary";


export async function checkSymptoms(input: AISymptomCheckInput) {
  try {
    const result = await aiSymptomCheck(input);
    return result;
  } catch (error) {
    console.error("Symptom check failed:", error);
    return { error: "Failed to get symptom analysis. Please try again." };
  }
}


export async function getLocalizedHealthTips(input: LocalizedHealthTipsInput) {
    try {
        const result = await getLocalizedHealthTipsFlow(input);
        return result;
    } catch (error) {
        console.error("Failed to get localized health tips:", error);
        return { tips: ["Could not load tips. Please try again."] };
    }
}

export async function getTreatmentGuide(input: TreatmentGuideInput) {
    try {
        const result = await getTreatmentGuideFlow(input);
        return result;
    } catch (error) {
        console.error("Failed to get treatment guide:", error);
        return { error: "Failed to get treatment guide. Please try again." };
    }
}

export async function getPatientRiskSummary(input: PatientRiskSummaryInput) {
    try {
        const result = await getPatientRiskSummaryFlow(input);
        return result;
    } catch (error) {
        console.error("Failed to get patient risk summary:", error);
        return { error: "Failed to generate patient summary. Please try again." };
    }
}
