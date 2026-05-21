import { NextResponse } from 'next/server';
import { translateText } from '@/lib/translate';

export async function POST(request: Request) {
  try {
    const { description, features, property_type } = await request.json();

    // Translate all fields in parallel
    const [translatedDescription, translatedPropertyType, ...translatedFeatures] = await Promise.all([
      translateText(description, 'es'),
      translateText(property_type, 'es'),
      ...features.map((feature: string) => translateText(feature, 'es'))
    ]);

    return NextResponse.json({
      description: translatedDescription,
      property_type: translatedPropertyType,
      features: translatedFeatures,
    });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    );
  }
}
