/**
 * Fallback AI configuration with multiple model options
 * for optimal performance and reliability
 */

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Available models in order of preference (speed vs capability)
const MODEL_OPTIONS = [
  'googleai/gemini-pro',           // Primary: Good balance of speed and capability
  'googleai/gemini-pro-vision',    // Fallback: Vision model (also good for text)
  'googleai/text-bison-001',       // Legacy fallback: Text-only model
];

// Performance-optimized configuration
const PERFORMANCE_CONFIG = {
  temperature: 0.1,      // Very low for fastest responses
  topK: 10,               // Minimal token selection
  topP: 0.6,              // Minimal randomness
  maxOutputTokens: 200,   // Strict output limit
  stopSequences: ['\n\n'], // Early stopping for faster generation
};

export function createAIOptions(modelName: string) {
  return {
    promptDir: './prompts',
    plugins: [
      googleAI({
        apiKey: process.env.GOOGLE_GENAI_API_KEY,
      }),
    ],
    model: modelName,
    config: PERFORMANCE_CONFIG,
  };
}

export function createAIWithFallback() {
  // Try to create AI instance with primary model
  try {
    return genkit(createAIOptions(MODEL_OPTIONS[0]));
  } catch (error) {
    console.warn(`Primary model ${MODEL_OPTIONS[0]} failed, trying fallback models`);
    
    // Try each fallback model
    for (let i = 1; i < MODEL_OPTIONS.length; i++) {
      try {
        console.log(`Trying fallback model: ${MODEL_OPTIONS[i]}`);
        return genkit(createAIOptions(MODEL_OPTIONS[i]));
      } catch (fallbackError) {
        console.warn(`Fallback model ${MODEL_OPTIONS[i]} also failed`);
        continue;
      }
    }
    
    throw new Error('All AI models failed to initialize');
  }
}