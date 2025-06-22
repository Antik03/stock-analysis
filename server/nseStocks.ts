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
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance Limited' },
  { symbol: 'LT', name: 'Larsen & Toubro Limited' },
  { symbol: 'HCLTECH', name: 'HCL Technologies Limited' },
  { symbol: 'ASIANPAINT', name: 'Asian Paints Limited' },
  { symbol: 'AXISBANK', name: 'Axis Bank Limited' },
  { symbol: 'MARUTI', name: 'Maruti Suzuki India Limited' },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries Limited' },
  { symbol: 'TITAN', name: 'Titan Company Limited' },
  { symbol: 'WIPRO', name: 'Wipro Limited' },
  { symbol: 'ULTRACEMCO', name: 'UltraTech Cement Limited' },
  { symbol: 'NESTLEIND', name: 'Nestle India Limited' },
  { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv Limited' },
  { symbol: 'TECHM', name: 'Tech Mahindra Limited' },
  { symbol: 'ADANIPORTS', name: 'Adani Ports and Special Economic Zone Limited' },
  { symbol: 'ONGC', name: 'Oil and Natural Gas Corporation Limited' },
  { symbol: 'NTPC', name: 'NTPC Limited' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Limited' },
  { symbol: 'POWERGRID', name: 'Power Grid Corporation of India Limited' },
  { symbol: 'COALINDIA', name: 'Coal India Limited' },
  { symbol: 'JSWSTEEL', name: 'JSW Steel Limited' },
  { symbol: 'GRASIM', name: 'Grasim Industries Limited' },
  { symbol: 'DIVISLAB', name: 'Divi\'s Laboratories Limited' },
  { symbol: 'TATASTEEL', name: 'Tata Steel Limited' },
  { symbol: 'BRITANNIA', name: 'Britannia Industries Limited' },
  { symbol: 'DRREDDY', name: 'Dr. Reddy\'s Laboratories Limited' },
  { symbol: 'ADANIGREEN', name: 'Adani Green Energy Limited' },
  { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto Limited' },
  { symbol: 'EICHERMOT', name: 'Eicher Motors Limited' },
  { symbol: 'APOLLOHOSP', name: 'Apollo Hospitals Enterprise Limited' },
  { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp Limited' },
  { symbol: 'CIPLA', name: 'Cipla Limited' },
  { symbol: 'INDUSINDBK', name: 'IndusInd Bank Limited' },
  { symbol: 'TATACONSUM', name: 'Tata Consumer Products Limited' },
  { symbol: 'SHREECEM', name: 'Shree Cement Limited' },
  { symbol: 'HINDALCO', name: 'Hindalco Industries Limited' },
  { symbol: 'BPCL', name: 'Bharat Petroleum Corporation Limited' },
  { symbol: 'GODREJCP', name: 'Godrej Consumer Products Limited' },
  { symbol: 'ADANITRANS', name: 'Adani Transmission Limited' },
  { symbol: 'HDFCLIFE', name: 'HDFC Life Insurance Company Limited' },
  { symbol: 'SBILIFE', name: 'SBI Life Insurance Company Limited' },
  
  // Banking Sector
  { symbol: 'PNB', name: 'Punjab National Bank' },
  { symbol: 'BANKBARODA', name: 'Bank of Baroda' },
  { symbol: 'CANBK', name: 'Canara Bank' },
  { symbol: 'UNIONBANK', name: 'Union Bank of India' },
  { symbol: 'IDFCFIRSTB', name: 'IDFC First Bank Limited' },
  { symbol: 'FEDERALBNK', name: 'Federal Bank Limited' },
  { symbol: 'RBLBANK', name: 'RBL Bank Limited' },
  { symbol: 'BANDHANBNK', name: 'Bandhan Bank Limited' },
  { symbol: 'AUBANK', name: 'AU Small Finance Bank Limited' },
  
  // IT Sector
  { symbol: 'MINDTREE', name: 'Mindtree Limited' },
  { symbol: 'MPHASIS', name: 'Mphasis Limited' },
  { symbol: 'LTI', name: 'L&T Infotech Limited' },
  { symbol: 'LTTS', name: 'L&T Technology Services Limited' },
  { symbol: 'COFORGE', name: 'Coforge Limited' },
  { symbol: 'PERSISTENT', name: 'Persistent Systems Limited' },
  { symbol: 'CYIENT', name: 'Cyient Limited' },
  { symbol: 'INTELLECT', name: 'Intellect Design Arena Limited' },
  
  // Pharmaceutical
  { symbol: 'LUPIN', name: 'Lupin Limited' },
  { symbol: 'BIOCON', name: 'Biocon Limited' },
  { symbol: 'AUROBINDO', name: 'Aurobindo Pharma Limited' },
  { symbol: 'CADILAHC', name: 'Cadila Healthcare Limited' },
  { symbol: 'GLENMARK', name: 'Glenmark Pharmaceuticals Limited' },
  { symbol: 'TORNTPHARM', name: 'Torrent Pharmaceuticals Limited' },
  { symbol: 'ALKEM', name: 'Alkem Laboratories Limited' },
  { symbol: 'ABBOTINDIA', name: 'Abbott India Limited' },
  
  // Auto Sector
  { symbol: 'M&M', name: 'Mahindra & Mahindra Limited' },
  { symbol: 'ASHOKLEY', name: 'Ashok Leyland Limited' },
  { symbol: 'TVSMOTORS', name: 'TVS Motor Company Limited' },
  { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto Limited' },
  { symbol: 'ESCORTS', name: 'Escorts Limited' },
  { symbol: 'MOTHERSUMI', name: 'Motherson Sumi Systems Limited' },
  { symbol: 'BOSCHLTD', name: 'Bosch Limited' },
  { symbol: 'MRF', name: 'MRF Limited' },
  
  // FMCG
  { symbol: 'DABUR', name: 'Dabur India Limited' },
  { symbol: 'MARICO', name: 'Marico Limited' },
  { symbol: 'COLPAL', name: 'Colgate Palmolive (India) Limited' },
  { symbol: 'PIDILITIND', name: 'Pidilite Industries Limited' },
  { symbol: 'VBL', name: 'Varun Beverages Limited' },
  { symbol: 'EMAMILTD', name: 'Emami Limited' },
  { symbol: 'KRBL', name: 'KRBL Limited' },
  
  // Metals & Mining
  { symbol: 'VEDL', name: 'Vedanta Limited' },
  { symbol: 'NMDC', name: 'NMDC Limited' },
  { symbol: 'HINDZINC', name: 'Hindustan Zinc Limited' },
  { symbol: 'NATIONALUM', name: 'National Aluminium Company Limited' },
  { symbol: 'SAIL', name: 'Steel Authority of India Limited' },
  { symbol: 'JINDALSTEL', name: 'Jindal Steel & Power Limited' },
  { symbol: 'RATNAMANI', name: 'Ratnamani Metals & Tubes Limited' },
  
  // Energy & Utilities
  { symbol: 'IOC', name: 'Indian Oil Corporation Limited' },
  { symbol: 'GAIL', name: 'GAIL (India) Limited' },
  { symbol: 'PETRONET', name: 'Petronet LNG Limited' },
  { symbol: 'TORNTPOWER', name: 'Torrent Power Limited' },
  { symbol: 'TATAPOWER', name: 'Tata Power Company Limited' },
  { symbol: 'NHPC', name: 'NHPC Limited' },
  { symbol: 'SJVN', name: 'SJVN Limited' },
  
  // Telecom
  { symbol: 'IDEA', name: 'Vodafone Idea Limited' },
  { symbol: 'RCOM', name: 'Reliance Communications Limited' },
  
  // Real Estate
  { symbol: 'DLF', name: 'DLF Limited' },
  { symbol: 'GODREJPROP', name: 'Godrej Properties Limited' },
  { symbol: 'SOBHA', name: 'Sobha Limited' },
  { symbol: 'BRIGADE', name: 'Brigade Enterprises Limited' },
  { symbol: 'PRESTIGE', name: 'Prestige Estates Projects Limited' },
  
  // Retail
  { symbol: 'DMART', name: 'Avenue Supermarts Limited' },
  { symbol: 'TRENT', name: 'Trent Limited' },
  { symbol: 'ADITYADHUL', name: 'Aditya Birla Fashion and Retail Limited' },
  { symbol: 'JUBLFOOD', name: 'Jubilant FoodWorks Limited' },
  { symbol: 'WESTLIFE', name: 'Westlife Development Limited' },
  
  // Media & Entertainment
  { symbol: 'ZEEL', name: 'Zee Entertainment Enterprises Limited' },
  { symbol: 'SUNTV', name: 'Sun TV Network Limited' },
  { symbol: 'BALRAMCHIN', name: 'Balrampur Chini Mills Limited' },
  { symbol: 'NETWORK18', name: 'Network18 Media & Investments Limited' },
  
  // Textiles
  { symbol: 'WELCORP', name: 'Welspun Corp Limited' },
  { symbol: 'TRIDENT', name: 'Trident Limited' },
  { symbol: 'RAYMOND', name: 'Raymond Limited' },
  { symbol: 'ARVIND', name: 'Arvind Limited' },
  
  // Chemicals
  { symbol: 'UPL', name: 'UPL Limited' },
  { symbol: 'AARTI', name: 'Aarti Industries Limited' },
  { symbol: 'GNFC', name: 'Gujarat Narmada Valley Fertilizers & Chemicals Limited' },
  { symbol: 'ALKYLAMINE', name: 'Alkyl Amines Chemicals Limited' },
  { symbol: 'CLEAN', name: 'Clean Science and Technology Limited' },
  
  // Cement
  { symbol: 'ACC', name: 'ACC Limited' },
  { symbol: 'AMBUJACMNT', name: 'Ambuja Cements Limited' },
  { symbol: 'HEIDELBERG', name: 'HeidelbergCement India Limited' },
  { symbol: 'JKCEMENT', name: 'JK Cement Limited' },
  { symbol: 'RAMCOCEM', name: 'The Ramco Cements Limited' },
  
  // Additional Popular Stocks
  { symbol: 'ADANIGAS', name: 'Adani Total Gas Limited' },
  { symbol: 'ADANIPOWER', name: 'Adani Power Limited' },
  { symbol: 'ADANIENSOL', name: 'Adani Energy Solutions Limited' },
  { symbol: 'ZOMATO', name: 'Zomato Limited' },
  { symbol: 'NYKAA', name: 'FSN E-Commerce Ventures Limited' },
  { symbol: 'PAYTM', name: 'One 97 Communications Limited' },
  { symbol: 'POLICYBZR', name: 'PB Fintech Limited' },
  { symbol: 'IRCTC', name: 'Indian Railway Catering and Tourism Corporation Limited' },
  { symbol: 'LICI', name: 'Life Insurance Corporation of India' },
  { symbol: 'DELTACORP', name: 'Delta Corp Limited' },
  { symbol: 'PVR', name: 'PVR Limited' },
  { symbol: 'INOXLEISUR', name: 'INOX Leisure Limited' },
  { symbol: 'CCL', name: 'CCL Products (India) Limited' },
  { symbol: 'COFFEEDAY', name: 'Coffee Day Enterprises Limited' },
  { symbol: 'SPICEJET', name: 'SpiceJet Limited' },
  { symbol: 'INDIGO', name: 'InterGlobe Aviation Limited' },
  { symbol: 'IRFC', name: 'Indian Railway Finance Corporation Limited' },
  { symbol: 'HAL', name: 'Hindustan Aeronautics Limited' },
  { symbol: 'BEL', name: 'Bharat Electronics Limited' },
  { symbol: 'BHEL', name: 'Bharat Heavy Electricals Limited' },
  { symbol: 'RITES', name: 'RITES Limited' },
  { symbol: 'CONCOR', name: 'Container Corporation of India Limited' },
  { symbol: 'INDIANB', name: 'Indian Bank' },
  { symbol: 'CENTRALBK', name: 'Central Bank of India' },
  { symbol: 'MAHABANK', name: 'Bank of Maharashtra' },
  { symbol: 'IOB', name: 'Indian Overseas Bank' },
  { symbol: 'CHOLAFIN', name: 'Cholamandalam Investment and Finance Company Limited' },
  { symbol: 'MUTHOOTFIN', name: 'Muthoot Finance Limited' },
  { symbol: 'MANAPPURAM', name: 'Manappuram Finance Limited' },
  { symbol: 'STAR', name: 'Strides Pharma Science Limited' },
  { symbol: 'REDDY', name: 'Dr. Reddy\'s Laboratories Limited' },
  { symbol: 'APOLLOTYRE', name: 'Apollo Tyres Limited' },
  { symbol: 'CEAT', name: 'CEAT Limited' },
  { symbol: 'BALKRISIND', name: 'Balkrishna Industries Limited' },
  { symbol: 'ICICIPRULI', name: 'ICICI Prudential Life Insurance Company Limited' },
  { symbol: 'MAXLIFE', name: 'Max Life Insurance Company Limited' },
  { symbol: 'STARHEALTH', name: 'Star Health and Allied Insurance Company Limited' },
];

export function searchNSEStocks(query: string, limit: number = 10): Array<{symbol: string, name: string}> {
  if (!query || query.length < 1) return [];
  
  const searchTerm = query.toUpperCase();
  
  // Exact symbol match first
  const exactMatches = nseStocks.filter(stock => stock.symbol === searchTerm);
  
  // Symbol starts with search term
  const symbolMatches = nseStocks.filter(stock => 
    stock.symbol.startsWith(searchTerm) && stock.symbol !== searchTerm
  );
  
  // Symbol contains search term
  const symbolContains = nseStocks.filter(stock => 
    stock.symbol.includes(searchTerm) && 
    !stock.symbol.startsWith(searchTerm) && 
    stock.symbol !== searchTerm
  );
  
  // Company name contains search term
  const nameMatches = nseStocks.filter(stock => 
    stock.name.toUpperCase().includes(searchTerm) &&
    !stock.symbol.includes(searchTerm)
  );
  
  // Combine results with priority order
  const results = [
    ...exactMatches,
    ...symbolMatches,
    ...symbolContains,
    ...nameMatches
  ];
  
  // Remove duplicates and limit results
  const uniqueResults = results.filter((stock, index, self) => 
    index === self.findIndex(s => s.symbol === stock.symbol)
  );
  
  return uniqueResults.slice(0, limit);
}