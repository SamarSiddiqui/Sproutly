import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { query, plants } = await req.json();

    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Mistral API key missing' }, { status: 500 });
    }

    if (!query || !plants) {
      return NextResponse.json({ error: 'Missing query or plants data' }, { status: 400 });
    }

    const systemPrompt = `You are Sproutly AI, a smart gardening assistant. 
Your task is to act as a semantic search engine for the user's plant collection.
The user will ask a natural language question (e.g. "Which plants need water?", "Show me my indoor plants", "Low light plants").
You will be provided with a JSON array representing the user's plant collection. Each object contains the plant's id, name, species, category, growthStage, lastWatered, nextWatering.

Analyze the user's query and compare it against the provided plants array. 
Determine which plants match the user's intent. 
For example:
- If the user asks about watering, compare the current date with the nextWatering date.
- If the user asks about light, check the category (e.g., 'Indoor' usually implies lower light than 'Direct Sun').

You must respond ONLY with a strict JSON object matching this schema:
{
  "matchingIds": [string, string] (An array of plant IDs that match the query. Return an empty array if no plants match.)
}

Do not include markdown blocks, explanations, or any other text. Return ONLY the raw JSON object.`;

    const userMessage = `Current Date: ${new Date().toISOString()}
User Query: "${query}"
User's Collection: ${JSON.stringify(plants, null, 2)}`;

    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const cleanJson = content.replace(/```json\n?|\n?```/g, '').trim();
    const parsedData = JSON.parse(cleanJson);

    return NextResponse.json(parsedData);
  } catch (error) {
    console.error('Error in ai-collection-search route:', error);
    return NextResponse.json({ matchingIds: [] }, { status: 500 });
  }
}
