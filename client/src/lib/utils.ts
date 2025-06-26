import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import Papa from 'papaparse';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Fetch NSE stocks dynamically from a local CSV file
export async function fetchNSEStocks(): Promise<Array<{ symbol: string; name: string }>> {
  return new Promise((resolve, reject) => {
    Papa.parse('/nse_equity_stocks.csv', {
      download: true,
      header: true,
      complete: (results) => {
        const stocks = results.data.map((row: any) => ({
          symbol: row['Symbol'],
          name: row['Company Name']
        })).filter(stock => stock.symbol && stock.name);
        resolve(stocks);
      },
      error: (error: any) => {
        console.error("Failed to parse NSE stocks CSV:", error);
        reject(new Error('Failed to load or parse stock list CSV.'));
      }
    });
  });
}

export function isValidNSETicker(ticker: string, nseStocks: Array<{symbol: string, name: string}>): boolean {
  return nseStocks.some(stock => stock.symbol === ticker.toUpperCase())
}

export function searchNSEStocks(query: string, nseStocks: Array<{symbol: string, name: string}>, limit: number = 8): Array<{symbol: string, name: string}> {
  if (!query || query.length < 1) return []
  const searchTerm = query.toUpperCase()
  // Exact symbol match first
  const exactMatches = nseStocks.filter(stock => stock.symbol === searchTerm)
  // Symbol starts with search term
  const symbolMatches = nseStocks.filter(stock => 
    stock.symbol.startsWith(searchTerm) && stock.symbol !== searchTerm
  )
  // Symbol contains search term
  const symbolContains = nseStocks.filter(stock => 
    stock.symbol.includes(searchTerm) && 
    !stock.symbol.startsWith(searchTerm) && 
    stock.symbol !== searchTerm
  )
  // Company name contains search term
  const nameMatches = nseStocks.filter(stock => 
    stock.name.toUpperCase().includes(searchTerm) &&
    !stock.symbol.includes(searchTerm)
  )
  // Combine results with priority order
  const results = [
    ...exactMatches,
    ...symbolMatches,
    ...symbolContains,
    ...nameMatches
  ]
  // Remove duplicates and limit results
  const uniqueResults = results.filter((stock, index, self) => 
    index === self.findIndex(s => s.symbol === stock.symbol)
  )
  return uniqueResults.slice(0, limit)
}
