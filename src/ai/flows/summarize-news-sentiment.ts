'use server';
/**
 * @fileOverview A flow to simulate news scraping and sentiment analysis for a company.
 *
 * - summarizeNewsAndSentiment - A function that returns aggregated sentiment and sample headlines.
 * - SummarizeNewsAndSentimentInput - The input type for the function.
 * - SummarizeNewsAndSentimentOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SummarizeNewsAndSentimentInputSchema = z.object({
  companyName: z.string().describe('The name of the company to analyze.'),
});
export type SummarizeNewsAndSentimentInput = z.infer<typeof SummarizeNewsAndSentimentInputSchema>;

const SummarizeNewsAndSentimentOutputSchema = z.object({
  aggregatedScore: z.number().min(-1).max(1).describe('A single aggregated sentiment score from -1 (very negative) to 1 (very positive).'),
  positiveHeadlines: z.array(z.object({
    source: z.string().describe('A plausible news source (e.g., Economic Times, LiveMint).'),
    title: z.string().describe('A positive news headline related to the company\'s IPO or business.'),
  })).describe('A list of 2-3 positive headlines.'),
  negativeHeadlines: z.array(z.object({
    source: z.string().describe('A plausible news source.'),
    title: z.string().describe('A negative or cautionary news headline.'),
  })).describe('A list of 1-2 negative/cautionary headlines.'),
});
export type SummarizeNewsAndSentimentOutput = z.infer<typeof SummarizeNewsAndSentimentOutputSchema>;

export async function summarizeNewsAndSentiment(
  input: SummarizeNewsAndSentimentInput
): Promise<SummarizeNewsAndSentimentOutput> {
  return summarizeNewsAndSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeNewsAndSentimentPrompt',
  input: { schema: SummarizeNewsAndSentimentInputSchema },
  output: { schema: SummarizeNewsAndSentimentOutputSchema },
  prompt: `You are an AI financial analyst that simulates news aggregation and sentiment analysis for an upcoming IPO.

For the company "{{{companyName}}}", perform the following tasks:
1. Invent 2-3 plausible, positive news headlines related to their business or upcoming IPO. Use sources like "Economic Times," "Business Standard," or "VC Circle."
2. Invent 1-2 plausible, negative or cautionary headlines. Use sources like "LiveMint," "Reuters," or "PV Magazine."
3. Based on the headlines you generated, determine an overall aggregated sentiment score. The score must be between -1.0 (extremely negative) and 1.0 (extremely positive). A score of 0.75 would be very positive, while -0.4 would be moderately negative.
4. Return the results in the specified JSON format.

Do not use real-time data. This is a simulation.
`,
});

const summarizeNewsAndSentimentFlow = ai.defineFlow(
  {
    name: 'summarizeNewsAndSentimentFlow',
    inputSchema: SummarizeNewsAndSentimentInputSchema,
    outputSchema: SummarizeNewsAndSentimentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
