import { NextResponse } from 'next/server';
import { translateText } from '@/lib/translate';

export async function POST(request: Request) {
  try {
    const { description, highlights, why_invest, country } = await request.json();

    const results = await Promise.all([
      description ? translateText(description, 'es') : Promise.resolve(''),
      country ? translateText(country, 'es') : Promise.resolve(''),
      ...highlights.map((h: string) => translateText(h, 'es')),
      ...why_invest.map((w: string) => translateText(w, 'es')),
    ]);

    const countryEs = results[1];
    const highlightsEs = results.slice(2, 2 + highlights.length);
    const whyInvestEs = results.slice(2 + highlights.length);

    return NextResponse.json({
      description_es: results[0],
      country_es: countryEs,
      highlights_es: highlightsEs,
      why_invest_es: whyInvestEs,
    });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
