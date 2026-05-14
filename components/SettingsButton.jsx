'use client'

import { useEffect, useState } from 'react'

const PRINCIPLES = [
  {
    title: 'Establish the timeline',
    body:
      "Ask each person where they were and what they were doing throughout the evening — before dinner, during, and after. Cross-reference what you hear against everyone else's account. Gaps and contradictions are where the truth leaks out.",
  },
  {
    title: 'Notice the deflection',
    body:
      'A guilty conscience deflects. If a suspect changes the subject, gets formal, gets aggressive, or suddenly wants to talk about someone else — make a note of the topic they avoided and come back to it from a different angle.',
  },
  {
    title: 'Use one suspect against another',
    body:
      "If one person tells you something about another, bring it up in the next interview. Watch the reaction. People are far more careless when they don't know what you already know.",
  },
  {
    title: 'The room is a witness',
    body:
      'Visit the study. The desk, the door, the window, the chalk outline — each tells you something before a suspect opens their mouth. Physical detail is harder to lie about than memory.',
  },
  {
    title: 'Not every lie is a confession',
    body:
      'People hide small, embarrassing things — affairs, debts, private letters — that have nothing to do with the murder. Distinguish between the lie that protects a secret and the lie that protects a killer.',
  },
  {
    title: "Don't ask 'did you do it?'",
    body:
      'Nobody ever says yes. Ask what they did, where they were, who they saw, what they touched. The truth lives in the small details they get wrong, not in the denials.',
  },
]

const TABS = [
  { id: 'general', label: 'General' },
  { id: 'guidance', label: 'Interrogation guide' },
]

export default function SettingsButton({ onRestart }) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState('general')
  const [confirmRestart, setConfirmRestart] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && handleClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const handleClose = () => {
    setOpen(false)
    setConfirmRestart(false)
  }

  const handleRestart = () => {
    if (!confirmRestart) {
      setConfirmRestart(true)
      return
    }
    onRestart()
    handleClose()
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Settings"
        title="Settings"
        className="fixed top-5 right-6 z-40
                   h-12 w-12 rounded-full
                   bg-ink/80 border-2 border-amber/70
                   flex items-center justify-center
                   shadow-amber backdrop-blur-sm
                   hover:bg-amber/20 hover:border-amber-bright hover:scale-105
                   transition-all duration-200"
      >
        <GearIcon className="h-6 w-6 text-amber-bright" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleClose}
          aria-modal="true"
          role="dialog"
        >
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-[2px]" />

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full h-[640px] max-h-[90vh] overflow-hidden flex flex-col
                       bg-ink/95 border-2 border-amber-dim rounded-md shadow-amber
                       animate-[fadeUp_220ms_ease-out]"
          >
            <header className="px-6 md:px-10 pt-6 md:pt-8 pb-3 flex items-center justify-between gap-4">
              <h2 className="serif text-3xl md:text-4xl text-amber-bright">
                Settings
              </h2>
              <button
                type="button"
                onClick={handleClose}
                className="text-parchment/60 hover:text-amber text-2xl leading-none px-2"
                aria-label="Close"
              >
                ×
              </button>
            </header>

            <nav className="px-6 md:px-10 border-b border-amber-dim/40 flex gap-1">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setTab(t.id)
                    setConfirmRestart(false)
                  }}
                  className={[
                    'serif px-4 py-2 -mb-px border-b-2 transition-colors text-base md:text-lg',
                    tab === t.id
                      ? 'border-amber-bright text-amber-bright'
                      : 'border-transparent text-parchment/60 hover:text-amber',
                  ].join(' ')}
                >
                  {t.label}
                </button>
              ))}
            </nav>

            <div className="flex-1 overflow-y-auto scrollbar-noir px-6 md:px-10 py-6">
              {tab === 'general' && (
                <GeneralTab
                  confirmRestart={confirmRestart}
                  onRestart={handleRestart}
                  onCancelConfirm={() => setConfirmRestart(false)}
                />
              )}
              {tab === 'guidance' && <GuidanceTab />}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function GeneralTab({ confirmRestart, onRestart, onCancelConfirm }) {
  return (
    <section>
      <h3 className="serif text-2xl text-amber-bright mb-2">Restart game</h3>
      <p className="text-parchment/80 leading-relaxed mb-4">
        Wipe the case file. This clears your detective profile, every chat
        history, and every accusation you have made. The dispatch will play
        again from the beginning.
      </p>

      {confirmRestart ? (
        <div className="flex flex-wrap items-center gap-3">
          <span className="serif text-blood text-lg">
            Really start over from the dispatch?
          </span>
          <button
            type="button"
            onClick={onRestart}
            className="serif bg-blood/30 border-2 border-blood text-amber-bright
                       px-5 py-2 rounded hover:bg-blood/50 transition-colors"
          >
            Yes, wipe everything
          </button>
          <button
            type="button"
            onClick={onCancelConfirm}
            className="px-4 py-2 text-parchment/70 hover:text-parchment"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onRestart}
          className="serif bg-blood/20 border-2 border-blood text-amber-bright
                     px-5 py-2 rounded hover:bg-blood/40 transition-colors"
        >
          Restart game
        </button>
      )}
    </section>
  )
}

function GuidanceTab() {
  return (
    <section>
      <div className="text-xs uppercase tracking-[0.3em] text-amber mb-1">
        Detective's notebook
      </div>
      <h3 className="serif text-2xl md:text-3xl text-amber-bright mb-2">
        On the Art of Interrogation
      </h3>
      <p className="text-parchment/70 italic mb-5">
        Six principles for getting the truth out of a houseful of people who
        would all rather you went home.
      </p>
      <ul className="space-y-4">
        {PRINCIPLES.map((p) => (
          <li key={p.title} className="border-l-2 border-amber/60 pl-4">
            <div className="serif text-amber-bright text-lg md:text-xl mb-1">
              {p.title}
            </div>
            <div className="text-parchment/90 leading-relaxed">{p.body}</div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function GearIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}
