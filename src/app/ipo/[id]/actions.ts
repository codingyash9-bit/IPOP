
'use server';

import { generateUpcomingIpoAnalysis } from '@/ai/flows/generate-upcoming-ipo-analysis';
import { getFirebaseAdmin } from '@/firebase/admin';
import type { Ipo } from '@/lib/types';

// Helper function to safely parse numbers from strings, ignoring non-numeric characters
const parseFloatSafe = (str: string | undefined | null): number => {
    if (!str) return 0;
    const cleaned = str.replace(/[^0-9.-]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
};

// Helper function to parse a score like "85/100"
const parseScore = (str: string | undefined | null): number => {
    if (!str) return 0;
    return parseFloatSafe(str.split('/')[0]);
}

// Helper to parse a range string like "20-30%" and return the average
const parseRangeAndGetAverage = (str: string | undefined | null): number => {
    if (!str) return 0;
    const numbers = str.match(/\d+(\.\d+)?/g);
    if (!numbers) return 0;
    if (numbers.length === 1) return parseFloat(numbers[0]);
    if (numbers.length > 1) {
        const sum = numbers.map(parseFloat).reduce((a, b) => a + b, 0);
        return sum / numbers.length;
    }
    return 0;
};


export async function runPrediction(ipoId: string): Promise<{ success: boolean; message: string }> {
  console.log(`[Server Action] Starting ADVANCED prediction for IPO ID: ${ipoId}`);
  
  const { db } = getFirebaseAdmin();
  const ipoRef = db.collection('ipos').doc(ipoId);

  try {
    const ipoDoc = await ipoRef.get();
    if (!ipoDoc.exists) {
      console.error(`[Server Action] IPO with ID ${ipoId} not found in Firestore.`);
      return { success: false, message: 'IPO not found' };
    }
    const ipo = ipoDoc.data() as Ipo;
    console.log(`[Server Action] Found IPO for analysis: ${ipo.companyName}`);

    // 1. Call the advanced 19-point analysis flow
    const analysisInput = {
        companyName: ipo.companyName,
        industry: ipo.industry,
    };
    
    console.log('[Server Action] Calling generateUpcomingIpoAnalysis flow with input:', analysisInput);
    const result = await generateUpcomingIpoAnalysis(analysisInput);
    console.log('[Server Action] Received ADVANCED AI analysis result.`);

    // 2. Map the comprehensive 19-point analysis to our Ipo type
    const updatedData: Partial<Ipo> = {
        // Core Info from ipoSummary
        companyName: result.ipoSummary.companyName || ipo.companyName,
        market: result.ipoSummary.listingExchange || ipo.market,
        ipoDate: result.ipoSummary.expectedListingDate || ipo.ipoDate,
        dealSize: parseFloatSafe(result.ipoSummary.totalIssueSize) * 10000000 || ipo.dealSize,

        // Analysis & Predictions
        predictionScore: parseScore(result.uniformScoringModel.finalIpoScore) || ipo.predictionScore,
        successProbability: parseScore(result.uniformScoringModel.finalIpoScore) || ipo.successProbability,
        expectedReturn: parseRangeAndGetAverage(result.gmpAnalysis.latestGmp) || ipo.expectedReturn,
        naturalLanguageExplanation: result.finalSummary || ipo.naturalLanguageExplanation,
        
        // Simulate SHAP from Risk/Advantage Analysis
        shapExplanations: {
            [result.deepCompanyAnalysis.competitiveAdvantages.substring(0,30)]: 0.3,
            [result.industryAndCompetitorAnalysis.industrySizeAndCAGR.substring(0,30)]: 0.2,
            [result.deepRiskAnalysis.keyRisks.substring(0,30)]: -0.2,
            [result.advancedValuationAnalysis.verdict]: -0.15,
        },

        // Financials
        revenueTtm: parseFloatSafe(result.fullFinancialAnalysis.growthMetrics.split(',')[0]) || ipo.revenueTtm,
        profitMargin: parseRangeAndGetAverage(result.fullFinancialAnalysis.growthMetrics) || ipo.profitMargin,
        roe: parseRangeAndGetAverage(result.fullFinancialAnalysis.ratios) || ipo.roe,
        debtToEquity: parseRangeAndGetAverage(result.fullFinancialAnalysis.cashFlowAndDebt) || ipo.debtToEquity,
        
        // Market Sentiment
        qibSubscription: parseFloatSafe(result.subscriptionTrendAnalysis.subscriptionFigures) || ipo.qibSubscription,
        niiSubscription: parseFloatSafe(result.subscriptionTrendAnalysis.subscriptionFigures.split(',')[1]) || ipo.niiSubscription,
        retailSubscription: parseFloatSafe(result.subscriptionTrendAnalysis.subscriptionFigures.split(',')[2]) || ipo.retailSubscription,
        gmp: parseRangeAndGetAverage(result.gmpAnalysis.latestGmp) || ipo.gmp,
        
        newsSentiment: {
            aggregatedScore: parseRangeAndGetAverage(result.sentimentAnalysisAI.marketFearGreed),
            positiveHeadlines: [
                { source: 'AI Analyst', title: `Retail Buzz: ${result.sentimentAnalysisAI.retailBuzz}` },
                { source: 'AI Analyst', title: `Analyst Sentiment: ${result.sentimentAnalysisAI.analystSentiment}` }
            ],
            negativeHeadlines: [
                { source: 'AI Analyst', title: `Key Risk: ${result.deepRiskAnalysis.keyRisks.split(',')[0]}` }
            ]
        },
    };

    // 3. Update the document in Firestore
    console.log(`[Server Action] Updating Firestore document for ${ipo.companyName} with new analysis...`);
    await ipoRef.update(updatedData);
    console.log(`[Server Action] Firestore update successful for ${ipo.companyName}.`);

    return { success: true, message: 'Advanced analysis complete and IPO data updated.' };

  } catch (error: any) {
    console.error('[Server Action] Advanced prediction failed:', error);
    
    if (error.message && error.message.includes('could not refresh access token')) {
         const detailedMessage = 'The server failed to authenticate with Google AI. This is often an IAM permission issue. Ensure the App Hosting service account has the "Vertex AI User" role.';
         console.error(`[Server Action] Specific Error: ${detailedMessage}`);
         return { success: false, message: detailedMessage };
    }

    const errorMessage = error.message || 'An unknown error occurred during prediction.';
    return { success: false, message: errorMessage };
  }
}
