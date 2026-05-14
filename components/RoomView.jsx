'use client'

import { useEffect, useState } from 'react'
import { rooms, characters } from '@/lib/characters'

export default function RoomView({ roomId, onBack, onCharacterClick }) {
  const room = rooms[roomId]
  if (!room) return null

  const occupants = room.characters.map((id) => characters[id])
  const isClueRoom = room.isCrimeScene && Array.isArray(room.clues)

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <img
        src={room.background}
        alt={room.name}
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/20 to-ink/80" />
      <div className="vignette" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="flex items-center justify-between p-6">
          <button
            type="button"
            onClick={onBack}
            className="serif text-amber-bright hover:bg-amber/15 hover:border-amber
                       bg-ink/70 border border-amber-dim/60 backdrop-blur-sm
                       rounded-md px-4 py-2 text-xl md:text-2xl
                       transition-colors"
          >
            ← Manor map
          </button>
          <h2 className="serif text-3xl md:text-4xl text-amber-bright drop-shadow-lg">
            {room.name}
          </h2>
          <div className="w-32" />
        </div>

        {isClueRoom ? (
          <CrimeSceneLayer clues={room.clues} />
        ) : occupants.length === 0 ? (
          <div className="flex-1 flex items-end justify-center p-6 pb-20">
            <p className="text-parchment/70 italic mb-20">No one is here.</p>
          </div>
        ) : room.characterPositions ? (
          <div className="flex-1 relative">
            {occupants.map((character) => {
              const pos = room.characterPositions[character.id] || { left: 50 }
              const left = pos.left ?? 50
              const bottom = pos.bottom ?? 0
              const scale = pos.scale ?? 1
              return (
                <button
                  key={character.id}
                  type="button"
                  onClick={() => onCharacterClick(character.id)}
                  className="group absolute flex flex-col items-center transition-transform hover:-translate-y-2"
                  style={{
                    left: `${left}%`,
                    bottom: `${bottom}%`,
                    transform: `translateX(-50%)`,
                  }}
                >
                  <CharacterPortrait character={character} scale={scale} />
                </button>
              )
            })}
          </div>
        ) : (
          <div className="flex-1 flex items-end justify-center gap-8 md:gap-16 p-6 pb-20">
            {occupants.map((character) => (
              <button
                key={character.id}
                type="button"
                onClick={() => onCharacterClick(character.id)}
                className="group flex flex-col items-center transition-transform hover:-translate-y-2"
              >
                <CharacterPortrait character={character} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function CharacterPortrait({ character, scale = 1 }) {
  // Apply scale to the image dimensions directly so the layout reflows and
  // the name/role label sits flush beneath the portrait — and so the label's
  // own font sizes are not affected by the scale.
  const imgStyle = {
    height: `calc(60vh * ${scale})`,
    maxHeight: `${600 * scale}px`,
  }
  return (
    <>
      <div className="relative">
        <img
          src={character.portrait}
          alt={character.name}
          style={imgStyle}
          className="w-auto object-contain drop-shadow-2xl
                     transition-all duration-200
                     group-hover:drop-shadow-[0_0_30px_rgba(240,192,96,0.5)]"
          draggable={false}
        />
      </div>
      <div className="mt-2 text-center">
        <div className="serif text-2xl text-amber-bright">{character.name}</div>
        <div className="text-sm text-parchment/70 italic">{character.role}</div>
      </div>
    </>
  )
}

function CrimeSceneLayer({ clues }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open inspector's notes"
        title="Inspector's notes"
        className="group fixed top-1/2 right-6 -translate-y-1/2 z-30
                   h-16 w-16 rounded-full
                   bg-ink/80 border-2 border-amber/70
                   flex items-center justify-center
                   shadow-amber backdrop-blur-sm
                   hover:bg-amber/20 hover:border-amber-bright hover:scale-105
                   transition-all duration-200
                   animate-[pulse_3s_ease-in-out_infinite]"
      >
        <MagnifierIcon className="h-7 w-7 text-amber-bright" />
        <span className="absolute right-full mr-3 whitespace-nowrap
                         px-2 py-1 rounded bg-ink/90 border border-amber-dim
                         text-xs uppercase tracking-widest text-amber
                         opacity-0 group-hover:opacity-100 transition-opacity">
          Inspector's notes
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 flex justify-end"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" />

          <aside
            className="relative h-full w-full max-w-md md:max-w-lg
                       bg-ink/95 border-l-2 border-amber-dim
                       shadow-amber overflow-y-auto scrollbar-noir
                       animate-[slideIn_200ms_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-ink/95 backdrop-blur-sm
                            border-b border-amber-dim/40 px-6 py-4
                            flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-blood">
                  Inspector's notes
                </div>
                <h3 className="serif text-2xl text-amber-bright">
                  Observations from the scene
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close notes"
                className="text-parchment/70 hover:text-amber text-3xl leading-none px-2"
              >
                ×
              </button>
            </div>

            <div className="px-6 py-5">
              <p className="text-parchment/70 italic text-sm mb-5">
                The body has been removed. The room is yours to examine.
                Whoever stood in here tonight cannot be questioned — but the
                room itself still has things to say.
              </p>
              <ul className="space-y-4">
                {clues.map((clue) => (
                  <li key={clue.title} className="border-l-2 border-amber/60 pl-4">
                    <div className="serif text-amber-bright text-lg">
                      {clue.title}
                    </div>
                    <div className="text-parchment/90 leading-relaxed">
                      {clue.body}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}

function MagnifierIcon({ className }) {
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
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.5" y2="16.5" />
    </svg>
  )
}
