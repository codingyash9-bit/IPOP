'use server';

/**
 * @fileOverview A flow to run a simulated financial backtest for a trading strategy.
 *
 * - runBacktestFlow - A function that simulates a backtest.
 */

import { ai } from '@/ai/genkit';
import { BacktestInput, BacktestInputSchema, BacktestOutput, BacktestOutputSchema } from './run-backtest-types';


const prompt = ai.definePrompt({
    name: 'financialBacktestSimulator',
    input: { schema: BacktestInputSchema },
    output: { schema: BacktestOutputSchema },
    prompt: `You are a sophisticated financial quantitative analyst AI for the Indian market. Your task is to simulate a backtest for an IPO investment strategy based on a set of rules over a fictional 2-year period.

Initial Capital: ₹{{{initialCapital}}}

The user has defined the following strategy rules for when to apply for an IPO:
{{#each rules}}
- {{this}}
{{/each}}

1.  **Generate a plausible daily equity curve** over 2 years (approx 500 trading days). The curve should reflect the provided strategy rules in an Indian market context. A strategy focused on high GMP and QIB subscription might show strong gains but also higher volatility. A value-focused strategy (e.g., low P/E) might be more stable.
2.  **Calculate performance metrics** based on the generated equity curve:
    *   **Final Equity**: The last value in your equity series.
    *   **Total Return (%)**: ((Final Equity / Initial Capital) - 1) * 100.
    *   **Sharpe Ratio**: Simulate a plausible Sharpe Ratio. Good strategies are often > 1.0. Risky ones might be < 0.5. A ratio above 1 is considered good in the Indian context.
    *   **Maximum Drawdown (%)**: The largest peak-to-trough percentage drop in portfolio value.
3.  **Return the results** in the specified JSON format. The equitySeries should contain around 60-90 data points, representing a down-sampled view of the 2-year period.
`
});


const backtestFlow = ai.defineFlow(
    {
        name: 'runBacktestFlow',
        inputSchema: BacktestInputSchema,
        outputSchema: BacktestOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);


export async function runBacktest(input: BacktestInput): Promise<BacktestOutput> {
    return backtestFlow(input);
}
