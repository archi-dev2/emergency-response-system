import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are LifeLink's AI Medical Assistant — a professional, empathetic emergency healthcare assistant built into the LifeLink emergency response platform used across India.

Your role:
- Provide clear, accurate medical guidance for symptoms and emergencies
- Give first-aid instructions when needed
- Assess severity and recommend appropriate urgency level (1-5 scale)
- Always remind users to call 108 for life-threatening emergencies
- Tailor responses to Indian healthcare context (use Indian hospital names, costs in ₹, Indian health conditions prevalence)

Response format:
- Be concise but thorough — 3-6 sentences for mild issues, more detail for serious ones
- Use bullet points for steps/instructions
- Always end with a severity indicator: **Severity: [1-5] — [Mild/Moderate/Serious/Critical/Emergency]**
- For severity 4-5, always recommend calling 108 immediately
- Use markdown bold for key warnings

Never:
- Provide a definitive diagnosis
- Recommend specific prescription doses without noting "as prescribed by your doctor"
- Dismiss any symptom as unimportant without at least checking severity

You have access to the user's context from LifeLink: they are a registered patient with the emergency response system. They may be asking about their own symptoms or a family member's.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Convert to Anthropic message format
    const anthropicMessages = messages
      .filter((m: { role: string; content: string }) => m.role === 'user' || m.role === 'assistant')
      .map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

    if (anthropicMessages.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
    }

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: anthropicMessages,
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      return NextResponse.json({ error: 'Unexpected response type' }, { status: 500 });
    }

    // Extract severity from response text (look for "Severity: X")
    const severityMatch = content.text.match(/\*\*Severity:\s*([1-5])/);
    const severity = severityMatch ? parseInt(severityMatch[1]) : 1;

    return NextResponse.json({
      message: content.text,
      severity,
    });
  } catch (error: unknown) {
    console.error('Chat API error:', error);

    // Return a helpful fallback if API key is missing/invalid
    const err = error as { status?: number; message?: string };
    if (err?.status === 401 || err?.message?.includes('API key')) {
      return NextResponse.json({
        message: 'AI service not configured. Please set ANTHROPIC_API_KEY in environment variables.\n\n**Severity: 1 — Mild**',
        severity: 1,
        fallback: true,
      });
    }

    return NextResponse.json(
      { error: 'Failed to get AI response', details: err?.message },
      { status: 500 }
    );
  }
}
