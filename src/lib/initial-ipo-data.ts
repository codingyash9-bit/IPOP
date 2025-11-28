import type { Ipo } from './types';

// Renamed from ipo-data.ts to avoid confusion. This is for one-time seeding.
export const initialIpos: Ipo[] = [
  {
    id: 'physicswallah',
    companyName: 'PhysicsWallah',
    symbol: 'PW',
    logoUrl: 'https://picsum.photos/seed/pw/100/100',
    market: 'NSE',
    ipoDate: '2024-11-25',
    priceRange: [450, 475],
    sharesOffered: 40000000,
    dealSize: 18000000000,
    description: 'A leading ed-tech platform in India, providing affordable and comprehensive learning experiences for students preparing for competitive exams.',
    industry: 'Ed-Tech',
    predictionScore: 85,
    successProbability: 90,
    expectedReturn: 40.5,
    naturalLanguageExplanation: "PhysicsWallah's strong brand recognition and impressive user growth are key drivers for its high prediction score. While the competitive market poses a slight risk, its solid profitability makes it a compelling IPO.",
    shapExplanations: {
      'Brand Recognition': 0.4,
      'Strong User Growth': 0.3,
      'Competitive Market': -0.1,
      'Profitability': 0.2,
      'Regulatory Scrutiny': -0.05,
    },
    newsSentiment: {
      aggregatedScore: 0.85,
      positiveHeadlines: [
        { source: 'Economic Times', title: 'PhysicsWallah aims for $1B valuation in upcoming IPO' },
        { source: 'Business Standard', title: 'Ed-tech giant reports 3x growth in user base' }
      ],
      negativeHeadlines: [
        { source: 'LiveMint', title: 'Analysts raise concerns over high marketing spend' }
      ]
    },
    promoterHoldingPost: 60,
    revenueTtm: 8000000000,
    profitMargin: 15.0,
    roe: 28.0,
    debtToEquity: 0.2,
    qibSubscription: 180.0,
    niiSubscription: 120.0,
    retailSubscription: 50.0,
    gmp: 55,
  },
  {
    id: 'capillary-technologies',
    companyName: 'Capillary Technologies India',
    symbol: 'CAPTECH',
    logoUrl: 'https://picsum.photos/seed/capillary/100/100',
    market: 'BSE',
    ipoDate: '2024-12-02',
    priceRange: [380, 400],
    sharesOffered: 25000000,
    dealSize: 9750000000,
    description: 'A global leader in customer loyalty and engagement solutions, helping brands build strong relationships with their customers.',
    industry: 'Software as a Service (SaaS)',
    predictionScore: 78,
    successProbability: 85,
    expectedReturn: 28.0,
    naturalLanguageExplanation: "Capillary Technologies' predictable recurring revenue and established market leadership are strong positive factors. However, investors should note the high valuation and a concentration of revenue from a few large clients as potential risks.",
    shapExplanations: {
      'Recurring Revenue Model': 0.35,
      'Global Presence': 0.25,
      'Client Concentration Risk': -0.15,
      'High Valuation': -0.1,
      'Market Leadership': 0.2,
    },
     newsSentiment: {
      aggregatedScore: 0.65,
      positiveHeadlines: [
        { source: 'VC Circle', title: 'SaaS unicorn Capillary Tech files for IPO' },
        { source: 'YourStory', title: 'From startup to IPO: The Capillary journey' }
      ],
      negativeHeadlines: [
        { source: 'Reuters', title: 'Client concentration a key risk in Capillary IPO' }
      ]
    },
    promoterHoldingPost: 65,
    revenueTtm: 5000000000,
    profitMargin: 12.5,
    roe: 20.0,
    debtToEquity: 0.4,
    qibSubscription: 140.0,
    niiSubscription: 90.0,
    retailSubscription: 30.0,
    gmp: 35,
  },
  {
    id: 'emmvee-photovoltaic',
    companyName: 'Emmvee Photovoltaic Power',
    symbol: 'EMMVEE',
    logoUrl: 'https://picsum.photos/seed/emmvee/100/100',
    market: 'NSE',
    ipoDate: '2024-11-18',
    priceRange: [220, 230],
    sharesOffered: 50000000,
    dealSize: 11250000000,
    description: 'A prominent manufacturer of solar water heating systems and solar photovoltaic modules.',
    industry: 'Renewable Energy',
    predictionScore: 72,
    successProbability: 80,
    expectedReturn: 25.5,
    naturalLanguageExplanation: "Favorable government incentives in the renewable sector and rising energy demand are major tailwinds for Emmvee. The key risks hinge on volatile raw material costs and increasing competition from cheaper imports.",
    shapExplanations: {
      'Government Incentives': 0.3,
      'Rising Energy Demand': 0.25,
      'Raw Material Costs': -0.2,
      'Competition from Imports': -0.1,
      'Strong Order Book': 0.15,
    },
    newsSentiment: {
      aggregatedScore: 0.70,
      positiveHeadlines: [
        { source: 'Economic Times', title: 'PLI scheme boosts Emmvee manufacturing plans' }
      ],
      negativeHeadlines: [
        { source: 'PV Magazine', title: 'Solar module prices remain volatile amid supply chain issues' }
      ]
    },
    promoterHoldingPost: 70,
    revenueTtm: 15000000000,
    profitMargin: 8.0,
    roe: 18.5,
    debtToEquity: 0.8,
    qibSubscription: 110.0,
    niiSubscription: 70.0,
    retailSubscription: 25.0,
    gmp: 28,
  },
  // Add the rest of the IPOs from ipo-data.ts here...
];
