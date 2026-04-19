import { NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`

/**
 * POST /api/admin/enhance-text
 * Enhances a given text using Google Gemini - fixes spelling, grammar,
 * and rewrites it to sound professional while preserving intent.
 */
export async function POST(request) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: 'AI enhancement not configured.' }, { status: 503 })
  }

  try {
    const { text, type = 'body' } = await request.json()

    if (!text?.trim()) {
      return NextResponse.json({ error: 'No text provided.' }, { status: 400 })
    }

    const prompt = type === 'title'
      ? `You are an expert email copywriter. Rewrite the given email subject line to be clear, professional, and compelling. Fix any spelling or grammar mistakes. Keep it concise (under 80 characters). Return only the rewritten subject line - no quotes, no explanation.\n\nSubject: ${text}`
      : `You are a senior business communications expert. Your job is to ACTIVELY REWRITE and ELEVATE the following email to make it noticeably more polished, professional, and impactful. Do NOT return the same text. You MUST make meaningful improvements:\n\n- Upgrade word choices to sound more authoritative and professional\n- Improve sentence flow and rhythm\n- Make the opening and closing more compelling and warm\n- Strengthen calls-to-action to be more motivating\n- Fix any grammar or spelling issues\n- Preserve ALL original points, lists, and structure - do not remove content\n- Return the COMPLETE rewritten email - do not truncate or summarize\n- CRITICAL: Return plain text only - absolutely NO Markdown, NO asterisks, NO bold (**), NO italics (*), NO headers (#), NO bullet symbols. Just clean plain text.\n- Return ONLY the rewritten email text with no explanation, preamble, or commentary\n\nEmail to enhance:\n${text}`

    const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
        },
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('Gemini error status:', res.status, errText)
      return NextResponse.json({ error: `Gemini error ${res.status}: ${errText}` }, { status: 500 })
    }

    const data = await res.json()
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

    if (!raw) {
      return NextResponse.json({ error: 'No response from AI.' }, { status: 500 })
    }

    // Strip any Markdown formatting Gemini may still include
    const enhanced = raw
      .replace(/\*\*(.+?)\*\*/g, '$1')  // **bold** → plain
      .replace(/\*(.+?)\*/g, '$1')       // *italic* → plain
      .replace(/^#{1,6}\s+/gm, '')       // # headings → plain
      .replace(/^[-*]\s+/gm, '')         // - bullet → plain (keep numbered lists)
      .trim()

    return NextResponse.json({ enhanced })
  } catch (error) {
    console.error('enhance-text error:', error)
    return NextResponse.json({ error: 'Enhancement failed. Please try again.' }, { status: 500 })
  }
}
