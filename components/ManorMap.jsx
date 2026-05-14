'use client'

import { useState } from 'react'
import { rooms } from '@/lib/characters'

function MagnifierIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
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

export default function ManorMap({ onRoomClick }) {
  const [hovered, setHovered] = useState(null)
  const roomList = Object.values(rooms)

  return (
    <div className="flex flex-col items-center gap-4 p-4 md:p-6 min-h-screen">
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl text-amber-bright">
          Ravensworth Manor
        </h1>
        <p className="mt-2 text-parchment/70 italic">
          November 14, 1947 — 10:15pm. Edmund Ravensworth is dead.
        </p>
        <p className="mt-1 text-sm text-parchment/60">
          Click a room to question whoever is inside.
        </p>
      </header>

      <div
        className="relative w-full aspect-[1920/1080] mx-auto"
        style={{ maxHeight: 'calc(100vh - 160px)', maxWidth: 'calc((100vh - 160px) * 1920 / 1080)' }}
      >
        <img
          src="/assets/manor-map.png"
          alt="Floor plan of Ravensworth Manor"
          className="absolute inset-0 h-full w-full object-contain select-none pointer-events-none"
          draggable={false}
        />

        {roomList.map((room) => {
          const { left, top, width, height } = room.hotspot
          const isCrime = room.isCrimeScene
          const isHovered = hovered === room.id
          return (
            <button
              key={room.id}
              type="button"
              onClick={() => onRoomClick(room.id)}
              onMouseEnter={() => setHovered(room.id)}
              onMouseLeave={() => setHovered(null)}
              className={[
                'group absolute rounded-sm transition-all duration-150',
                'flex items-end justify-center text-center',
                'ring-1 ring-amber/60 bg-amber/5',
                isHovered
                  ? 'bg-amber/25 ring-2 ring-amber-bright shadow-amber'
                  : 'hover:bg-amber/15 hover:ring-amber/80',
              ].join(' ')}
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: `${width}%`,
                height: `${height}%`,
              }}
              aria-label={
                isCrime ? `Examine ${room.name} (crime scene)` : `Enter ${room.name}`
              }
            >
              <span
                aria-hidden="true"
                className={[
                  'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
                  'flex items-center justify-center',
                  'h-7 w-7 md:h-9 md:w-9 rounded-full',
                  'bg-ink/70 ring-1 ring-amber/70',
                  'transition-all duration-150',
                  isHovered
                    ? 'bg-amber/30 ring-amber-bright scale-110'
                    : 'group-hover:bg-amber/20 group-hover:ring-amber',
                ].join(' ')}
              >
                <MagnifierIcon className="h-4 w-4 md:h-5 md:w-5 text-amber" />
              </span>

              <span
                className={[
                  'relative serif text-xs md:text-sm pb-1 px-1 rounded-sm',
                  'transition-opacity duration-150 whitespace-nowrap',
                  isHovered
                    ? 'opacity-100 text-amber-bright bg-ink/70'
                    : 'opacity-0',
                ].join(' ')}
              >
                {isCrime ? 'Examine the crime scene' : room.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
