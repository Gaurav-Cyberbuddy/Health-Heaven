"use server";

/**
 * @fileOverview Generates a motivational health quote using AI.
 *
 * - generateHealthQuote - A function that generates a short health quote.
 * - GenerateHealthQuoteOutput - The return type for the generateHealthQuote function.
 */

import { ai } from "@/ai/ai-instance";
import { z } from "genkit";

const GenerateHealthQuoteOutputSchema = z.object({
  quote: z.string().describe("A short motivational health quote (under 20 words)."),
  author: z.string().optional().describe("Optional author name if applicable."),
});

export type GenerateHealthQuoteOutput = z.infer<typeof GenerateHealthQuoteOutputSchema>;

export async function generateHealthQuote(): Promise<GenerateHealthQuoteOutput> {
  const { performanceMonitor } = await import('@/lib/performance-monitor');
  const operationId = `health-quote-${Date.now()}`;
  
  performanceMonitor.startOperation(operationId);
  const result = await generateHealthQuoteFlow();
  const duration = performanceMonitor.endOperation(operationId);
  
  performanceMonitor.logPerformance(operationId);
  
  return result;
}

const healthQuotePrompt = ai.definePrompt({
  name: "healthQuotePrompt",
  input: {
    schema: z.object({}),
  },
  output: {
    schema: GenerateHealthQuoteOutputSchema,
  },
  config: {
    temperature: 0.1, // Very low temperature for fastest generation
    maxOutputTokens: 50, // Very limited output for speed
    topK: 10, // Minimal token selection
    topP: 0.5, // Minimal randomness
  },
  prompt: `Generate a relevant, contextual health quote based on common health goals and challenges.

The quote should be:
- Short and memorable (under 20 words)
- Relevant to everyday health challenges (motivation, healthy eating, exercise, mindfulness)
- Positive and actionable
- Unique and fresh

Focus on practical health wisdom that applies to most people's daily lives.

Return ONLY the quote in this JSON format:
{
  "quote": "Your relevant health quote here",
  "author": ""
}

Generate a quote that feels personally relevant and motivating.`,
});

const generateHealthQuoteFlow = ai.defineFlow<
  z.ZodObject<{}>,
  typeof GenerateHealthQuoteOutputSchema
>(
  {
    name: "generateHealthQuoteFlow",
    inputSchema: z.object({}),
    outputSchema: GenerateHealthQuoteOutputSchema,
    // Add caching for better performance
    cache: {
      key: () => 'health-quote',
      ttl: 1800, // Cache for 30 minutes
    },
  },
  async () => {
    try {
      const { output } = await healthQuotePrompt({});
      return output!;
    } catch (error) {
      console.error('Health quote generation failed:', error);
      // Return a fallback quote for better UX
      return {
        quote: "Your health is your wealth - take care of your body, it's the only place you have to live.",
        author: ""
      };
    }
  }
);



