import { config } from 'dotenv';
config();

import '@/ai/flows/ai-symptom-check.ts';
import '@/ai/flows/localized-health-tips.ts';
import '@/ai/flows/treatment-guide.ts';
import '@/ai/flows/patient-risk-summary.ts';
import '@/ai/flows/consultation-summary.ts';
