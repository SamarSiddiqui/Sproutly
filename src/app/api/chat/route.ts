import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { messages, plants } = await request.json();

    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Mistral API key is not configured on the server.' },
        { status: 500 }
      );
    }

    // Build standard system prompt incorporating user's actual plant collection context
    const plantsContext = plants && plants.length > 0
      ? `The user has the following plants in their garden collection:\n` +
        plants.map((p: any) => 
          `- **${p.name}** (${p.species}): Category: ${p.category}, Growth Stage: ${p.growthStage}, Health: ${p.healthStatus}, Last watered: ${p.lastWatered ? new Date(p.lastWatered).toLocaleDateString() : 'N/A'}, Next watering: ${p.nextWatering ? new Date(p.nextWatering).toLocaleDateString() : 'N/A'}, Notes: "${p.notes || ''}"`
        ).join('\n')
      : 'The user has no plants in their collection yet. Encourage them to add some plants to start.';

    const systemPrompt = `You are Sproutly AI, a warm, encouraging, and highly knowledgeable plant-care assistant.
Your goal is to help users keep their gardens thriving. Be concise, friendly, and practical.
Use markdown for formatting list items or emphasizing important tips.

${plantsContext}

Please tailor your advice to these specific plants whenever the user mentions them or asks general care questions that could apply to their garden.`;

    // Map messages to Mistral's expected chat format
    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((msg: any) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }))
    ];

    // Call Mistral API
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Mistral API error response:', errText);
      return NextResponse.json(
        { error: `Mistral API request failed: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that response.";

    return NextResponse.json({ text: reply });
  } catch (error: any) {
    console.error('Error in chat API route:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
