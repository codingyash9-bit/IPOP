'use server';

import { runBacktest as runBacktestFlow } from '@/ai/flows/run-backtest-flow';
import type { BacktestInput, BacktestOutput } from '@/ai/flows/run-backtest-types';

export async function runBacktest(input: BacktestInput): Promise<BacktestOutput | { error: string }> {
    console.log('[Server Action] Running backtest with input:', input);
    try {
        const result = await runBacktestFlow(input);
        console.log('[Server Action] Backtest flow completed successfully.');
        return result;
    } catch (error) {
        console.error("[Server Action] Backtest failed:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during the backtest.";
        
        // Check for specific Genkit/Handlebars errors to provide a more helpful message
        if (errorMessage.includes('unknown helper')) {
             return { error: `AI flow configuration error: An 'unknown helper' was detected in the prompt. Please check the flow definition.` };
        }

        return { error: errorMessage };
    }
}
