import { NextResponse } from 'next/server'
import { DAGARMY_SYSTEM_PROMPT } from '@/lib/chatbot/knowledge-dagarmy'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`

export async function POST(request) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: 'Chatbot not configured.' }, { status: 503 })
  }

  try {
    const { message, history = [] } = await request.json()

    if (!message?.trim()) {
      return NextResponse.json({ error: 'No message provided.' }, { status: 400 })
    }

    // Build conversation contents for Gemini
    // Gemini uses alternating user/model roles
    const contents = []

    // Add conversation history
    for (const entry of history) {
      contents.push({
        role: entry.role === 'user' ? 'user' : 'model',
        parts: [{ text: entry.text }],
      })
    }

    // Add the current user message
    contents.push({
      role: 'user',
      parts: [{ text: message.trim() }],
    })

    const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: DAGARMY_SYSTEM_PROMPT }],
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('Gemini chatbot error:', res.status, errText)
      return NextResponse.json({ error: 'AI service unavailable.' }, { status: 500 })
    }

    const data = await res.json()
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

    if (!reply) {
      return NextResponse.json({ error: 'No response from AI.' }, { status: 500 })
    }

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('chatbot/chat error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
