'use client'

import { useEffect, useState } from 'react'
import { characters } from '@/lib/characters'

export default function AccusationScreen({
  onClose,
  questionedIds,
  accusationEnabled = true,
  accusations = [],
  onAccusationRecorded,
}) {
  const [selected, setSelected] = useState(null)
  const [verifying, setVerifying] = useState(false)
  // result shape: { correct: boolean, explanation?: string, accusedId: string }
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const characterList = Object.values(characters)
  const questionedSet = new Set(questionedIds)
  const totalCount = characterList.length
  const questionedCount = questionedSet.size
  const allQuestioned = questionedCount >= totalCount
  const remaining = characterList.filter((c) => !questionedSet.has(c.id))
  const accusedSet = new Set(accusations.map((a) => a.characterId))

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleSubmit = async () => {
    if (!selected || !allQuestioned || verifying || !accusationEnabled) return
    setError(null)
    setVerifying(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/accusation`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ characterId: selected }),
        },
      )
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}))
        throw new Error(
          errBody.error || `Verification failed: ${res.status} ${res.statusText}`,
        )
      }
      const data = await res.json()
      const verdict = {
        correct: !!data.correct,
        explanation: data.explanation || null,
        accusedId: selected,
      }
      setResult(verdict)
      if (onAccusationRecorded) {
        onAccusationRecorded(verdict.accusedId, verdict.correct)
      }
    } catch (err) {
      setError(
        err.message ||
          'Could not reach the precinct. Try again in a moment.',
      )
    } finally {
      setVerifying(false)
    }
  }

  const accuseAgain = () => {
    setResult(null)
    setSelected(null)
    setError(null)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-[2px]" />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-5xl w-full max-h-[92vh] overflow-y-auto scrollbar-noir
                   bg-ink/95 border-2 border-amber-dim rounded-md p-6 md:p-10 shadow-amber
                   animate-[fadeUp_220ms_ease-out]"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-4 text-parchment/60 hover:text-amber text-2xl"
          aria-label="Close"
        >
          ×
        </button>

        {result === null ? (
          <>
            <h2 className="serif text-3xl md:text-4xl text-amber-bright mb-2">
              Make Your Accusation
            </h2>
            <p className="text-parchment/70 italic mb-3">
              Select the suspect you believe killed Edmund Ravensworth. You may
              return and accuse again if you are wrong.
            </p>

            <div
              className={[
                'mb-6 px-5 py-4 rounded border-2 flex items-center justify-between gap-4 flex-wrap',
                allQuestioned
                  ? 'border-amber bg-amber/15 text-amber-bright'
                  : 'border-blood bg-blood/20 text-parchment',
              ].join(' ')}
            >
              <div className="flex items-baseline gap-3">
                <span className="serif text-3xl md:text-4xl text-amber-bright">
                  {questionedCount}
                  <span className="text-parchment/60 mx-2">/</span>
                  {totalCount}
                </span>
                <span className="serif text-lg md:text-xl">
                  suspects questioned
                </span>
              </div>
              {!allQuestioned && (
                <span className="serif text-base md:text-lg italic text-parchment/90">
                  Question everyone before accusing.
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {characterList.map((character) => {
                const wasQuestioned = questionedSet.has(character.id)
                const wasAccused = accusedSet.has(character.id)
                const isSelected = selected === character.id
                return (
                  <button
                    key={character.id}
                    type="button"
                    onClick={() => setSelected(character.id)}
                    className={[
                      'group relative flex flex-col items-center p-2 rounded border transition-all',
                      isSelected
                        ? 'border-amber-bright bg-amber/20 shadow-amber'
                        : wasAccused
                        ? 'border-blood/50 bg-blood/10 hover:border-blood'
                        : 'border-amber-dim/40 hover:border-amber/70 hover:bg-amber/10',
                    ].join(' ')}
                  >
                    <img
                      src={character.portrait}
                      alt={character.name}
                      className={[
                        'h-44 md:h-52 w-auto object-contain transition-all',
                        wasQuestioned ? 'opacity-100' : 'opacity-50 grayscale',
                      ].join(' ')}
                      draggable={false}
                    />
                    <div className="serif text-base md:text-lg text-amber-bright mt-2 text-center">
                      {character.name}
                    </div>
                    <span
                      className={[
                        'absolute top-1 right-1 h-5 w-5 rounded-full flex items-center justify-center text-xs',
                        wasQuestioned
                          ? 'bg-amber text-ink'
                          : 'bg-ink/80 border border-parchment/40 text-parchment/50',
                      ].join(' ')}
                      title={
                        wasQuestioned ? 'Questioned' : 'Not yet questioned'
                      }
                      aria-label={
                        wasQuestioned
                          ? `${character.name} has been questioned`
                          : `${character.name} has not been questioned`
                      }
                    >
                      {wasQuestioned ? '✓' : '·'}
                    </span>
                    {wasAccused && (
                      <span
                        className="absolute top-1 left-1 px-1.5 h-5 rounded-full text-[10px] uppercase tracking-widest font-sans
                                   bg-blood text-parchment border border-blood"
                        title="You have already accused this suspect"
                      >
                        Cleared
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {accusations.length > 0 && (
              <div className="mb-4 px-4 py-3 rounded border border-amber-dim/40 bg-ink/60 text-base">
                <div className="serif text-amber text-lg mb-1">
                  Past accusations ({accusations.length})
                </div>
                <div className="text-parchment/85">
                  {accusations.map((a, i) => (
                    <span key={i}>
                      {i > 0 && <span className="text-parchment/40"> · </span>}
                      <span className={a.correct ? 'text-amber-bright' : 'text-blood'}>
                        {characters[a.characterId]?.name ?? a.characterId}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {!allQuestioned && (
              <div className="mb-6 text-base md:text-lg">
                <div className="serif text-amber text-lg md:text-xl mb-1">
                  Still to question
                </div>
                <div className="text-parchment/90">
                  {remaining.map((c) => c.name).join(', ')}
                </div>
              </div>
            )}

            {error && (
              <div className="mb-4 px-4 py-3 rounded border border-blood bg-blood/15
                              text-parchment whitespace-pre-wrap">
                {error}
              </div>
            )}

            {!accusationEnabled && (
              <div className="mb-4 px-5 py-4 rounded border-2 border-amber-dim/60 bg-ink/60">
                <p className="serif text-amber-bright text-lg md:text-xl mb-1">
                  Sealed by the Hampshire Constabulary
                </p>
                <p className="text-parchment/80 italic text-base md:text-lg">
                  Your case file is not yet ready to be filed. The killer's
                  identity will be revealed by your workshop presenter at the
                  end of the session.
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3 items-center">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-parchment/70 hover:text-parchment"
              >
                Keep investigating
              </button>
              {accusationEnabled && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!selected || !allQuestioned || verifying}
                  title={
                    !allQuestioned
                      ? 'Question everyone before accusing'
                      : !selected
                      ? 'Select a suspect'
                      : 'Submit accusation'
                  }
                  className="serif bg-amber/20 border border-amber text-amber-bright
                             px-5 py-2 rounded hover:bg-amber/30 transition-colors
                             disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {verifying ? 'Filing the charge…' : 'Accuse'}
                </button>
              )}
            </div>
          </>
        ) : result.correct ? (
          <>
            <h2 className="serif text-3xl md:text-4xl text-amber-bright mb-3">
              Case Closed
            </h2>
            <p className="text-parchment/80 mb-4">
              You have correctly identified the killer.
            </p>
            <pre className="whitespace-pre-wrap font-sans text-parchment/90 leading-relaxed
                            bg-ink/60 border border-amber-dim/30 rounded p-4 mb-6">
{result.explanation}
            </pre>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="serif bg-amber/20 border border-amber text-amber-bright
                           px-5 py-2 rounded hover:bg-amber/30 transition-colors"
              >
                Close
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="serif text-3xl md:text-4xl text-blood mb-3">
              Wrong Suspect
            </h2>
            <p className="text-parchment/80 mb-2">
              {characters[result.accusedId].name} is not the killer.
            </p>
            <p className="text-parchment/70 italic mb-6">
              The night is not yet over. Question whoever you have not spoken
              to, and weigh their stories against each other.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={accuseAgain}
                className="px-4 py-2 text-parchment/70 hover:text-parchment"
              >
                Accuse again
              </button>
              <button
                type="button"
                onClick={onClose}
                className="serif bg-amber/20 border border-amber text-amber-bright
                           px-5 py-2 rounded hover:bg-amber/30 transition-colors"
              >
                Keep investigating
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
