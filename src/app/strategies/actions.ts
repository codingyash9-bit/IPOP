'use server';

import { runBacktestFlow, type StrategyRule } from '@/ai/flows/run-backtest-flow';

type BacktestInput = {
  rules: Record<string, string>;
  initialCapital: number;
}

export async function runBacktest(input: BacktestInput) {
    try {
        const result = await runBacktestFlow(input);
        return result;
    } catch (error) {
        console.error("Backtest failed:", error);
        return { error: error instanceof Error ? error.message : "An unknown error occurred during the backtest." };
    }
}
