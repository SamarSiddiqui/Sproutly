import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { plant, weather } = await request.json();

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Groq API key missing' }, { status: 500 });
    }

    const systemPrompt = `You are Sproutly AI, a phenomenal expert botanist assistant. 
Your task is to analyze the specific plant and weather context and return exactly 4 unique AI insights in a strict JSON object.

Plant Context:
- Name: ${plant.name}
- Species: ${plant.species}
- Category: ${plant.category}
- Growth Stage: ${plant.growthStage}
- Health: ${plant.healthStatus}
- Last Watered: ${new Date(plant.lastWatered).toDateString()} (Next due: ${new Date(plant.nextWatering).toDateString()})

Weather Context:
${weather ? `Current condition: ${weather.text}, Temp: ${weather.temp}°C, Rain Probability: ${weather.rainProbability}%` : 'Unknown'}

Return ONLY a valid JSON object matching this exact schema, with no markdown code blocks and no conversational text:
{
  "dailyVibe": string (A one-sentence, glowing and enthusiastic summary of how the plant is doing today and the most immediate care advice. E.g. "Your Monstera is thriving in this 25°C weather; just remember to wipe its leaves this weekend!"),
  "growthInsights": string (A concise tip about what this specific plant species needs right now during its current 'Growth Stage' phase. E.g. "During the Flowering stage, this plant needs extra phosphorus to support bloom development."),
  "coreCareTips": [
    { "title": "Pruning", "tip": string },
    { "title": "Environment", "tip": string },
    { "title": "Core Care", "tip": string }
  ] (An array of exactly 3 expert, species-specific tips covering pruning, environment/sunlight, and general core care.),
  "fertilizerRecommendations": string (A short paragraph recommending the ideal N-P-K ratio and organic fertilizer alternatives for this specific plant species and growth stage.)
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
          { role: 'user', content: 'Generate the care insights.' }
        ],
        temperature: 0.3,
        max_tokens: 400
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
      return NextResponse.json({ 
        dailyVibe: 'Your plant is looking great today!',
        growthInsights: 'Provide adequate light and water for optimal growth.',
        coreCareTips: [
          { title: 'Pruning', tip: 'Remove yellow leaves.' },
          { title: 'Environment', tip: 'Keep away from drafts.' },
          { title: 'Core Care', tip: 'Wipe leaves with a damp cloth.' }
        ],
        fertilizerRecommendations: 'Use a balanced all-purpose fertilizer during the growing season.'
      });
    }

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error('Error in AI Care Insights API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
