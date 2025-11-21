'use server';

/**
 * @fileOverview Flow to calculate the probability of an IPO being successful.
 *
 * - calculateIpoProbability - Calculates the probability of an IPO being successful.
 * - CalculateIpoProbabilityInput - The input type for the calculateIpoProbability function.
 * - CalculateIpoProbabilityOutput - The return type for the calculateIpoProbability function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalculateIpoProbabilityInputSchema = z.object({
  companyName: z.string().describe('The name of the company going public.'),
  industry: z.string().describe('The industry of the company.'),
  financialData: z.string().describe('Key financial data of the company.'),
  marketConditions: z.string().describe('Current market conditions.'),
});

export type CalculateIpoProbabilityInput = z.infer<typeof CalculateIpoProbabilityInputSchema>;

const CalculateIpoProbabilityOutputSchema = z.object({
  probability: z
    .number()
    .min(0)
    .max(1)
    .describe('The probability (between 0 and 1) of the IPO being successful.'),
  explanation: z.string().describe('Explanation of the probability calculation.'),
});

export type CalculateIpoProbabilityOutput = z.infer<typeof CalculateIpoProbabilityOutputSchema>;

export async function calculateIpoProbability(input: CalculateIpoProbabilityInput): Promise<CalculateIpoProbabilityOutput> {
  return calculateIpoProbabilityFlow(input);
}

const calculateIpoProbabilityPrompt = ai.definePrompt({
  name: 'calculateIpoProbabilityPrompt',
  input: {
    schema: CalculateIpoProbabilityInputSchema,
  },
  output: {
    schema: CalculateIpoProbabilityOutputSchema,
  },
  prompt: `You are an AI expert in IPO analysis. Given the following information, calculate the probability of the IPO being successful and provide a brief explanation.

Company Name: {{{companyName}}}
Industry: {{{industry}}}
Financial Data: {{{financialData}}}
Market Conditions: {{{marketConditions}}}

Calculate the probability of the IPO being successful (between 0 and 1) and explain your reasoning. Return the probability and explanation in JSON format.`,
});

const calculateIpoProbabilityFlow = ai.defineFlow(
  {
    name: 'calculateIpoProbabilityFlow',
    inputSchema: CalculateIpoProbabilityInputSchema,
    outputSchema: CalculateIpoProbabilityOutputSchema,
  },
  async input => {
    const {output} = await calculateIpoProbabilityPrompt(input);
    return output!;
  }
);
