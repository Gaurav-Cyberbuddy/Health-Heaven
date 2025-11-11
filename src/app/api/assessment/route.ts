import { NextRequest, NextResponse } from 'next/server';
import { generateAssessmentSummary } from '@/ai/flows/generate-assessment-summary';

// Retry function with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Check if it's a rate limit error (429)
      const isRateLimit = error?.message?.includes('429') || 
                         error?.message?.includes('Too Many Requests') ||
                         error?.message?.includes('Resource exhausted');
      
      if (isRateLimit && attempt < maxRetries - 1) {
        // Exponential backoff: 1s, 2s, 4s
        const delay = initialDelay * Math.pow(2, attempt);
        console.log(`Rate limit hit. Retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      // If not a rate limit error or last attempt, throw
      throw error;
    }
  }
  
  throw lastError;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const ingredients = (body?.ingredients || '').trim();
    const foodName = (body?.foodName || '').trim();
    const foodType = (body?.foodType || '').trim();
    const condition = (body?.condition || '').trim();
    const objective = (body?.objective || '').trim();
    const region = (body?.region || '').trim();
    const diet = (body?.diet || '').trim();
    const allergies = (body?.allergies || '').trim();
    const age = (body?.age || '').trim();
    const sex = (body?.sex || '').trim();
    const activityLevel = (body?.activityLevel || '').trim();

    if (!ingredients || !foodName || !foodType) {
      return NextResponse.json(
        { error: 'ingredients, foodName and foodType are required' },
        { status: 400 }
      );
    }

    if (!process.env.GOOGLE_GENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Missing GOOGLE_GENAI_API_KEY in environment' },
        { status: 500 }
      );
    }

    // Retry with exponential backoff for rate limits
    const result = await retryWithBackoff(async () => {
      return await generateAssessmentSummary({
        ingredients,
        foodName,
        foodType,
        condition: condition || undefined,
        objective: objective || undefined,
        region: region || undefined,
        diet: diet || undefined,
        allergies: allergies || undefined,
        age: age || undefined,
        sex: sex || undefined,
        activityLevel: activityLevel || undefined,
      });
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    // Check for rate limit errors
    const isRateLimit = error?.message?.includes('429') || 
                       error?.message?.includes('Too Many Requests') ||
                       error?.message?.includes('Resource exhausted');
    
    if (isRateLimit) {
      return NextResponse.json(
        { 
          error: 'API rate limit exceeded. Please wait a moment and try again. The system will automatically retry.',
          code: 'RATE_LIMIT',
          retryAfter: 60 // Suggest waiting 60 seconds
        },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { error: error?.message || 'Failed to generate assessment' },
      { status: 500 }
    );
  }
}



