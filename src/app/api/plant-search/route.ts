import { NextResponse } from 'next/server';

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&q=80&w=800';

export async function POST(request: Request) {
  try {
    const { query, featured } = await request.json();

    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Mistral API key missing' }, { status: 500 });
    }

    let prompt = '';
    if (featured || !query) {
      prompt = `List 10 of the most popular and common houseplants, terrace plants, and garden vegetables.`;
    } else {
      prompt = `Search for plants matching the query: "${query}". Return up to 10 highly relevant matches. Prioritize common household plants, terrace plants, and vegetables. Do NOT return obscure subspecies or wild weeds unless specifically requested.`;
    }

    const systemPrompt = `You are a botanical database API. You must return ONLY raw JSON. Do NOT wrap the JSON in markdown code blocks like \`\`\`json. Just output the raw JSON string starting with { and ending with }.
Your JSON must strictly match this structure:
{
  "plants": [
    {
      "id": "generate-a-short-random-string",
      "common_name": "Common Name",
      "scientific_name": "Scientific Name"
    }
  ]
}

${prompt}`;

    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: [{ role: 'user', content: systemPrompt }],
        temperature: 0.2, // Low temperature for factual consistency
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Mistral API error', err);
      throw new Error('Mistral API failed');
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || '{}';
    
    // Fallback markdown stripping just in case the AI wraps it
    content = content.replace(/^```json\n?/i, '').replace(/```$/i, '').trim();
    
    let parsedData = { plants: [] };
    try {
      parsedData = JSON.parse(content);
    } catch (e) {
      console.error('Failed to parse Mistral JSON:', content);
    }

    // Normalize to the UI's expected format and inject the default placeholder image
    const normalizedData = (parsedData.plants || []).map((p: any) => ({
      id: p.id || Math.random().toString(36).substring(2, 9),
      common_name: p.common_name || 'Unknown',
      scientific_name: p.scientific_name || 'Unknown',
      image_url: DEFAULT_FALLBACK_IMAGE
    }));

    return NextResponse.json({
      data: normalizedData,
      currentPage: 1,
      lastPage: 1,
      total: normalizedData.length
    });

  } catch (error: any) {
    console.error('Error in plant search route:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
