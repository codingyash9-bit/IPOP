'use server';

/**
 * @fileOverview Explains the contributing factors of the AI model's IPO prediction using SHAP values.
 *
 * - explainIpoPredictionFactors - A function that returns a SHAP explanation of the factors influencing the IPO prediction.
 * - ExplainIpoPredictionFactorsInput - The input type for the explainIpoPredictionFactors function.
 * - ExplainIpoPredictionFactorsOutput - The return type for the explainIpoPredictionFactors function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainIpoPredictionFactorsInputSchema = z.object({
  ipoDetails: z.record(z.any()).describe('Detailed information about the IPO.'),
});
export type ExplainIpoPredictionFactorsInput = z.infer<typeof ExplainIpoPredictionFactorsInputSchema>;

const ExplainIpoPredictionFactorsOutputSchema = z.object({
  explanation: z.string().describe('A SHAP explanation of the factors influencing the IPO prediction.'),
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
  prompt: `You are an AI expert specializing in explaining IPO prediction factors using SHAP values.

  Given the following IPO details, provide a SHAP explanation of the factors that influenced the IPO prediction. Use the IPO details as the primary source of information.

  IPO Details: {{{ipoDetails}}}
  `,
});

const explainIpoPredictionFactorsFlow = ai.defineFlow(
  {
    name: 'explainIpoPredictionFactorsFlow',
    inputSchema: ExplainIpoPredictionFactorsInputSchema,
    outputSchema: ExplainIpoPredictionFactorsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
