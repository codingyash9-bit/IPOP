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
    .describe('The AI predicted score for the IPO, ranging from 0 to 100.'),
  marketSentiment: z
    .number()
    .describe(
      'A numerical representation of the current market sentiment, ranging from -1 (very bearish) to 1 (very bullish).'
    ),
  historicalPerformance: z
    .number()
    .describe('A numerical representation of the historical performance of similar IPOs in this sector, ranging from 0 to 1.'),
});
export type CalculateExpectedReturnInput = z.infer<typeof CalculateExpectedReturnInputSchema>;

const CalculateExpectedReturnOutputSchema = z.object({
  expectedReturn: z
    .number()
    .describe(
      'The expected percentage return for the IPO on its listing day, based on the AI analysis.'
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
  prompt: `You are an AI financial analyst. Your task is to predict the expected listing day percentage return for an IPO.
  
Based on the following quantitative factors, provide a single numerical value for the expected return.

- AI Prediction Score: {{{predictedScore}}} (A score from 0-100 indicating the IPO's fundamental strength and likelihood of success). A higher score suggests a better return.
- Market Sentiment: {{{marketSentiment}}} (A score from -1 to 1. Positive values indicate bullish market conditions, which can amplify gains. Negative values indicate bearish sentiment, which can dampen them).
- Historical Sector Performance: {{{historicalPerformance}}} (A score from 0 to 1, where 1 means recent IPOs in this sector performed exceptionally well).

A very high prediction score (e.g., 90+) in a bullish market (e.g., 0.8) with strong sector performance (e.g., 0.9) could yield a high return (e.g., 40-60%).
A mediocre score (e.g., 50) in a bearish market (e.g., -0.5) might yield a negative return (e.g., -5% to -15%).

Calculate the expected percentage return. The return should be in a realistic range (e.g., -30% to +100%). Return only a single numerical value.`,
});

const calculateExpectedReturnFlow = ai.defineFlow(
  {
    name: 'calculateExpectedReturnFlow',
    inputSchema: CalculateExpectedReturnInputSchema,
    outputSchema: CalculateExpectedReturnOutputSchema,
  },
  async input => {
    // In a real implementation, this would call a trained regression model.
    // For this demo, we use a powerful generative model to simulate that regressor.
    const {output} = await calculateExpectedReturnPrompt(input);
    return output!;
  }
);
