'use server';
import { updateIpoDataLogic } from '@/functions/updateIpoDataLogic';
import { z } from 'genkit';

/**
 * @fileOverview This file serves as a server-side entry point for manually
 * triggering the IPO data update process.
 */

const UpdateIpoDataOutputSchema = z.object({
  success: z.boolean().describe('Whether the IPO data update was successful.'),
  message: z.string().describe('A message indicating the result of the update.'),
  newIposAdded: z.number().describe('The number of new IPOs that were added.'),
  newIpoNames: z.array(z.string()).describe('The names of the new IPOs added.'),
  aiTriggeredCount: z.number().describe('The number of AI prediction flows triggered.'),
});
export type UpdateIpoDataOutput = z.infer<typeof UpdateIpoDataOutputSchema>;

/**
 * This is the async function exported for use in server components/actions.
 * It directly calls the isolated business logic.
 */
export async function updateIpoData(): Promise<UpdateIpoDataOutput> {
  // This function now acts as a simple, clean wrapper around the core logic.
  return updateIpoDataLogic();
}
