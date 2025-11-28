'use server';
/**
 * @fileOverview A flow to parse a prospectus PDF and extract key IPO details.
 *
 * - parseProspectus - A function that parses a prospectus PDF.
 */

import { ai } from '@/ai/genkit';
import { ProspectusInput, ProspectusInputSchema, ProspectusOutput, ProspectusOutputSchema } from './parse-prospectus-types';


const prompt = ai.definePrompt({
  name: 'prospectusParserPrompt',
  input: { schema: ProspectusInputSchema },
  output: { schema: ProspectusOutputSchema },
  prompt: `You are an expert financial analyst AI that specializes in parsing PDF prospectus documents for Initial Public Offerings (IPOs).

Analyze the provided PDF document and extract the following key pieces of information. The document is a Red Herring Prospectus. Find the data and return it in the specified JSON format.

- Company Name
- Ticker Symbol
- Price Range (provide the low and high values)
- Total Shares Offered
- Revenue (Trailing Twelve Months)
- Net Profit Margin (%)
- Debt-to-Equity Ratio

Document: {{media url=prospectusDataUri}}

Extract the information accurately and provide it in the structured JSON output format.
`,
});


const parseProspectusFlow = ai.defineFlow(
  {
    name: 'parseProspectusFlow',
    inputSchema: ProspectusInputSchema,
    outputSchema: ProspectusOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);


export async function parseProspectus(input: ProspectusInput): Promise<ProspectusOutput> {
    return parseProspectusFlow(input);
}
