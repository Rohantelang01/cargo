import { NextRequest, NextResponse } from 'next/server';

// OpenStreetMap Nominatim API Endpoint
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    // Using the public Nominatim API - a custom User-Agent is required.
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1`, {
      headers: {
        'User-Agent': 'RideShareX/1.0 (a student project)',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenStreetMap API Error:', errorText);
      return NextResponse.json({ error: 'Failed to fetch from OpenStreetMap API' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('OpenStreetMap API request failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
