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
    prompt: `You are a sophisticated financial quantitative analyst AI. Your task is to simulate a backtest for a trading strategy based on a set of rules over a fictional 2-year period.

Initial Capital: {{{initialCapital}}}

The user has defined the following strategy rules:
{{#each rules}}
- {{this}}
{{/each}}

1.  **Generate a plausible daily equity curve** over 2 years (approx 500 trading days). The curve should reflect the provided strategy rules. For example, a simple momentum strategy (buy low, sell high) might perform well in a trending market but poorly in a volatile one. A value strategy might do the opposite.
2.  **Calculate performance metrics** based on the generated equity curve:
    *   **Final Equity**: The last value in your equity series.
    *   **Total Return (%)**: ((Final Equity / Initial Capital) - 1) * 100.
    *   **Sharpe Ratio**: Simulate a plausible Sharpe Ratio. Good strategies are often > 1.0. Risky ones might be < 0.5.
    *   **Maximum Drawdown (%)**: The largest peak-to-trough percentage drop in equity.
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
