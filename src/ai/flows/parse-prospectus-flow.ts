'use server';
/**
 * @fileOverview A flow to parse a prospectus PDF and extract key IPO details.
 *
 * - parseProspectus - A function that parses a prospectus PDF.
 * - ProspectusInput - The input type for the parseProspectus function.
 * - ProspectusOutput - The return type for the parseProspectus function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const ProspectusInputSchema = z.object({
  prospectusDataUri: z
    .string()
    .describe(
      "A PDF file of the prospectus, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:application/pdf;base64,<encoded_data>'."
    ),
});
export type ProspectusInput = z.infer<typeof ProspectusInputSchema>;

export const ProspectusOutputSchema = z.object({
  companyName: z.string().describe('The name of the company.'),
  symbol: z.string().describe('The proposed stock ticker symbol.'),
  priceRange: z.array(z.number()).length(2).describe('The lower and upper bounds of the IPO price range.'),
  sharesOffered: z.number().describe('The total number of shares being offered.'),
  revenueTtm: z.number().describe('The Trailing Twelve Months (TTM) revenue.'),
  profitMargin: z.number().describe('The net profit margin as a percentage.'),
  debtToEquity: z.number().describe('The total debt to equity ratio.'),
});
export type ProspectusOutput = z.infer<typeof ProspectusOutputSchema>;

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
