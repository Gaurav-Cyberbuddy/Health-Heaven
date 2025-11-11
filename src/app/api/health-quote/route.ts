import { NextRequest, NextResponse } from "next/server";
import { generateHealthQuote } from "@/ai/flows/generate-health-quote";

export async function GET(req: NextRequest) {
  try {
    // Check if API key is available
    if (!process.env.GOOGLE_GENAI_API_KEY) {
      return NextResponse.json(
        { error: "AI service unavailable" },
        { status: 503 }
      );
    }

    // Generate quote using Gemini
    const result = await generateHealthQuote();

    return NextResponse.json(
      {
        quote: result.quote,
        author: result.author,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error generating health quote:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate quote" },
      { status: 500 }
    );
  }
}



