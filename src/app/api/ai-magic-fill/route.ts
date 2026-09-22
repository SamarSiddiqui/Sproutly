import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { plantName } = await request.json();

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Groq API key missing' }, { status: 500 });
    }

    const systemPrompt = `You are a botanical data API. Given the common nickname of a plant, you must return a strict JSON object with precise botanical data.
    
Plant Name: ${plantName}

Return ONLY a valid JSON object matching this exact schema, with no markdown formatting and no conversational text:
{
  "species": string (The exact scientific/botanical name, e.g., "Monstera deliciosa"),
  "category": string (Must be exactly one of: "Indoor", "Semi-Shade", or "Direct Sun" based on ideal light conditions),
  "waterInterval": number (The ideal average number of days between watering, e.g., 7 for a week, 14 for two weeks, 30 for succulents),
  "isPetFriendly": boolean (true if the plant is non-toxic to cats and dogs, false if it is toxic)
}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate botanical data for ${plantName}.` }
        ],
        temperature: 0.1,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Groq API error response:', errText);
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    let reply = data.choices?.[0]?.message?.content || '{}';
    
    // Safety fallback to strip markdown code blocks if Mistral includes them
    reply = reply.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    let parsed;
    try {
      parsed = JSON.parse(reply);
    } catch (parseError) {
      console.error('Failed to parse Mistral JSON:', reply);
      return NextResponse.json({ species: '', category: 'Indoor', waterInterval: 7, isPetFriendly: false });
    }

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error('Error in AI Magic Fill API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
