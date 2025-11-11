import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Try to create AI instance with fallback options
let aiInstance;

try {
  // Primary configuration
  aiInstance = genkit({
    promptDir: './prompts',
    plugins: [
      googleAI({
        apiKey: process.env.GOOGLE_GENAI_API_KEY,
      }),
    ],
    model: 'googleai/gemini-pro', // Using stable Gemini Pro model
    // Performance optimizations
    config: {
      temperature: 0.1, // Very low temperature for fastest responses
      topK: 10, // Minimal token selection for faster generation
      topP: 0.6, // Minimal randomness for most predictable responses
      maxOutputTokens: 200, // Strict output limit for speed
      stopSequences: ['\n\n'], // Early stopping for faster generation
    },
  });
} catch (error) {
  console.warn('Primary AI configuration failed, using fallback:', error);
  // Fallback to simpler configuration
  aiInstance = genkit({
    promptDir: './prompts',
    plugins: [
      googleAI({
        apiKey: process.env.GOOGLE_GENAI_API_KEY,
      }),
    ],
    model: 'googleai/text-bison-001', // Fallback model
    config: {
      temperature: 0.1,
      maxOutputTokens: 200,
    },
  });
}

export const ai = aiInstance;
