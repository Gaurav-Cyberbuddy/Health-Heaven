'use server';

/**
 * @fileOverview Generates a concise assessment summary of ingredients using AI, including food name and type.
 *
 * - generateAssessmentSummary - A function that handles the assessment summary generation.
 * - GenerateAssessmentSummaryInput - The input type for the generateAssessmentSummary function.
 * - GenerateAssessmentSummaryOutput - The return type for the generateAssessmentSummary function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateAssessmentSummaryInputSchema = z.object({
  ingredients: z.string().describe('The ingredients to assess.'),
  foodName: z.string().describe('The name of the food being assessed.'),
  foodType: z.string().describe('The type of food (e.g., snack, meal, dessert).'),
  fetchedData: z.string().optional().describe('Data fetched about the ingredients.'),
  condition: z.string().optional().describe('Primary health condition or goal context (e.g., diabetes, heart health).'),
  objective: z.string().optional().describe('User objective, e.g., become leaner, defend against diabetes.'),
  region: z.string().optional().describe('User region or country (e.g., India, US).'),
  diet: z.string().optional().describe('Dietary pattern (e.g., vegetarian, vegan, halal, jain, keto).'),
  allergies: z.string().optional().describe('Known allergies/intolerances comma-separated (e.g., peanuts, lactose).'),
  age: z.string().optional().describe('Age (years, optional).'),
  sex: z.string().optional().describe('Sex (M/F/Other, optional).'),
  activityLevel: z.string().optional().describe('Activity level (sedentary, light, moderate, high).'),
});
export type GenerateAssessmentSummaryInput = z.infer<typeof GenerateAssessmentSummaryInputSchema>;

const GenerateAssessmentSummaryOutputSchema = z.object({
  summary: z.string().describe('Detailed health analysis with Quick Assessment, Star Rating, Overall Analysis, and Certified Proof sections.'),
});
export type GenerateAssessmentSummaryOutput = z.infer<typeof GenerateAssessmentSummaryOutputSchema>;

export async function generateAssessmentSummary(input: GenerateAssessmentSummaryInput): Promise<GenerateAssessmentSummaryOutput> {
  const { performanceMonitor } = await import('@/lib/performance-monitor');
  const operationId = `assessment-${input.foodName}-${Date.now()}`;
  
  performanceMonitor.startOperation(operationId);
  const result = await generateAssessmentSummaryFlow(input);
  const duration = performanceMonitor.endOperation(operationId);
  
  performanceMonitor.logPerformance(operationId);
  
  return result;
}

const assessmentSummaryPrompt = ai.definePrompt({
  name: 'certifiedFoodHealthAnalyzer',
  input: {
    schema: z.object({
      ingredients: z.string().describe('The ingredients to assess.'),
      foodName: z.string().describe('The name of the food being assessed.'),
      foodType: z.string().describe('The type of food (e.g., snack, meal, dessert).'),
      fetchedData: z.string().optional().describe('Data fetched about the ingredients.'),
      condition: z.string().optional().describe('Primary health condition or goal context.'),
      objective: z.string().optional().describe('User objective context.'),
      region: z.string().optional().describe('Region or country.'),
      diet: z.string().optional().describe('Dietary pattern.'),
      allergies: z.string().optional().describe('Allergies/intolerances.'),
      age: z.string().optional().describe('Age.'),
      sex: z.string().optional().describe('Sex.'),
      activityLevel: z.string().optional().describe('Activity level.'),
    }),
  },
  output: {
    schema: z.object({
      summary: z.string().describe('A summary of the assessment.'),
    }),
  },
  config: {
    temperature: 0.2, // Lower temperature for faster, more focused responses
    maxOutputTokens: 250, // Limit output length for faster generation
    topK: 15, // Limit token selection for faster generation
    topP: 0.7, // Reduce randomness for more predictable responses
  },
  prompt: `You are a certified food health analyzer with access to global nutritional standards (WHO, FDA, USDA, AHA).

  Analyze the food based on the following structured inputs:
  Food Name: {{{foodName}}}
  Food Type: {{{foodType}}}
  Ingredients: {{{ingredients}}}
  {{#if fetchedData}}
  Fetched Data: {{{fetchedData}}}
  {{/if}}
  {{#if condition}}
  Primary Condition: {{{condition}}}
  {{/if}}
  {{#if objective}}
  Objective: {{{objective}}}
  {{/if}}
  {{#if region}}
  Region: {{{region}}}
  {{/if}}
  {{#if diet}}
  Diet: {{{diet}}}
  {{/if}}
  {{#if allergies}}
  Allergies: {{{allergies}}}
  {{/if}}
  {{#if age}}
  Age: {{{age}}}
  {{/if}}
  {{#if sex}}
  Sex: {{{sex}}}
  {{/if}}
  {{#if activityLevel}}
  Activity level: {{{activityLevel}}}
  {{/if}}

  CRITICAL INSTRUCTIONS:
  - You MUST follow the exact format below with all 4 sections
  - Use specific numbers and measurements from WHO/FDA/USDA/AHA standards
  - Reference the user's condition and objective specifically
  - Provide evidence-based recommendations with citations

  FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

  Result:
  [2-3 sentences analyzing this specific food for the user's condition/objective]
  Star Rating: X/10
  [Rating with brief justification based on user's needs]
  Overall Analysis:
  - Strengths: [Specific nutritional benefits with numbers]
  - Concerns: [Specific health concerns with numbers]
  - Safe consumption: [X grams or Y servings daily]

  Proof:
  - "[WHO/FDA/USDA/AHA standard with specific numbers]"
  - "[Another global standard with specific numbers]"

  IMPORTANT: Be specific to this food and user's context. No generic advice.
  `,
});

const generateAssessmentSummaryFlow = ai.defineFlow<
  typeof GenerateAssessmentSummaryInputSchema,
  typeof GenerateAssessmentSummaryOutputSchema
>({
  name: 'certifiedHealthAnalyzerFlow',
  inputSchema: GenerateAssessmentSummaryInputSchema,
  outputSchema: GenerateAssessmentSummaryOutputSchema,
  // Temporarily disable caching to ensure fresh responses
  // cache: {
  //   key: (input) => JSON.stringify({
  //     ingredients: input.ingredients,
  //     foodName: input.foodName,
  //     foodType: input.foodType,
  //     condition: input.condition,
  //     diet: input.diet,
  //     allergies: input.allergies,
  //   }),
  //   ttl: 3600, // Cache for 1 hour
  // },
}, async input => {
  try {
    const {output} = await assessmentSummaryPrompt(input);
    return output!;
  } catch (error) {
    console.error('Assessment generation failed:', error);
    // Return a fallback response for better UX
    return {
      summary: `Quick Assessment: Based on the ingredients provided, this ${input.foodName} appears to be ${input.foodType}. For personalized health advice, please consult a healthcare professional.`
    };
  }
});
