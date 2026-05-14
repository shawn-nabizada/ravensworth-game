'use client'

import { useEffect, useRef, useState } from 'react'
import { characters } from '@/lib/characters'
import ChatMessage from './ChatMessage'

export default function CharacterChat({
  characterId,
  history,
  onSendMessage,
  onClose,
  userLabel,
}) {
  const character = characters[characterId]

  const [draft, setDraft] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(null)
  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [history, pending])

  useEffect(() => {
    inputRef.current?.focus()
  }, [characterId])

  // Esc to close.
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const text = draft.trim()
    if (!text || pending) return
    setDraft('')
    setError(null)
    setPending(true)
    try {
      await onSendMessage(text)
    } catch (err) {
      setError(err.message || 'Something went wrong. Check your API configuration.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-[2px]" />

      <aside
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl h-[85vh] max-h-[800px]
                   bg-ink/95 border-2 border-amber-dim rounded-md
                   shadow-amber flex flex-col
                   animate-[fadeUp_220ms_ease-out]"
      >
        <header className="flex items-center justify-between gap-3 px-5 py-4 border-b border-amber-dim/50">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-amber">
              Questioning
            </div>
            <h2 className="serif text-2xl md:text-3xl text-amber-bright leading-tight">
              {character.name}
            </h2>
            <p className="text-sm text-parchment/70 italic">
              {character.role}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close chat"
            className="text-parchment/70 hover:text-amber text-3xl leading-none px-2"
          >
            ×
          </button>
        </header>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-noir"
        >
          {history.length === 0 && (
            <div className="text-center text-parchment/60 italic py-12">
              Begin your interrogation.
            </div>
          )}
          {history.map((m, idx) => (
            <ChatMessage
              key={idx}
              role={m.role}
              content={m.content}
              characterName={character.name}
              userLabel={userLabel}
            />
          ))}
          {pending && (
            <div className="text-amber/80 italic text-sm pl-2">
              {character.name} considers their reply…
            </div>
          )}
          {error && (
            <div className="text-blood bg-blood/10 border border-blood/40 rounded px-3 py-2 text-sm whitespace-pre-wrap">
              {error}
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="border-t border-amber-dim/50 p-3 flex gap-2 bg-ink/95"
        >
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            disabled={pending}
            placeholder={`Question ${character.name.split(' ')[0]}…`}
            className="flex-1 bg-ink border border-amber-dim/50 rounded px-3 py-2
                       text-parchment placeholder:text-parchment/40
                       focus:outline-none focus:border-amber"
          />
          <button
            type="submit"
            disabled={pending || !draft.trim()}
            className="serif bg-amber/20 border border-amber text-amber-bright
                       px-4 py-2 rounded hover:bg-amber/30 transition-colors
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Ask
          </button>
        </form>
      </aside>
    </div>
  )
}
