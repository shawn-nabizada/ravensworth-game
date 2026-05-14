'use client'

import { useEffect, useState } from 'react'

const TITLE_OPTIONS = ['Inspector', 'Detective', 'Sergeant', 'Constable']
const PRE_PANEL_DELAY_MS = 3500
const PARAGRAPH_DELAY_MS = 2750

const DISPATCH = [
  { kind: 'body', text: 'A car has been sent. Make ready.' },
  {
    kind: 'body',
    text:
      'Edmund Ravensworth — shipping magnate, seventy-five years old today — was found dead at quarter past ten in his private study at Ravensworth Manor. A single stab wound to the chest. The study door was bolted from the inside. A garden window was found unlatched.',
  },
  {
    kind: 'body',
    text:
      "The household has been sealed. Eight suspects remain on the premises: family, household staff, and the evening's dinner guests. They have been kept apart, and instructed to speak with no one until questioned. They will speak only to you.",
  },
  {
    kind: 'body',
    text:
      'You are to interview each of them, weigh their testimony against the others, and present an accusation before dawn. The constable on duty will arrest whomever you name.',
  },
  {
    kind: 'body',
    text:
      'Mr. Ravensworth had no shortage of enemies. Every voice in that house has reason to lie. Only one of them is the killer.',
  },
  {
    kind: 'body',
    text: 'The rain has not stopped in three days. Drive carefully.',
  },
  { kind: 'signoff', text: '— M. Whitlock, Dispatch' },
]

export default function IntroScreen({ onComplete }) {
  // 'pre-panel' = only manor exterior, no panel yet.
  // 'dispatch'  = telegram panel on screen.
  // 'signin'    = sign-in form on screen.
  const [phase, setPhase] = useState('pre-panel')
  // Number of dispatch lines currently visible. The first line is shown
  // together with the panel itself (revealed = 1 on entry to 'dispatch').
  const [revealed, setRevealed] = useState(1)
  const [skipped, setSkipped] = useState(false)
  const [name, setName] = useState('')
  const [title, setTitle] = useState('Inspector')

  // Hold on the manor exterior for a beat before the dispatch panel arrives.
  useEffect(() => {
    if (phase !== 'pre-panel') return
    const t = setTimeout(() => setPhase('dispatch'), PRE_PANEL_DELAY_MS)
    return () => clearTimeout(t)
  }, [phase])

  // Reveal subsequent dispatch lines one at a time.
  useEffect(() => {
    if (phase !== 'dispatch' || skipped || revealed >= DISPATCH.length) return
    const t = setTimeout(() => setRevealed((c) => c + 1), PARAGRAPH_DELAY_MS)
    return () => clearTimeout(t)
  }, [phase, revealed, skipped])

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onComplete({ name: trimmed.slice(0, 40), title })
  }

  const replayDispatch = () => {
    setRevealed(1)
    setSkipped(false)
    setPhase('dispatch')
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <img
        src="/assets/manor-exterior.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/30 to-ink/85" />
      <div className="vignette" />

      {(phase === 'pre-panel' ||
        (phase === 'dispatch' && !skipped && revealed < DISPATCH.length)) && (
        <button
          type="button"
          onClick={() => {
            // Skip jumps straight into the dispatch panel with all lines visible.
            setPhase('dispatch')
            setSkipped(true)
          }}
          className="fixed top-5 right-6 z-30 serif text-lg md:text-xl
                     text-amber-bright hover:text-amber-bright transition-colors
                     bg-ink/70 border border-amber-dim/60 rounded-md
                     px-4 py-2 backdrop-blur-sm
                     hover:bg-amber/15 hover:border-amber"
        >
          Skip ahead →
        </button>
      )}

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-6">
        {phase === 'pre-panel' && null}
        {phase === 'dispatch' && (
          <DispatchPanel
            revealed={revealed}
            skipped={skipped}
            onContinue={() => setPhase('signin')}
          />
        )}
        {phase === 'signin' && (
          <SignInPanel
            name={name}
            setName={setName}
            title={title}
            setTitle={setTitle}
            onSubmit={handleSubmit}
            onReplayDispatch={replayDispatch}
          />
        )}
      </div>
    </div>
  )
}

function DispatchPanel({ revealed, skipped, onContinue }) {
  const allRevealed = skipped || revealed >= DISPATCH.length

  return (
    <div
      className="w-full max-w-5xl bg-ink/85 border-2 border-amber-dim
                 rounded-md shadow-amber backdrop-blur-sm
                 px-8 md:px-16 py-7 md:py-10
                 max-h-[92vh] overflow-y-auto scrollbar-noir
                 animate-[fadeUp_500ms_ease-out]"
    >
      <div className="text-center border-b border-amber-dim/50 pb-5 mb-7">
        <div className="serif tracking-[0.3em] text-amber-bright text-2xl md:text-3xl font-semibold">
          HAMPSHIRE CONSTABULARY
        </div>
        <div className="serif tracking-[0.4em] text-blood text-base md:text-lg mt-2">
          URGENT DISPATCH
        </div>
        <div className="text-parchment/70 text-base md:text-lg mt-2 italic">
          14 November 1947 · 22:47 hours · Ref: HPD/48-217
        </div>
      </div>

      <div className="space-y-5 md:space-y-6">
        {DISPATCH.map((line, idx) => {
          const visible = skipped || idx < revealed
          const isSignoff = line.kind === 'signoff'
          return (
            <p
              key={idx}
              className={[
                'transition-all duration-700 ease-out',
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
                isSignoff
                  ? 'serif italic text-amber/80 text-right pt-3 border-t border-amber-dim/30 text-lg md:text-xl'
                  : 'serif text-parchment text-xl md:text-2xl leading-relaxed',
              ].join(' ')}
            >
              {line.text}
            </p>
          )
        })}
      </div>

      <div
        className={[
          'mt-9 flex justify-end transition-all duration-500',
          allRevealed
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-2 pointer-events-none',
        ].join(' ')}
      >
        <button
          type="button"
          onClick={onContinue}
          disabled={!allRevealed}
          className="serif bg-amber/20 border border-amber text-amber-bright
                     px-8 py-3 rounded text-2xl
                     hover:bg-amber/30 transition-colors
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Sign in →
        </button>
      </div>
    </div>
  )
}

function SignInPanel({
  name,
  setName,
  title,
  setTitle,
  onSubmit,
  onReplayDispatch,
}) {
  const canSubmit = name.trim().length > 0
  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-2xl bg-ink/90 border-2 border-amber rounded-md shadow-amber
                 backdrop-blur-sm px-6 md:px-10 py-6 md:py-8
                 animate-[fadeUp_500ms_ease-out]"
    >
      <div className="flex items-baseline justify-between flex-wrap gap-2 mb-1">
        <h2 className="serif text-2xl md:text-3xl text-amber-bright">
          Sign in, please.
        </h2>
        <button
          type="button"
          onClick={onReplayDispatch}
          className="text-xs md:text-sm text-parchment/60 hover:text-amber
                     underline-offset-4 hover:underline transition-colors"
        >
          ← read dispatch again
        </button>
      </div>
      <p className="text-parchment/70 italic text-sm md:text-base mb-5">
        For the case file. The household will need to know who is questioning them.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-[10rem_1fr] gap-3 md:gap-4">
        <label className="flex flex-col">
          <span className="serif text-amber text-sm uppercase tracking-widest mb-1">
            Title
          </span>
          <select
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-ink border border-amber-dim/60 rounded px-3 py-2
                       text-parchment focus:outline-none focus:border-amber"
          >
            {TITLE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col">
          <span className="serif text-amber text-sm uppercase tracking-widest mb-1">
            Name
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={40}
            autoFocus
            placeholder="e.g. Hayes"
            className="bg-ink border border-amber-dim/60 rounded px-3 py-2
                       text-parchment placeholder:text-parchment/40
                       focus:outline-none focus:border-amber"
          />
        </label>
      </div>

      <div className="mt-6 flex items-center justify-between flex-wrap gap-3">
        <p className="text-xs md:text-sm text-parchment/50 italic">
          You will be addressed as{' '}
          <span className="text-amber-bright not-italic">
            {title} {name.trim() || '___'}
          </span>
          .
        </p>
        <button
          type="submit"
          disabled={!canSubmit}
          className="serif bg-amber/20 border border-amber text-amber-bright
                     px-6 py-2 rounded text-lg
                     hover:bg-amber/30 transition-colors
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Enter the manor →
        </button>
      </div>
    </form>
  )
}
