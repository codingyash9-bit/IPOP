/**
 * @fileOverview Type definitions and Zod schemas for the prospectus parsing flow.
 *
 * - ProspectusInputSchema - The Zod schema for the prospectus input.
 * - ProspectusOutputSchema - The Zod schema for the prospectus output.
 * - ProspectusInput - The TypeScript type for the prospectus input.
 * - ProspectusOutput - The TypeScript type for the prospectus output.
 */

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
