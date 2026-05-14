import { NextResponse } from 'next/server'
import { sendMessage } from '@/lib/gemini'
import { getSystemPrompt, characters } from '@/lib/characters'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { characterId, messages, playerProfile } = body ?? {}

  if (!characterId || !characters[characterId]) {
    return NextResponse.json(
      { error: `Unknown characterId: ${characterId ?? '(none)'}` },
      { status: 400 },
    )
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { error: 'messages must be a non-empty array' },
      { status: 400 },
    )
  }

  try {
    const systemPrompt = await getSystemPrompt(characterId, playerProfile)
    const reply = await sendMessage(messages, systemPrompt)
    return NextResponse.json({ reply })
  } catch (err) {
    console.error('chat error', err)
    return NextResponse.json(
      { error: err.message || 'Something went wrong.' },
      { status: 500 },
    )
  }
}
