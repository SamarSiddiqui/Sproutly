import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { location, plants, date } = await request.json();

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Groq API key is not configured on the server.' },
        { status: 500 }
      );
    }

    const plantsContext = plants && plants.length > 0
      ? `The user has the following plants in their garden collection:\n` +
        plants.map((p: any) => `- **${p.name}** (${p.species})`).join('\n')
      : 'The user has no plants in their collection yet.';

    const systemPrompt = `You are Sproutly AI, a warm, encouraging, and highly knowledgeable plant-care assistant.
Your goal is to provide a very concise, 3-point proactive seasonal care advisory tailored to the user's local climate/season and specific plants.
Current Date: ${date}
Location: ${location || 'Unknown'}

${plantsContext}

Write a concise, 3-point checklist of things the user should consider for their plants this season. Do NOT use any emojis. Keep it under 100 words. Format it directly as a markdown list without any introductory filler (e.g. no "Here is your advice:").`;

    // Map messages to Groq expected chat format
    const formattedMessages = [
      { role: 'user', content: systemPrompt }
    ];

    // Call Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Groq API error response:', errText);
      return NextResponse.json(
        { error: `Groq API request failed (${response.status}): ${errText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that response.";

    return NextResponse.json({ advice: reply });
  } catch (error: any) {
    console.error('Error in seasonal advisor API route:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
