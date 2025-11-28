/**
 * @fileOverview Type definitions and Zod schemas for the strategy backtest flow.
 *
 * - BacktestInputSchema - The Zod schema for the backtest input.
 * - BacktestOutputSchema - The Zod schema for the backtest output.
 * - BacktestInput - The TypeScript type for the backtest input.
 * - BacktestOutput - The TypeScript type for the backtest output.
 */

import { z } from 'genkit';

export const BacktestInputSchema = z.object({
  rules: z.record(z.string()).describe("An object representing the trading rules. Keys are rule IDs, values are human-readable rule descriptions."),
  initialCapital: z.number().describe("The starting capital for the backtest."),
});
export type BacktestInput = z.infer<typeof BacktestInputSchema>;


const EquityDataPointSchema = z.object({
  date: z.string().describe("The date for this data point, in 'YYYY-MM-DD' format."),
  equity: z.number().describe("The total equity value on this date."),
});

export const BacktestOutputSchema = z.object({
  finalEquity: z.number().describe("The final equity after the backtest period."),
  totalReturn: z.number().describe("The total return as a percentage."),
  sharpeRatio: z.number().describe("The Sharpe ratio of the strategy."),
  maxDrawdown: z.number().describe("The maximum drawdown percentage."),
  equitySeries: z.array(EquityDataPointSchema).describe("An array of daily equity values over the backtest period."),
});
export type BacktestOutput = z.infer<typeof BacktestOutputSchema>;
