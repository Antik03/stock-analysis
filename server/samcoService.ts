import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const stocknotejsbridge = require('stocknotejsbridge');
import { yahooFinanceService } from './yahooFinanceService';

interface SamcoQuoteData {
  ltp: number;
  change: number;
  pChange: number;
  high: number;
  low: number;
  volume: number;
}

interface SamcoHistoricalCandle {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export class SamcoService {
  private snapi: any;
  private constants: any;
  private sessionToken: string | null = null;
  private isLoggedIn: boolean = false;
  private authError: string | null = null;

  constructor() {
    this.snapi = stocknotejsbridge.snapi;
    this.constants = stocknotejsbridge.constants;
  }
  
  async login(userId: string, password: string, yob: string): Promise<boolean> {
    if (this.authError) {
      return false;
    }
    try {
      const loginBody = {
        body: {
          userId: userId,
          password: password,
          yob: yob
        }
      };
      
      // Await the Promise returned by userLogin
      const loginResponse = await this.snapi.userLogin(loginBody);
      console.log('Samco login response:', loginResponse);
      
      if (loginResponse) {
        let responseStr = '';
        if (typeof loginResponse === 'string') {
          responseStr = loginResponse.replace(/\n/g, '');
        } else {
          responseStr = String(loginResponse).replace(/\n/g, '');
        }
        
        const loginData = JSON.parse(responseStr);
        console.log('Parsed login data:', loginData);
        
        if (loginData.sessionToken) {
          this.sessionToken = loginData.sessionToken;
          this.snapi.setSessionToken(this.sessionToken);
          this.isLoggedIn = true;
          console.log('Samco API login successful');
          return true;
        }
      }
      
      throw new Error('Login failed - invalid credentials');
    } catch (error) {
      this.authError = (error instanceof Error ? error.message : 'Unknown authentication error');
      console.error('Samco login error:', error);
      return false;
    }
  }
  
  async getQuote(symbol: string, exchange: string = 'NSE'): Promise<SamcoQuoteData | null> {
    if (this.authError) {
      // Fallback to Yahoo Finance
      return yahooFinanceService.getQuote(symbol);
    }
    if (!this.isLoggedIn) {
      // Attempt auto-login using environment variables so that clients don't need a separate login request.
      const userId = process.env.SAMCO_USER_ID || '';
      const password = process.env.SAMCO_PASSWORD || '';
      const yob = process.env.SAMCO_YOB || '';

      if (userId && password && yob) {
        const loginOk = await this.login(userId, password, yob);
        if (!loginOk) {
          // Fallback to Yahoo Finance
          return yahooFinanceService.getQuote(symbol);
        }
      } else {
        // Fallback to Yahoo Finance
        return yahooFinanceService.getQuote(symbol);
      }
    }
    
    try {
      // Use historical data as fallback for quotes since quote API has issues
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const historicalData = await this.getHistoricalData(symbol, exchange, yesterday, today);
      if (historicalData && historicalData.length > 0) {
        const latestData = historicalData[historicalData.length - 1];
        return {
          ltp: latestData.close,
          change: 0, // Calculate if needed
          pChange: 0, // Calculate if needed
          high: latestData.high,
          low: latestData.low,
          volume: latestData.volume
        };
      }
      
      const quoteResponse = await this.snapi.getQuotes({
        symbol: symbol,
        exchange: this.constants.EXCHANGE_NSE
      });
      console.log('Samco quote response:', quoteResponse);
      
      if (quoteResponse) {
        let responseStr = '';
        if (typeof quoteResponse === 'string') {
          responseStr = quoteResponse.replace(/\n/g, '');
        } else {
          responseStr = String(quoteResponse).replace(/\n/g, '');
        }
        
        const quoteData = JSON.parse(responseStr);
        
        if (quoteData && quoteData.ltp) {
          return {
            ltp: parseFloat(quoteData.ltp || 0),
            change: parseFloat(quoteData.change || 0),
            pChange: parseFloat(quoteData.pChange || 0),
            high: parseFloat(quoteData.high || 0),
            low: parseFloat(quoteData.low || 0),
            volume: parseInt(quoteData.volume || 0)
          };
        }
      }
      
      // Fallback to Yahoo Finance if Samco returns null
      return yahooFinanceService.getQuote(symbol);
    } catch (error) {
      console.error('Samco quote error:', error);
      // Fallback to Yahoo Finance on error
      return yahooFinanceService.getQuote(symbol);
    }
  }
  
  async getHistoricalData(
    symbol: string,
    exchange: string = 'NSE',
    fromDate: string,
    toDate: string
  ): Promise<SamcoHistoricalCandle[] | null> {
    if (this.authError) {
      // Fallback to Yahoo Finance
      return yahooFinanceService.getHistoricalData(symbol, fromDate, toDate);
    }
    if (!this.isLoggedIn) {
      // Attempt auto-login using environment variables so that clients don't need a separate login request.
      const userId = process.env.SAMCO_USER_ID || '';
      const password = process.env.SAMCO_PASSWORD || '';
      const yob = process.env.SAMCO_YOB || '';

      if (userId && password && yob) {
        const loginOk = await this.login(userId, password, yob);
        if (!loginOk) {
          // Fallback to Yahoo Finance
          return yahooFinanceService.getHistoricalData(symbol, fromDate, toDate);
        }
      } else {
        // Fallback to Yahoo Finance
        return yahooFinanceService.getHistoricalData(symbol, fromDate, toDate);
      }
    }
    
    try {
      console.log(`Fetching historical data for symbol: ${symbol}, exchange: ${exchange}, fromDate: ${fromDate}, toDate: ${toDate}`);
      
      const historicalResponse = await this.snapi.historicalCandleData(
        symbol,
        fromDate,
        {
          exchange: exchange === 'NSE' ? this.constants.EXCHANGE_NSE : exchange,
          toDate: toDate
        }
      );
      
      console.log('Historical response:', historicalResponse);
      
        const data = typeof historicalResponse === 'string' 
          ? JSON.parse(historicalResponse) 
          : historicalResponse;
        
      if (data?.status === 'Success' && data.historicalCandleData) {
          return data.historicalCandleData.map((candle: any) => ({
            date: candle.date,
            open: parseFloat(candle.open.toString()),
            high: parseFloat(candle.high.toString()),
            low: parseFloat(candle.low.toString()),
            close: parseFloat(candle.close.toString()),
            volume: parseInt(candle.volume.toString())
          }));
        }
      
      // If status is 'Failure' or data is not in the expected format, fallback to Yahoo Finance
      console.log('No historical data found or API returned failure, falling back to Yahoo Finance.');
      return yahooFinanceService.getHistoricalData(symbol, fromDate, toDate);
    } catch (error) {
      console.error('Samco historical data error:', error);
      // Fallback to Yahoo Finance on exception
      return yahooFinanceService.getHistoricalData(symbol, fromDate, toDate);
    }
  }

  async getIntradayData(
    symbol: string,
    exchange: string = 'NSE',
    fromDate: string,
    toDate: string,
    interval: '15min' | '60min'
  ): Promise<SamcoHistoricalCandle[] | null> {
    if (this.authError) {
      // Fallback to Yahoo Finance (daily candles)
      return yahooFinanceService.getHistoricalData(symbol, fromDate, toDate);
    }
    if (!this.isLoggedIn) {
      // Ensure we are logged in and have a session token – reuse the same logic used by getQuote / getHistoricalData
      const userId = process.env.SAMCO_USER_ID || '';
      const password = process.env.SAMCO_PASSWORD || '';
      const yob = process.env.SAMCO_YOB || '';

      if (userId && password && yob) {
        const loginOk = await this.login(userId, password, yob);
        if (!loginOk) {
          // Fallback to Yahoo Finance (daily candles)
          return yahooFinanceService.getHistoricalData(symbol, fromDate, toDate);
        }
      } else {
        // Fallback to Yahoo Finance (daily candles)
        return yahooFinanceService.getHistoricalData(symbol, fromDate, toDate);
      }
    }

    try {
      console.log(`Fetching intraday data for ${symbol} ${exchange} ${fromDate} -> ${toDate} (interval ${interval})`);

      // Map exchange parameter to SDK constant
      let exchangeConstant;
      if (exchange === 'NSE') {
        exchangeConstant = this.constants.EXCHANGE_NSE;
      } else if (exchange === 'BSE') {
        exchangeConstant = this.constants.EXCHANGE_BSE;
      } else if (exchange === 'NFO') {
        exchangeConstant = this.constants.EXCHANGE_NFO;
      } else {
        exchangeConstant = exchange;
      }

      // Map interval requested by UI to SDK constant
      let intervalConstant;
      if (interval === '15min') {
        intervalConstant = this.constants.INTERVAL_15MIN;
      } else {
        // default to 60 minute candles
        intervalConstant = this.constants.INTERVAL_60MIN;
      }

      const intradayResponse = await this.snapi.intradayCandleData(
        symbol,
        fromDate,
        {
          exchange: exchangeConstant,
          toDate: toDate,
          interval: intervalConstant,
        }
      );
      console.log('Intraday response:', intradayResponse);

      if (intradayResponse) {
        const data = typeof intradayResponse === 'string'
          ? JSON.parse(intradayResponse)
          : intradayResponse;

        if (data && data.intradayCandleData) {
          return data.intradayCandleData.map((candle: any) => ({
            date: candle.dateTime, // Intraday uses dateTime
            open: parseFloat(candle.open.toString()),
            high: parseFloat(candle.high.toString()),
            low: parseFloat(candle.low.toString()),
            close: parseFloat(candle.close.toString()),
            volume: parseInt(candle.volume.toString()),
          }));
        }
      }

      // Fallback to Yahoo Finance (daily candles)
      return yahooFinanceService.getHistoricalData(symbol, fromDate, toDate);
    } catch (error) {
      console.error('Samco intraday data error:', error);
      // Fallback to Yahoo Finance (daily candles)
      return yahooFinanceService.getHistoricalData(symbol, fromDate, toDate);
    }
  }
}

export const samcoService = new SamcoService();