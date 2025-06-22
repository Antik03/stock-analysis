import axios from 'axios';

const WEBHOOK_URL = 'https://abhi1234.app.n8n.cloud/webhook-test/4a73c746-83ec-4c1f-bdcd-d681a9769d3c';

export class AnalysisService {
  async getAnalysis(prompt: string): Promise<any> {
    try {
      console.log(`Sending prompt to analysis webhook: "${prompt}"`);
      
      const response = await axios.post(
        WEBHOOK_URL,
        { prompt },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Received analysis from webhook:', JSON.stringify(response.data, null, 2));

      const data = response.data;

      // Case 1: Response is an array like [{ "output": "{...}" }]
      if (Array.isArray(data) && data[0] && data[0].output) {
        try {
          return JSON.parse(data[0].output);
        } catch (e) {
          console.error('Failed to parse output from array format:', e);
          // If parsing fails, maybe the output is not a string but the object itself
          if (typeof data[0].output === 'object') return data[0].output;
          throw new Error('Invalid JSON string in analysis webhook response (array format).');
        }
      }

      // Case 2: Response is an object like { "output": "{...}" }
      if (data && typeof data.output === 'string') {
        try {
          return JSON.parse(data.output);
        } catch (e) {
          console.error('Failed to parse output from object format:', e);
          throw new Error('Invalid JSON string in analysis webhook response (object format).');
        }
      }

      // Case 3: Response is an object with the data directly, possibly inside a `data` key
      if(data && data.data && typeof data.data === 'object') {
        return data.data;
      }

      // Case 4: Response is the JSON object itself
      if(typeof data === 'object' && data !== null && !Array.isArray(data) && data.MarketSnapshot) {
         return data;
      }

      console.warn("Unrecognized analysis format from webhook. Returning raw data.");
      return data;

    } catch (error) {
      console.error('Error fetching analysis from webhook:', error);
      throw new Error('Failed to get analysis from webhook.');
    }
  }
} 