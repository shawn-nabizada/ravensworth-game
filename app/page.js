'use client'

import { useEffect, useState } from 'react'
import { characters } from '@/lib/characters'
import {
  loadProfile,
  saveProfile,
  loadHistories,
  saveHistories,
  loadAccusations,
  saveAccusations,
  clearAll,
} from '@/lib/storage'
import IntroScreen from '@/components/IntroScreen'
import ManorMap from '@/components/ManorMap'
import RoomView from '@/components/RoomView'
import CharacterChat from '@/components/CharacterChat'
import AccusationScreen from '@/components/AccusationScreen'
import SettingsButton from '@/components/SettingsButton'

const CHARACTER_IDS = Object.keys(characters)
const blankHistories = () =>
  Object.fromEntries(CHARACTER_IDS.map((id) => [id, []]))

export default function Home() {
  // view: { kind: 'map' } | { kind: 'room', roomId }
  const [view, setView] = useState({ kind: 'map' })
  // When set, a chat modal overlays the current view.
  const [chatCharacterId, setChatCharacterId] = useState(null)
  const [accusationOpen, setAccusationOpen] = useState(false)

  // Persisted state. `loaded` flips true once we've read localStorage.
  const [loaded, setLoaded] = useState(false)
  const [playerProfile, setPlayerProfile] = useState(null)
  const [histories, setHistories] = useState(blankHistories)
  const [accusations, setAccusations] = useState([])

  // Hydrate everything from localStorage on mount.
  useEffect(() => {
    setPlayerProfile(loadProfile())
    setHistories(loadHistories(CHARACTER_IDS))
    setAccusations(loadAccusations())
    setLoaded(true)
  }, [])

  // Persist on each change (skip until loaded so we don't overwrite saved
  // data with the blank initial state on first mount).
  useEffect(() => {
    if (!loaded) return
    saveHistories(histories)
  }, [loaded, histories])

  useEffect(() => {
    if (!loaded) return
    saveAccusations(accusations)
  }, [loaded, accusations])

  const completeIntro = (profile) => {
    setPlayerProfile(profile)
    saveProfile(profile)
  }

  const restartGame = () => {
    clearAll()
    setPlayerProfile(null)
    setHistories(blankHistories())
    setAccusations([])
    setView({ kind: 'map' })
    setChatCharacterId(null)
    setAccusationOpen(false)
  }

  const goToMap = () => {
    setChatCharacterId(null)
    setView({ kind: 'map' })
  }

  const goToRoom = (roomId) => {
    setChatCharacterId(null)
    setView({ kind: 'room', roomId })
  }

  const openChat = (characterId) => setChatCharacterId(characterId)
  const closeChat = () => setChatCharacterId(null)

  const sendMessageTo = async (characterId, text) => {
    const userMessage = { role: 'user', content: text }
    const updatedHistory = [...histories[characterId], userMessage]
    setHistories((prev) => ({ ...prev, [characterId]: updatedHistory }))

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        characterId,
        messages: updatedHistory,
        playerProfile,
      }),
    })

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}))
      throw new Error(
        errBody.error || `Request failed: ${res.status} ${res.statusText}`,
      )
    }

    const { reply } = await res.json()
    const modelMessage = { role: 'model', content: reply }
    setHistories((prev) => ({
      ...prev,
      [characterId]: [...prev[characterId], modelMessage],
    }))
  }

  const recordAccusation = (characterId, correct) => {
    setAccusations((prev) => [
      ...prev,
      { characterId, correct, at: Date.now() },
    ])
  }

  // Avoid a flash of the wrong view while we read localStorage.
  if (!loaded) {
    return <main className="min-h-screen bg-ink" />
  }

  // Until the player has signed in, show only the intro.
  if (!playerProfile) {
    return (
      <main className="min-h-screen">
        <IntroScreen onComplete={completeIntro} />
      </main>
    )
  }

  const questionedIds = CHARACTER_IDS.filter((id) =>
    histories[id].some((m) => m.role === 'user'),
  )
  const totalCount = CHARACTER_IDS.length
  const allQuestioned = questionedIds.length >= totalCount

  const userLabel = `${playerProfile.title} ${playerProfile.name}`

  // The Make Accusation submit button is gated by NEXT_PUBLIC_GAME_MODE.
  // The student starter omits this var, so the modal still opens (suspects
  // visible) but no accusation can be filed — the answer is revealed by the
  // workshop presenter at the end of the session.
  const accusationEnabled = process.env.NEXT_PUBLIC_GAME_MODE === 'flysolo'

  return (
    <main className="relative min-h-screen">
      {view.kind === 'map' && <ManorMap onRoomClick={goToRoom} />}

      {view.kind === 'room' && (
        <RoomView
          roomId={view.roomId}
          onBack={goToMap}
          onCharacterClick={openChat}
        />
      )}

      {chatCharacterId && (
        <CharacterChat
          characterId={chatCharacterId}
          history={histories[chatCharacterId]}
          onSendMessage={(text) => sendMessageTo(chatCharacterId, text)}
          onClose={closeChat}
          userLabel={userLabel}
        />
      )}

      {/* Top-left detective badge — only on the manor map */}
      {view.kind === 'map' && (
        <div className="fixed top-4 left-5 z-30 text-sm md:text-base">
          <div className="bg-ink/70 border border-amber-dim/60 rounded px-3 py-1.5
                          backdrop-blur-sm flex items-center gap-3">
            <span className="serif text-amber-bright">{userLabel}</span>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setAccusationOpen(true)}
        title={
          allQuestioned
            ? 'Make your accusation'
            : `Questioned ${questionedIds.length} of ${totalCount} — finish questioning to accuse`
        }
        className="fixed bottom-5 right-5 z-40 serif text-lg md:text-2xl
                   bg-ink border-2 border-blood text-amber-bright
                   px-6 py-3 rounded-md hover:bg-blood hover:shadow-amber
                   transition-all
                   flex items-center gap-3"
      >
        <span>Make accusation</span>
        <span
          className={[
            'inline-flex items-center justify-center min-w-[3rem] px-2.5 h-8 rounded-full text-base font-sans font-semibold',
            allQuestioned
              ? 'bg-amber text-ink'
              : 'bg-ink border border-amber/60 text-amber-bright',
          ].join(' ')}
        >
          {questionedIds.length}/{totalCount}
        </span>
      </button>

      {accusationOpen && (
        <AccusationScreen
          onClose={() => setAccusationOpen(false)}
          questionedIds={questionedIds}
          accusationEnabled={accusationEnabled}
          accusations={accusations}
          onAccusationRecorded={recordAccusation}
        />
      )}

      <SettingsButton onRestart={restartGame} />
    </main>
  )
}
