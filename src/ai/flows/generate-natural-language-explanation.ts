'use server';
/**
 * @fileOverview Generates a natural language explanation for an IPO prediction.
 *
 * - generateNaturalLanguageExplanation - A function that produces a human-readable rationale for a prediction.
 * - GenerateNaturalLanguageExplanationInput - The input type for the function.
 * - GenerateNaturalLanguageExplanationOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateNaturalLanguageExplanationInputSchema = z.object({
  ipoName: z.string().describe('The name of the IPO company.'),
  predictionScore: z.number().describe('The overall AI prediction score (0-100).'),
  shapValues: z.record(z.string(), z.number()).describe('The SHAP values explaining feature importance. Positive values are favorable, negative are unfavorable.'),
});
export type GenerateNaturalLanguageExplanationInput = z.infer<typeof GenerateNaturalLanguageExplanationInputSchema>;

const GenerateNaturalLanguageExplanationOutputSchema = z.object({
  explanation: z.string().describe('A 2-3 sentence human-readable explanation of the prediction.'),
});
export type GenerateNaturalLanguageExplanationOutput = z.infer<typeof GenerateNaturalLanguageExplanationOutputSchema>;

export async function generateNaturalLanguageExplanation(
  input: GenerateNaturalLanguageExplanationInput
): Promise<GenerateNaturalLanguageExplanationOutput> {
  return generateNaturalLanguageExplanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNaturalLanguageExplanationPrompt',
  input: { schema: GenerateNaturalLanguageExplanationInputSchema },
  output: { schema: GenerateNaturalLanguageExplanationOutputSchema },
  prompt: `You are an expert financial analyst who is skilled at summarizing complex quantitative data into a simple, human-readable narrative.

Your task is to generate a 2-3 sentence explanation for an IPO prediction.

- IPO Name: {{{ipoName}}}
- AI Prediction Score: {{{predictionScore}}}
- Key Factors (SHAP values): {{{jsonStringify shapValues}}}

Based on the SHAP values, identify the top 2-3 most influential factors. Briefly explain how these factors (both positive and negative) contribute to the final prediction score. Frame it as a concise summary for an investor.

Example: "The outlook for [IPO Name] appears positive, primarily driven by strong market leadership and a robust recurring revenue model. However, investors should be cautious of the high valuation, which presents a notable risk."

Generate the explanation now.`,
});

const generateNaturalLanguageExplanationFlow = ai.defineFlow(
  {
    name: 'generateNaturalLanguageExplanationFlow',
    inputSchema: GenerateNaturalLanguageExplanationInputSchema,
    outputSchema: GenerateNaturalLanguageExplanationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
