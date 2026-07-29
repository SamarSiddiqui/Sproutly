import { NextResponse } from 'next/server';

// In-memory store for IP rate limiting. 
// Note: In a true multi-region serverless deployment, you'd use Redis (Upstash) here.
const ipRateLimit = new Map<string, number>();

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown-ip';
    const currentCount = ipRateLimit.get(ip) || 0;

    if (currentCount >= 5) {
      return NextResponse.json({ error: 'Rate limit reached' }, { status: 429 });
    }

    const { message } = await request.json();

    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Mistral API key missing' }, { status: 500 });
    }

    const systemPrompt = `You are Sproutly AI, a friendly and highly knowledgeable botanical AI assistant.
You are currently talking to a user on the Sproutly landing page.
Your job is to answer their gardening/plant question accurately but concisely.

STRICT RULES:
1. If the user's message contains profanity, completely refuse to answer.
2. If the user's message is completely unrelated to plants, gardening, or nature, gracefully refuse to answer and politely remind them you are an AI Botanist.
3. Keep your actual answer EXTREMELY concise. Maximum 1 to 2 short sentences.
4. Your final sentence MUST ALWAYS BE a call-to-action (CTA) encouraging them to sign up. For example: "Sign up for a free account for a custom care plan!" or "Create an account to track this plant!".
5. Be friendly, use emojis occasionally.
6. OUTPUT PLAIN TEXT ONLY. DO NOT use any markdown formatting (no asterisks, no bold, no italics).`;

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
          { role: 'user', content: message }
        ],
        temperature: 0.5,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.statusText}`);
    }

    const data = await response.json();
    let reply = data.choices?.[0]?.message?.content || 'I encountered an error. Please try again later.';
    
    // Increment the rate limit count
    ipRateLimit.set(ip, currentCount + 1);

    return NextResponse.json({ reply, remaining: 4 - currentCount });
  } catch (error) {
    console.error('AI Preview Error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
