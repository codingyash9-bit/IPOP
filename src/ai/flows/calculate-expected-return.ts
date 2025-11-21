'use server';

/**
 * @fileOverview A flow to calculate the expected percentage return for an IPO.
 *
 * - calculateExpectedReturn - Calculates the expected return based on AI analysis.
 * - CalculateExpectedReturnInput - The input type for the calculateExpectedReturn function.
 * - CalculateExpectedReturnOutput - The return type for the calculateExpectedReturn function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalculateExpectedReturnInputSchema = z.object({
  predictedScore: z
    .number()
    .describe('The AI predicted score for the IPO, ranging from 0 to 1.'),
  marketSentiment: z
    .number()
    .describe(
      'A numerical representation of the current market sentiment, ranging from -1 to 1.'
    ),
  historicalPerformance: z
    .number()
    .describe('A numerical representation of the historical performance of similar IPOs, ranging from 0 to 1.'),
});
export type CalculateExpectedReturnInput = z.infer<typeof CalculateExpectedReturnInputSchema>;

const CalculateExpectedReturnOutputSchema = z.object({
  expectedReturn: z
    .number()
    .describe(
      'The expected percentage return for the IPO, based on the AI analysis.'
    ),
});
export type CalculateExpectedReturnOutput = z.infer<typeof CalculateExpectedReturnOutputSchema>;

export async function calculateExpectedReturn(
  input: CalculateExpectedReturnInput
): Promise<CalculateExpectedReturnOutput> {
  return calculateExpectedReturnFlow(input);
}

const calculateExpectedReturnPrompt = ai.definePrompt({
  name: 'calculateExpectedReturnPrompt',
  input: {schema: CalculateExpectedReturnInputSchema},
  output: {schema: CalculateExpectedReturnOutputSchema},
  prompt: `You are an AI financial analyst. Calculate the expected percentage return for an IPO based on the following factors:

Predicted Score: {{{predictedScore}}} (Range: 0 to 1, higher is better)
Market Sentiment: {{{marketSentiment}}} (Range: -1 to 1, positive is better)
Historical Performance: {{{historicalPerformance}}} (Range: 0 to 1, higher is better)

Consider these factors and provide the expected percentage return. The return should be in a reasonable range (e.g., -20% to 50%). Provide a single numerical value representing the expected return.

Expected Return:`,
});

const calculateExpectedReturnFlow = ai.defineFlow(
  {
    name: 'calculateExpectedReturnFlow',
    inputSchema: CalculateExpectedReturnInputSchema,
    outputSchema: CalculateExpectedReturnOutputSchema,
  },
  async input => {
    const {output} = await calculateExpectedReturnPrompt(input);
    return output!;
  }
);
