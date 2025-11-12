'use server';

/**
 * @fileOverview Generates a concise assessment summary of ingredients using Gemini 1.5.
 *
 * - generateAssessmentSummary - A function that handles AI-based food analysis.
 * - Uses the direct Gemini API helper (callGemini) from ai-instance.ts.
 */

import { callGemini } from "@/ai/ai-instance";
import { z } from "genkit";

/* -------------------------------------------------------------------------- */
/*                                Input Schema                                */
/* -------------------------------------------------------------------------- */

const GenerateAssessmentSummaryInputSchema = z.object({
  ingredients: z.string().describe("The ingredients to assess."),
  foodName: z.string().describe("The name of the food being assessed."),
  foodType: z
    .string()
    .describe("The type of food (e.g., snack, meal, dessert)."),
  fetchedData: z
    .string()
    .optional()
    .describe("Data fetched about the ingredients."),
  condition: z
    .string()
    .optional()
    .describe("Primary health condition or goal context (e.g., diabetes)."),
  objective: z
    .string()
    .optional()
    .describe("User objective (e.g., leaner, heart health)."),
  region: z.string().optional().describe("User region or country."),
  diet: z.string().optional().describe("Dietary pattern."),
  allergies: z.string().optional().describe("Allergies/intolerances."),
  age: z.string().optional().describe("Age (years, optional)."),
  sex: z.string().optional().describe("Sex (M/F/Other, optional)."),
  activityLevel: z
    .string()
    .optional()
    .describe("Activity level (sedentary, light, moderate, high)."),
});

export type GenerateAssessmentSummaryInput = z.infer<
  typeof GenerateAssessmentSummaryInputSchema
>;

/* -------------------------------------------------------------------------- */
/*                                Output Schema                               */
/* -------------------------------------------------------------------------- */

const GenerateAssessmentSummaryOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      "Detailed health analysis with Quick Assessment, Star Rating, Overall Analysis, and Certified Proof sections."
    ),
  meta: z
    .object({
      fallback: z.boolean().optional(),
      error: z.string().optional(),
    })
    .optional(),
});

export type GenerateAssessmentSummaryOutput = z.infer<
  typeof GenerateAssessmentSummaryOutputSchema
>;

/* -------------------------------------------------------------------------- */
/*                            Main AI Function Logic                          */
/* -------------------------------------------------------------------------- */

export async function generateAssessmentSummary(
  input: GenerateAssessmentSummaryInput
): Promise<GenerateAssessmentSummaryOutput> {
  try {
    const { performanceMonitor } = await import("@/lib/performance-monitor");
    const operationId = `assessment-${input.foodName}-${Date.now()}`;
    performanceMonitor.startOperation(operationId);

    /* -------------------------- Build the Gemini prompt ------------------------- */
const prompt = `
You are a certified food & nutrition expert. Use the exact inputs below and produce a structured, evidence-backed health analysis.

INPUTS:
- Food Name: ${input.foodName}
- Ingredients: ${input.ingredients}
- Food Type: ${input.foodType}
- Objective: ${input.objective || "General wellness"}
- Health Condition: ${input.condition || "None"}
- Region: ${input.region || "Not specified"}
- Diet: ${input.diet || "Not specified"}
- Allergies: ${input.allergies || "None"}
- Age: ${input.age || "Not specified"}
- Sex: ${input.sex || "Not specified"}
- Activity Level: ${input.activityLevel || "Not specified"}

INSTRUCTIONS:
1. Analyze the inputs only — no generic text.
2. Use real WHO/FDA/USDA/AHA guidelines where relevant.
3. Ensure each section is context-specific.

OUTPUT FORMAT:
1. Quick Assessment:
   [2–3 lines tailored to ${input.foodName} and ${input.ingredients}]
2. Star Rating:
   [X/10 — with a one-line justification tied to ${input.objective}]
3. Overall Analysis:
   - Strengths: [specific to ${input.foodName} and ingredients]
   - Concerns: [specific to ${input.condition} or ${input.diet}]
   - Safe Consumption: [specific quantity guidance]
4. Certified Proof:
   - [Cite 1 WHO/FDA/USDA/AHA standard relevant to this case]
   - [Optional: 1 more evidence-based reference]

End.
`;

CRITICAL INSTRUCTIONS:
- Follow the exact format below with all 4 sections.
- Use specific values from WHO/FDA/USDA/AHA standards.
- Reference the user's condition and objective specifically.
- Provide factual, concise, and evidence-based recommendations.

FORMAT:
1. **Quick Assessment:** [2–3 sentences analyzing the food]
2. **Star Rating:** X/10 — justification
3. **Overall Analysis:**
   - Strengths: [Nutritional benefits with numbers]
   - Concerns: [Health risks with numbers]
   - Safe consumption: [X grams or Y servings daily]
4. **Certified Proof:**
   - "[WHO/FDA/USDA/AHA guideline with data]"
   - "[Another global standard or citation]"
`;

    /* ------------------------------ Call Gemini ------------------------------ */
    const summary = await callGemini(prompt);

    performanceMonitor.endOperation(operationId);
    performanceMonitor.logPerformance(operationId);

    return {
      summary,
      meta: { fallback: false },
    };
  } catch (error: any) {
    console.error("Assessment generation failed:", error);

    const fallback = `Quick Assessment: Based on the ingredients provided, ${input.foodName} appears to be ${input.foodType}. For personalized health advice, consult a nutrition expert.`;

    return {
      summary: fallback,
      meta: {
        fallback: true,
        error: error.message || String(error),
      },
    };
  }
}
