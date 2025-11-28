'use server';

/**
 * @fileOverview This file is retained as a placeholder and example for Genkit flows.
 * The core business logic for updating IPO data has been moved to `src/functions/updateIpoDataLogic.ts`
 * to be used in a more traditional server-side environment like Firebase Cloud Functions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { updateIpoDataLogic } from '@/functions/updateIpoDataLogic';


const UpdateIpoDataInputSchema = z.object({
    // In a real scenario, you might pass an API key here.
});
export type UpdateIpoDataInput = z.infer<typeof UpdateIpoDataInputSchema>;

const UpdateIpoDataOutputSchema = z.object({
  success: z.boolean().describe('Whether the IPO data update was successful.'),
  message: z.string().describe('A message indicating the result of the update.'),
  newIposAdded: z.number().describe('The number of new IPOs that were added.'),
  newIpoNames: z.array(z.string()).describe('The names of the new IPOs added.'),
  aiTriggeredCount: z.number().describe('The number of AI prediction flows triggered.'),
});
export type UpdateIpoDataOutput = z.infer<typeof UpdateIpoDataOutputSchema>;

// This function is the entry point that would be called by your server or a manual trigger.
export async function updateIpoData(input: UpdateIpoDataInput): Promise<UpdateIpoDataOutput> {
  // We directly call the isolated business logic.
  // This demonstrates that Genkit flows can act as wrappers around existing server-side code.
  return updateIpoDataLogic();
}


// The flow definition is kept for demonstration purposes, showing how one might
// wrap the business logic within a formal Genkit flow structure if desired.
const updateIpoDataFlow = ai.defineFlow(
  {
    name: 'updateIpoDataFlow',
    inputSchema: UpdateIpoDataInputSchema,
    outputSchema: UpdateIpoDataOutputSchema,
  },
  async () => {
    return await updateIpoDataLogic();
  }
);
