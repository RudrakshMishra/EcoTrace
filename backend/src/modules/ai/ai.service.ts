import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI | null = null;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    } else {
      console.warn('GEMINI_API_KEY is not set. AI Chat will use mock responses or fail if not handled.');
    }
  }

  async getChatResponse(message: string, context: any, user: any) {
    if (!this.genAI) {
      // Fallback response if no API key is provided
      return {
        response: `Hi! I see you don't have an API key set up yet, but based on your footprint of ${context?.annualTotal || 'unknown'} kg CO2, you're taking the first step! Provide a GEMINI_API_KEY in the backend .env to enable real AI responses.`
      };
    }

    try {
      const systemPrompt = `You are a helpful, concise carbon footprint expert assistant. 
The user is asking a question about their personal carbon footprint. Keep your response conversational and concise (2-4 sentences max, plain text, no markdown headers).

User Context Data:
Name: ${user?.name || 'User'}
Total Annual Emission: ${context?.annualTotal || 0} kg CO2/yr
Commute/Transport: ${context?.transportScore || 0} kg CO2/yr
Diet: ${context?.dietScore || 0} kg CO2/yr
Home Energy: ${context?.homeScore || 0} kg CO2/yr
Flights: ${context?.flightScore || 0} kg CO2/yr
Shopping: ${context?.shoppingScore || 0} kg CO2/yr

Answer the user's question directly based on this specific data. Provide actionable advice tailored to their highest emitting categories.`;

      const model = this.genAI.getGenerativeModel({
        model: 'gemini-pro',
        systemInstruction: systemPrompt,
      });

      const result = await model.generateContent(message);
      const response = await result.response;
      const text = response.text();

      return {
        response: text || 'I was unable to generate a response at this time.',
      };
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      if (error?.message?.includes('API key not valid') || error?.status === 401 || error?.status === 403 || error?.status === 404) {
        return { response: "I couldn't authenticate or find the model. Please check that your Gemini API key is valid and has the API enabled in Google Cloud Console." };
      }
      return { response: "I ran into an issue connecting to my servers. Please try again later." };
    }
  }
}
