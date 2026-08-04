import { NextResponse } from 'next/server';
import { supabase } from '../../../utils/supabaseClient';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown-ip';

    // 1. Enforce 10 messages / 24h limit for Free accounts
    const { data: limitData } = await supabase
      .from('demo_rate_limits')
      .select('*')
      .eq('ip_address', ip)
      .single();

    let currentCount = 0;
    if (limitData) {
      const lastRequestDate = new Date(limitData.last_request_at);
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      if (lastRequestDate < oneDayAgo) {
        currentCount = 0;
      } else {
        currentCount = limitData.request_count;
      }
    }

    if (currentCount >= 10) {
      return NextResponse.json(
        {
          error: 'DAILY_CHAT_LIMIT_REACHED',
          message: 'You have reached your free AI messages for today. Upgrade to Sproutly Pro for unlimited AI consultations!',
        },
        { status: 429 }
      );
    }

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

Please tailor your advice to these specific plants whenever the user mentions them or asks general care questions that could apply to their garden.

CRITICAL GUARDRAILS:
1. You must ONLY answer questions related to plant care, botany, gardening, horticulture, and plant health.
2. If the user asks a question that is NOT related to plants, gardening, or botany (e.g., coding, math, general chit-chat, cooking, etc.), you must politely decline to answer and redirect them back to plant-related topics (e.g., "I'm sorry, I'm Sproutly AI, and I can only help you with questions related to plant care and gardening. How is your garden doing today?").
3. Do not make up information or hallucinate facts. If you do not know the answer or lack confidence, suggest they check the Sproutly Knowledge Hub or consult a local gardener.`;

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

    // 2. Increment request count on success
    await supabase.from('demo_rate_limits').upsert({
      ip_address: ip,
      request_count: currentCount + 1,
      last_request_at: new Date().toISOString(),
    });

    return NextResponse.json({ text: reply, remaining: 9 - currentCount });
  } catch (error: any) {
    console.error('Error in chat API route:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
