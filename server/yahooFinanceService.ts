import yahooFinance from 'yahoo-finance2';

export interface YahooQuoteData {
  ltp: number;
  change: number;
  pChange: number;
  high: number;
  low: number;
  volume: number;
}

export interface YahooHistoricalCandle {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export class YahooFinanceService {
  async getQuote(symbol: string): Promise<YahooQuoteData | null> {
    try {
      const quote = await yahooFinance.quote(symbol + ".NS");
      if (!quote) return null;
      return {
        ltp: quote.regularMarketPrice ?? 0,
        change: quote.regularMarketChange ?? 0,
        pChange: quote.regularMarketChangePercent ?? 0,
        high: quote.regularMarketDayHigh ?? 0,
        low: quote.regularMarketDayLow ?? 0,
        volume: quote.regularMarketVolume ?? 0,
      };
    } catch (error) {
      console.error('Yahoo Finance quote error:', error);
      return null;
    }
  }

  async getHistoricalData(symbol: string, fromDate: string, toDate: string): Promise<YahooHistoricalCandle[] | null> {
    try {
      const results = await yahooFinance.historical(symbol + ".NS", {
        period1: fromDate,
        period2: toDate,
        interval: '1d',
      });
      if (!results || results.length === 0) return null;
      return results.map((candle: any) => ({
        date: candle.date.toISOString().split('T')[0],
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
        volume: candle.volume,
      }));
    } catch (error) {
      console.error('Yahoo Finance historical data error:', error);
      return null;
    }
  }
}

export const yahooFinanceService = new YahooFinanceService(); 