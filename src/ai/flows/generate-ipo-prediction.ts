'use server';

/**
 * @fileOverview A flow to generate an AI-driven prediction score for an IPO.
 *
 * - generateIpoPrediction - A function that generates the IPO prediction.
 * - GenerateIpoPredictionInput - The input type for the generateIpoPrediction function.
 * - GenerateIpoPredictionOutput - The return type for the generateIpoPrediction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateIpoPredictionInputSchema = z.object({
  ipoDetails: z.string().describe('Details about the IPO.'),
  marketConditions: z.string().describe('Current market conditions.'),
  companyFinancials: z.string().describe('Financial information about the company.'),
});
export type GenerateIpoPredictionInput = z.infer<typeof GenerateIpoPredictionInputSchema>;

const GenerateIpoPredictionOutputSchema = z.object({
  predictionScore: z.number().describe('An AI-driven score indicating the IPOs potential performance.'),
  probabilityOfSuccess: z.number().describe('The probability percentage of the IPO being successful.'),
  expectedReturn: z.number().describe('The expected percentage return based on the AI analysis.'),
  shapExplanations: z.record(z.string(), z.number()).describe('SHAP explanations for the prediction.'),
});
export type GenerateIpoPredictionOutput = z.infer<typeof GenerateIpoPredictionOutputSchema>;

export async function generateIpoPrediction(input: GenerateIpoPredictionInput): Promise<GenerateIpoPredictionOutput> {
  return generateIpoPredictionFlow(input);
}

const generateIpoPredictionPrompt = ai.definePrompt({
  name: 'generateIpoPredictionPrompt',
  input: {schema: GenerateIpoPredictionInputSchema},
  output: {schema: GenerateIpoPredictionOutputSchema},
  prompt: `You are an AI investment analyst specializing in IPOs.

  Based on the following information, generate a prediction score, probability of success, expected return, and SHAP explanations for the IPO.

  IPO Details: {{{ipoDetails}}}
  Market Conditions: {{{marketConditions}}}
  Company Financials: {{{companyFinancials}}}

  Provide the prediction score as a number between 0 and 100.
  Provide the probability of success as a percentage.
  Provide the expected return as a percentage.
  Provide SHAP explanations as a JSON object where keys are factors and values are their SHAP values.
  `,
});

const generateIpoPredictionFlow = ai.defineFlow(
  {
    name: 'generateIpoPredictionFlow',
    inputSchema: GenerateIpoPredictionInputSchema,
    outputSchema: GenerateIpoPredictionOutputSchema,
  },
  async input => {
    const {output} = await generateIpoPredictionPrompt(input);
    return output!;
  }
);
