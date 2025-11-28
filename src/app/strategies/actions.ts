'use server';

import { runBacktest as runBacktestFlow, type BacktestInput, type BacktestOutput } from '@/ai/flows/run-backtest-flow';

export async function runBacktest(input: BacktestInput): Promise<BacktestOutput | { error: string }> {
    try {
        const result = await runBacktestFlow(input);
        return result;
    } catch (error) {
        console.error("Backtest failed:", error);
        return { error: error instanceof Error ? error.message : "An unknown error occurred during the backtest." };
    }
}
