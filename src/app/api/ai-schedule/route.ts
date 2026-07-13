import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { forecast, plant } = await request.json();

    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Mistral API key missing' }, { status: 500 });
    }

    const systemPrompt = `You are Sproutly AI, a botanical scheduling expert.
Your task is to evaluate the 7-day weather forecast against a specific plant's context and determine if its watering schedule needs adjustment.
Return ONLY valid JSON. No conversational text.

Plant Details:
- Name: ${plant.name}
- Category: ${plant.category} (Indoor, Semi-Shade, or Direct Sun)
- Next Watering Due: ${new Date(plant.nextWatering).toLocaleDateString()}

Weather Forecast:
${JSON.stringify(forecast, null, 2)}

Rules for Adjustment:
1. If the plant is 'Indoor', weather generally has less impact, but extreme heatwaves might slightly accelerate watering.
2. If the plant is 'Direct Sun' or 'Semi-Shade' (outdoor):
   - Delay watering (positive daysOff) if high probability of rain (>50%) is expected on or near the 'Next Watering Due' date.
   - Accelerate watering (negative daysOff) if a severe heatwave (temp > 35°C) is expected on or near the due date.
3. If no significant weather events align with the watering date, do not adjust (adjusted: false).
4. Do not output markdown codeblocks. Output raw JSON.

Output JSON Schema:
{
  "adjusted": boolean,
  "daysOff": number (e.g. 2 means delay by 2 days, -1 means water 1 day earlier. 0 if no adjustment),
  "reason": string (A concise, user-friendly UI badge message starting with "AI Adjusted:". Only provide reason if adjusted is true, else empty string.)
}`;

    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Analyze the plant and weather, and provide the JSON adjustment.' }
        ],
        temperature: 0.1, // low temp for deterministic JSON output
        max_tokens: 150
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Mistral API error response:', errText);
      throw new Error(`Mistral API error: ${response.statusText}`);
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
      return NextResponse.json({ adjusted: false, daysOff: 0, reason: '' });
    }

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error('Error in AI Schedule API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
