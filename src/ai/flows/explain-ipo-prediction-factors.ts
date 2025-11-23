'use server';

/**
 * @fileOverview Explains the contributing factors of the AI model's IPO prediction.
 *
 * - explainIpoPredictionFactors - A function that returns an explanation of the factors influencing the IPO prediction.
 * - ExplainIpoPredictionFactorsInput - The input type for the explainIpoPredictionFactors function.
 * - ExplainIpoPredictionFactorsOutput - The return type for the explainIpoPredictionFactors function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainIpoPredictionFactorsInputSchema = z.object({
  ipoDetails: z.record(z.any()).describe('Detailed information about the IPO, including financials and market conditions.'),
});
export type ExplainIpoPredictionFactorsInput = z.infer<typeof ExplainIpoPredictionFactorsInputSchema>;

const ExplainIpoPredictionFactorsOutputSchema = z.object({
  explanation: z.record(z.string(), z.number()).describe('A record of feature importance, similar to SHAP values, explaining the prediction.'),
});
export type ExplainIpoPredictionFactorsOutput = z.infer<typeof ExplainIpoPredictionFactorsOutputSchema>;

export async function explainIpoPredictionFactors(
  input: ExplainIpoPredictionFactorsInput
): Promise<ExplainIpoPredictionFactorsOutput> {
  return explainIpoPredictionFactorsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainIpoPredictionFactorsPrompt',
  input: {schema: ExplainIpoPredictionFactorsInputSchema},
  output: {schema: ExplainIpoPredictionFactorsOutputSchema},
  prompt: `You are an AI expert specializing in explaining model predictions for IPOs.

  Given the following IPO details, analyze the key factors and assign a quantitative "impact score" to each, similar to a SHAP value. A positive score means it contributes favorably to the IPO's success, while a negative score is a detracting factor.

  - Identify the top 5-7 most influential factors from the details provided.
  - Assign a score to each (e.g., from -0.5 to +0.5).
  - The scores should represent the magnitude and direction of the factor's influence.
  - Example factors: Market Sentiment, Financial Health (e.g., revenue growth, profitability), Industry Trend, Subscription Rates, Valuation, Brand Recognition.

  IPO Details: {{{jsonStringify ipoDetails}}}

  Return a JSON object where keys are the factor names and values are their impact scores.
  `,
});

const explainIpoPredictionFactorsFlow = ai.defineFlow(
  {
    name: 'explainIpoPredictionFactorsFlow',
    inputSchema: ExplainIpoPredictionFactorsInputSchema,
    outputSchema: ExplainIpoPredictionFactorsOutputSchema,
  },
  async input => {
    // In a real implementation, this would use a library like SHAP on a trained model.
    // For this demo, we simulate the SHAP value generation with a powerful generative model.
    const {output} = await prompt(input);
    return output!;
  }
);
