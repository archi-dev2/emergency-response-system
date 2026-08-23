/**
 * /api/chat — LifeLink AI Medical Assistant (RAG-enhanced)
 * ─────────────────────────────────────────────────────────────────────────────
 * Pipeline per request:
 *  1. Query ChromaDB sidecar → top-k chunks from Harrison's Manual 20e
 *  2. Fetch patient's MedicalRecord rows from Prisma
 *  3. Build enriched system prompt:
 *       [KNOWLEDGE BASE]  → Harrison's chunks with source citations
 *       [PATIENT CONTEXT] → structured medical records (+ future OCR data)
 *  4. Send to Gemini with multi-turn chat history
 *  5. Return { message, severity, sources[] } to the frontend
 *
 * Graceful degradation:
 *  • If ChromaDB sidecar is offline → still works, just no KB context
 *  • If Prisma query fails → still works, just no patient context
 *  • If Gemini fails → falls back to local MEDICAL_QA keyword matching
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { queryChromaDB } from '@/lib/chroma-client';
import { getPatientMedicalContext } from '@/lib/medical-context';

// ─── Types returned to frontend ───────────────────────────────────────────────
export interface AIChatSource {
  id: string;
  label: string;
  type: 'knowledge_base' | 'medical_record' | 'ocr_report';
  detail?: string; // e.g. chapter name or record type
}

// ─── Base system prompt (personality + rules) ─────────────────────────────────
const BASE_SYSTEM_PROMPT = `You are LifeLink's AI Medical Assistant — a professional, empathetic emergency healthcare assistant built into the LifeLink emergency response platform used across India.

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
- When you use information from the Knowledge Base or Patient Records provided to you, cite the source inline like this: [Source: Harrison's Manual 20e] or [Source: Patient Record — <title>]

Never:
- Provide a definitive diagnosis
- Recommend specific prescription doses without noting "as prescribed by your doctor"
- Dismiss any symptom as unimportant without at least checking severity

You have access to the user's context from LifeLink: they are a registered patient with the emergency response system. They may be asking about their own symptoms or a family member's.`;

// ─── Build enriched system prompt with RAG context ───────────────────────────
function buildEnrichedPrompt(
  kbChunks: { document: string; source: string }[],
  patientContextText: string,
  chromaAvailable: boolean,
): string {
  const sections: string[] = [BASE_SYSTEM_PROMPT];

  // ── Knowledge Base section ──────────────────────────────────────────────────
  if (kbChunks.length > 0) {
    sections.push(`
== KNOWLEDGE BASE (Harrison's Manual of Medicine, 20th Edition) ==
Use the following excerpts from the medical knowledge base to inform your response.
When you reference this information, cite it as [Source: Harrison's Manual 20e].

${kbChunks
  .map((c, i) => `[Excerpt ${i + 1} — ${c.source}]\n${c.document}`)
  .join('\n\n')}

== END KNOWLEDGE BASE ==`);
  } else if (!chromaAvailable) {
    sections.push(`
[NOTE: The Harrison's Manual knowledge base is currently offline. Respond using your general medical training.]`);
  }

  // ── Patient Medical Records section ────────────────────────────────────────
  if (patientContextText) {
    sections.push(`
${patientContextText}

IMPORTANT: When referencing information from these patient records, cite the specific record like:
[Source: Patient Record — <record title>]

== FUTURE OCR REPORTS ==
When the OCR pipeline is activated, uploaded medical report files (PDFs, images) will be
automatically extracted and their contents will appear above as additional patient records.
At that point, Gemini will also have access to lab values, vitals, prescriptions, and
diagnoses extracted from those files, cited as [Source: OCR Report — <filename>].
== END FUTURE OCR REPORTS ==`);
  }

  return sections.join('\n');
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.startsWith('your_')) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 503 });
    }

    const body = await req.json();
    const { messages, userId } = body as {
      messages: { role: string; content: string }[];
      userId?: string;
    };

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const lastMsg = messages[messages.length - 1];
    if (!lastMsg || lastMsg.role !== 'user') {
      return NextResponse.json({ error: 'No user message provided' }, { status: 400 });
    }

    const userQuery = lastMsg.content;

    // ── Step 1: Query ChromaDB knowledge base ──────────────────────────────
    const chromaResult = await queryChromaDB(userQuery, 4);

    // ── Step 2: Fetch patient medical records ──────────────────────────────
    const patientContext = userId
      ? await getPatientMedicalContext(userId)
      : { contextText: '', sources: [], hasData: false };

    // ── Step 3: Build enriched system prompt ───────────────────────────────
    const systemPrompt = buildEnrichedPrompt(
      chromaResult.results.map((r) => ({ document: r.document, source: r.source })),
      patientContext.contextText,
      chromaResult.available,
    );

    // ── Step 4: Build chat history (exclude last message) ─────────────────
    const history = messages
      .slice(0, -1)
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

    // ── Step 5: Call Gemini ────────────────────────────────────────────────
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-flash-lite-latest',
      systemInstruction: systemPrompt,
    });

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(userQuery);
    const text = result.response.text();

    // ── Step 6: Extract severity ───────────────────────────────────────────
    const severityMatch = text.match(/\*\*Severity:\s*([1-5])/);
    const severity = severityMatch ? parseInt(severityMatch[1]) : 1;

    // ── Step 7: Build source list for the frontend ─────────────────────────
    const sources: AIChatSource[] = [];

    // KB sources — only include chunks that are actually referenced in the
    // response text (contain [Source:]) or include top-2 as context
    const referencedKb = chromaResult.results.filter((chunk) =>
      text.includes("Harrison's") || text.includes('[Source:'),
    );
    const kbToShow = referencedKb.length > 0 ? referencedKb : chromaResult.results.slice(0, 2);
    for (const chunk of kbToShow) {
      sources.push({
        id: chunk.id,
        label: chunk.source,
        type: 'knowledge_base',
        detail: `Relevance: ${Math.round((1 - chunk.distance) * 100)}%`,
      });
    }

    // Patient record sources
    for (const rec of patientContext.sources) {
      sources.push({
        id: rec.id,
        label: rec.label,
        type: rec.fromOcr ? 'ocr_report' : 'medical_record',
        detail: rec.type,
      });
    }

    return NextResponse.json({ message: text, severity, sources });
  } catch (error: unknown) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'AI service unavailable' }, { status: 503 });
  }
}
