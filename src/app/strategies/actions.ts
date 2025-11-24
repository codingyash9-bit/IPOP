'use server';

import { z } from 'zod';

const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_BASE;
const SECRET_TOKEN = process.env.NEXT_PUBLIC_BACKEND_TOKEN;

const BacktestRequestSchema = z.object({
  rules: z.record(z.any()),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  initialCapital: z.number().optional(),
});

export type BacktestRequest = z.infer<typeof BacktestRequestSchema>;

export async function runBacktest(request: BacktestRequest) {
  if (!BACKEND_BASE) {
    return { error: 'Backend service is not configured.' };
  }

  try {
    const res = await fetch(`${BACKEND_BASE}/backtest/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-token': SECRET_TOKEN || '',
      },
      body: JSON.stringify({
        rules: request.rules,
        start_date: request.startDate,
        end_date: request.endDate,
        initial_capital: request.initialCapital,
      }),
    });
    
    const j = await res.json();
    if (!res.ok) {
      throw new Error(j.detail || 'Backtest failed');
    }
    // j.result contains trades, metrics and equity_series suitable to plot
    return j.result;
  } catch (error: any) {
    console.error('Backtest failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during backtest.';
    return { error: errorMessage };
  }
}

export async function exportBacktestResults(rows: any[], filename="backtest.csv"): Promise<{ blob: Blob | null, error?: string, filename: string }> {
    if (!BACKEND_BASE) {
        return { blob: null, error: 'Backend service is not configured.', filename };
    }
    try {
        const res = await fetch(`${BACKEND_BASE}/export/csv`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-internal-token": SECRET_TOKEN || ''
            },
            body: JSON.stringify({ data: rows, filename })
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || "Export failed");
        }
        
        const blob = await res.blob();
        return { blob, filename };
    } catch (error: any) {
        console.error('Export failed:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during export.';
        return { blob: null, error: errorMessage, filename };
    }
}
