import type { Express } from "express";
import { createServer, type Server } from "http";
import https from "https";
import { storage } from "./storage";
import { samcoService } from "./samcoService";
import { searchNSEStocks } from "./nseStocks";

export async function registerRoutes(app: Express): Promise<Server> {
  // Stock data routes
  app.get("/api/stock/quote/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const { exchange = 'NSE' } = req.query;
      
      const quote = await samcoService.getQuote(symbol.toUpperCase(), exchange as string);
      
      if (!quote) {
        return res.status(404).json({ error: "Stock quote not found" });
      }
      
      res.json(quote);
    } catch (error) {
      console.error("Quote API error:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to fetch quote" });
    }
  });

  app.get("/api/stock/historical/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const { exchange = 'NSE', fromDate, toDate } = req.query;
      
      if (!fromDate || !toDate) {
        return res.status(400).json({ error: "fromDate and toDate are required" });
      }
      
      const historicalData = await samcoService.getHistoricalData(
        symbol.toUpperCase(),
        exchange as string,
        fromDate as string,
        toDate as string
      );
      
      if (!historicalData) {
        return res.status(404).json({ error: "Historical data not found" });
      }
      
      res.json(historicalData);
    } catch (error) {
      console.error("Historical data API error:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to fetch historical data" });
    }
  });

  app.get("/api/stock/intraday/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const { exchange = 'NSE', fromDate, toDate, interval = '15min' } = req.query;
      
      if (!fromDate || !toDate) {
        return res.status(400).json({ error: "fromDate and toDate are required" });
      }
      
      const intradayData = await samcoService.getIntradayData(
        symbol.toUpperCase(),
        exchange as string,
        fromDate as string,
        toDate as string,
        interval as '15min' | '60min'
      );
      
      if (!intradayData) {
        return res.status(404).json({ error: "Intraday data not found" });
      }
      
      res.json(intradayData);
    } catch (error) {
      console.error("Intraday data API error:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to fetch intraday data" });
    }
  });

  // AI Analysis route
  app.post("/api/analysis", async (req, res) => {
    try {
      const { prompt, ticker } = req.body;
      
      if (!prompt || !ticker) {
        return res.status(400).json({ error: "Prompt and ticker are required" });
      }

      console.log('Sending analysis request for prompt:', prompt);
      
      const options = {
        hostname: 'abhi1234.app.n8n.cloud',
        path: '/webhook/4a73c746-83ec-4c1f-bdcd-d681a9769d3c',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Node.js-Analysis-Client'
        },
        timeout: 45000
      };

      const analysisData = await new Promise((resolve, reject) => {
        const req = https.request(options, (response) => {
          let data = '';
          
          console.log('Webhook response status:', response.statusCode);
          console.log('Webhook response headers:', response.headers);
          
          response.on('data', (chunk) => {
            data += chunk;
          });
          
          response.on('end', () => {
            console.log('Raw webhook response:', data.substring(0, 200) + '...');
            
            if (response.statusCode !== 200) {
              reject(new Error(`Webhook returned status ${response.statusCode}`));
              return;
            }
            
            // Check if response is HTML (indicates webhook error/not found)
            if (data.trim().startsWith('<!DOCTYPE html') || data.trim().startsWith('<html')) {
              reject(new Error('N8N webhook not activated. Please go to your N8N workflow and click "Execute workflow" to activate the webhook in test mode.'));
              return;
            }
            
            // Check for specific N8N error messages
            if (data.includes('webhook is not registered') || data.includes('not registered for POST requests')) {
              reject(new Error('N8N webhook not activated. Please go to your N8N workflow and click "Execute workflow" to activate the webhook in test mode.'));
              return;
            }
            
            try {
              const result = JSON.parse(data);
              console.log('Parsed webhook result:', result);
              resolve(result);
            } catch (e) {
              console.log('Failed to parse JSON response');
              reject(new Error('Webhook returned invalid JSON response'));
            }
          });
        });

        req.on('error', (error) => {
          console.error('Webhook request error:', error);
          reject(error);
        });

        req.on('timeout', () => {
          console.error('Webhook request timed out');
          req.destroy();
          reject(new Error('Analysis request timed out after 45 seconds'));
        });

        const postData = JSON.stringify({
          prompt: `${ticker}, ${prompt}`
        });
        console.log('Sending data to webhook:', postData);
        
        req.write(postData);
        req.end();
      });

      res.json(analysisData);
    } catch (error) {
      console.error("AI Analysis error:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to get analysis" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
