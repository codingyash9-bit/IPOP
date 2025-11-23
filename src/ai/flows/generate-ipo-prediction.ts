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
import { calculateIpoProbability } from './calculate-ipo-probability';
import { calculateExpectedReturn } from './calculate-expected-return';
import { explainIpoPredictionFactors } from './explain-ipo-prediction-factors';

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


const generateIpoPredictionFlow = ai.defineFlow(
  {
    name: 'generateIpoPredictionFlow',
    inputSchema: GenerateIpoPredictionInputSchema,
    outputSchema: GenerateIpoPredictionOutputSchema,
  },
  async input => {
    // In a real scenario, these would likely be parallel calls to different models/services
    const probabilityResult = await calculateIpoProbability({
        companyName: input.ipoDetails, // Simplified for demo
        industry: 'Tech', // Simplified for demo
        financialData: input.companyFinancials,
        marketConditions: input.marketConditions,
    });

    const expectedReturnResult = await calculateExpectedReturn({
        predictedScore: (probabilityResult.probability * 100),
        marketSentiment: 0.5, // Mock value
        historicalPerformance: 0.6, // Mock value
    });

    const explanationResult = await explainIpoPredictionFactors({
        ipoDetails: { ...input }
    });

    const predictionScore = Math.round(probabilityResult.probability * 80 + Math.random() * 20);
    
    // In a real scenario, the SHAP values would be properly calculated from your model
    const shapExplanations = explanationResult.explanation;

    return {
        predictionScore: predictionScore,
        probabilityOfSuccess: Math.round(probabilityResult.probability * 100),
        expectedReturn: expectedReturnResult.expectedReturn,
        shapExplanations: shapExplanations
    };
  }
);
