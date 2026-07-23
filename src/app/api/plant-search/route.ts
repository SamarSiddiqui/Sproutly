import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { query, featured } = await request.json();

    const apiKey = process.env.NEXT_PUBLIC_PERENUAL_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Perenual API key missing' }, { status: 500 });
    }

    let url = '';
    if (featured || !query) {
      // Perenual doesn't have a "featured" endpoint, so we just get page 1 with no query
      url = `https://perenual.com/api/species-list?key=${apiKey}&page=1`;
    } else {
      url = `https://perenual.com/api/species-list?key=${apiKey}&q=${encodeURIComponent(query)}&page=1`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Perenual API failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Normalize to the UI's expected format
    const normalizedData = (data.data || []).map((p: any) => ({
      id: p.id,
      common_name: p.common_name || 'Unknown',
      scientific_name: p.scientific_name?.[0] || 'Unknown',
      image_url: p.default_image?.regular_url || null
    }));

    return NextResponse.json({
      data: normalizedData,
      currentPage: data.current_page || 1,
      lastPage: data.last_page || 1,
      total: data.total || normalizedData.length
    });

  } catch (error: any) {
    console.error('Error in plant search route:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
