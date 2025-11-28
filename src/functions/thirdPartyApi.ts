/**
 * @fileoverview This file simulates a third-party API for fetching IPO data.
 * In a real production environment, this function would make an HTTP request
 * to an external financial data provider like IEX Cloud, Finnhub, or a
 * local market data vendor.
 */

/**
 * Simulates fetching a list of upcoming IPOs from a financial data provider.
 *
 * @returns A Promise that resolves to an array of mock IPO data objects.
 *          This mock data includes a mix of IPOs that might already exist
 *          in the database and one new IPO to simulate discovery.
 */
export async function getThirdPartyIPOList(): Promise<{
  id: string;
  companyName: string;
  symbol: string;
  ipoDate: string;
  priceRange: number[];
}[]> {
  // Simulate network latency.
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Return a static list of mock data.
  // In a real API, this list would change over time.
  return [
    // These IPOs are assumed to already be in the database from the initial seed.
    { id: 'physicswallah', companyName: 'PhysicsWallah', symbol: 'PW', ipoDate: '2024-11-25', priceRange: [450, 475] },
    { id: 'capillary-technologies', companyName: 'Capillary Technologies', symbol: 'CAPTECH', ipoDate: '2024-12-02', priceRange: [380, 400] },
    { id: 'ola-electric', companyName: 'Ola Electric', symbol: 'OLAELECT', ipoDate: '2025-02-15', priceRange: [1200, 1250] },

    // This is the NEW IPO that the synchronization logic should discover and add.
    { id: 'aurora-innovations', companyName: 'Aurora Innovations', symbol: 'AURORA', ipoDate: '2025-04-10', priceRange: [700, 750] },
  ];
}
