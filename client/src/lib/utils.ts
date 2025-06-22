import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// NSE Listed Stocks Database
export const nseStocks = [
  // Top 50 NSE Stocks by Market Cap
  { symbol: 'RELIANCE', name: 'Reliance Industries Limited' },
  { symbol: 'TCS', name: 'Tata Consultancy Services Limited' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Limited' },
  { symbol: 'INFY', name: 'Infosys Limited' },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Limited' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Limited' },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Limited' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Limited' },
  { symbol: 'ITC', name: 'ITC Limited' },
  { symbol: 'SBIN', name: 'State Bank of India' },
  // ... add more stocks as needed
]

export function isValidNSETicker(ticker: string): boolean {
  return nseStocks.some(stock => stock.symbol === ticker.toUpperCase())
}

export function searchNSEStocks(query: string, limit: number = 8): Array<{symbol: string, name: string}> {
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
