import { NextRequest, NextResponse } from 'next/server';
import { searchIngredients } from '@/services/mongo';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').trim();

    if (!q) {
      return NextResponse.json({ results: [] }, { status: 200 });
    }

    const results = await searchIngredients(q);
    return NextResponse.json({ results }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch ingredients' },
      { status: 500 }
    );
  }
}






