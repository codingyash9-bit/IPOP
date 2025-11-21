'use server';

/**
 * @fileOverview A flow to update IPO data from a 3rd party API.
 *
 * - updateIpoData - A function that handles the IPO data update process.
 * - UpdateIpoDataInput - The input type for the updateIpoData function.
 * - UpdateIpoDataOutput - The return type for the updateIpoData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UpdateIpoDataInputSchema = z.object({
  apiKey: z.string().describe('The API key to access the 3rd party API.'),
  apiUrl: z.string().describe('The URL of the 3rd party API.'),
});
export type UpdateIpoDataInput = z.infer<typeof UpdateIpoDataInputSchema>;

const UpdateIpoDataOutputSchema = z.object({
  success: z.boolean().describe('Whether the IPO data update was successful.'),
  message: z.string().describe('A message indicating the result of the update.'),
});
export type UpdateIpoDataOutput = z.infer<typeof UpdateIpoDataOutputSchema>;

export async function updateIpoData(input: UpdateIpoDataInput): Promise<UpdateIpoDataOutput> {
  return updateIpoDataFlow(input);
}

const fetchDataTool = ai.defineTool({
  name: 'fetchIpoData',
  description: 'Fetches IPO data from a 3rd party API.',
  inputSchema: z.object({
    apiKey: z.string().describe('The API key to access the 3rd party API.'),
    apiUrl: z.string().describe('The URL of the 3rd party API.'),
  }),
  outputSchema: z.any(),
  async execute(input) {
    try {
      const response = await fetch(input.apiUrl, {
        headers: {
          'X-API-Key': input.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Failed to fetch IPO data:', error);
      throw new Error(`Failed to fetch IPO data: ${error.message}`);
    }
  },
});

const updateIpoDataPrompt = ai.definePrompt({
  name: 'updateIpoDataPrompt',
  tools: [fetchDataTool],
  input: {schema: UpdateIpoDataInputSchema},
  output: {schema: UpdateIpoDataOutputSchema},
  prompt: `You are a system that updates IPO data from a 3rd party API.

  1.  Use the fetchIpoData tool to retrieve the latest IPO data from the API.
  2.  If the data is successfully fetched, return success: true and a message indicating the successful update.
  3.  If there is an error fetching the data, return success: false and an error message.

  Input API Key: {{{apiKey}}}
  Input API URL: {{{apiUrl}}}
  `,
});

const updateIpoDataFlow = ai.defineFlow(
  {
    name: 'updateIpoDataFlow',
    inputSchema: UpdateIpoDataInputSchema,
    outputSchema: UpdateIpoDataOutputSchema,
  },
  async input => {
    try {
      const {output} = await updateIpoDataPrompt(input);
      return output!;
    } catch (error: any) {
      console.error('Failed to update IPO data:', error);
      return {
        success: false,
        message: `Failed to update IPO data: ${error.message}`,
      };
    }
  }
);
