'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/update-ipo-data.ts';
import '@/ai/flows/calculate-ipo-probability.ts';
import '@/ai/flows/explain-ipo-prediction-factors.ts';
import '@/ai/flows/calculate-expected-return.ts';
import '@/ai/flows/generate-ipo-prediction.ts';
import '@/ai/flows/generate-natural-language-explanation.ts';
import '@/ai/flows/summarize-news-sentiment.ts';
import '@/ai/flows/run-backtest-flow.ts';
