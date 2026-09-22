import { NextResponse } from 'next/server';
import { supabase } from '../../../utils/supabaseClient';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown-ip';
    
    // 1. Fetch current limit from Supabase
    const { data: limitData } = await supabase
      .from('demo_rate_limits')
      .select('*')
      .eq('ip_address', ip)
      .single();

    let currentCount = 0;
    
    if (limitData) {
      // TTL Check: Reset count if the last request was more than 15 days ago
      const lastRequestDate = new Date(limitData.last_request_at);
      const fifteenDaysAgo = new Date();
      fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
      
      if (lastRequestDate < fifteenDaysAgo) {
        currentCount = 0;
      } else {
        currentCount = limitData.request_count;
      }
    }

    if (currentCount >= 3) {
      return NextResponse.json({ error: 'Rate limit reached' }, { status: 429 });
    }

    const { message } = await request.json();

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Groq API key missing' }, { status: 500 });
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

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.5,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'I encountered an error. Please try again later.';
    
    // 2. Upsert the new count to Supabase
    await supabase.from('demo_rate_limits').upsert({
      ip_address: ip,
      request_count: currentCount + 1,
      last_request_at: new Date().toISOString()
    });

    return NextResponse.json({ reply, remaining: 2 - currentCount });
  } catch (error) {
    console.error('AI Preview Error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
