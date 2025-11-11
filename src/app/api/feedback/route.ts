import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const FeedbackSchema = z.object({
  message: z.string().min(5, 'Message must be at least 5 characters'),
  rating: z.number().int().min(1).max(5).optional(),
  email: z.string().email().optional(),
  page: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = FeedbackSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { message, rating, email, page } = parsed.data;
    const userAgent = req.headers.get('user-agent') || undefined;

    // Try to store in Mongo if available; otherwise fallback to a no-op placeholder.
    try {
      const { saveFeedback } = await import('@/services/mongo');
      await saveFeedback({
        message,
        rating,
        email,
        page,
        userAgent,
      });
    } catch {
      // Placeholder path: If DB is not configured, simulate success.
      console.log('[feedback] placeholder store:', {
        message,
        rating,
        email,
        page,
        userAgent,
      });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}



