// Versioned localStorage wrapper for game state.
//
// Each piece of state lives under its own key with a version suffix so the
// shape can evolve without bricking existing saves (bump the version, write
// a migration if you ever need to). Every access is wrapped in try/catch so
// private-browsing or quota-exceeded conditions degrade gracefully — the
// game still works, it just stops persisting until the page is reloaded.

const KEYS = {
  profile: 'ravensworth-profile-v1',
  histories: 'ravensworth-histories-v1',
  accusations: 'ravensworth-accusations-v1',
}

function safeGet(key) {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function safeSet(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore — storage unavailable or full
  }
}

function safeRemove(key) {
  try {
    window.localStorage.removeItem(key)
  } catch {
    // ignore
  }
}

// --- Profile ----------------------------------------------------------------

export function loadProfile() {
  const data = safeGet(KEYS.profile)
  if (data && typeof data.name === 'string' && data.name.trim()) {
    return { name: data.name, title: data.title || 'Inspector' }
  }
  return null
}

export function saveProfile(profile) {
  if (!profile || !profile.name) return
  safeSet(KEYS.profile, profile)
}

// --- Histories --------------------------------------------------------------
// Shape: { [characterId]: Array<{ role: 'user' | 'model', content: string }> }

export function loadHistories(characterIds) {
  const data = safeGet(KEYS.histories)
  const blank = Object.fromEntries(characterIds.map((id) => [id, []]))
  if (!data || typeof data !== 'object') return blank

  const out = { ...blank }
  for (const id of characterIds) {
    if (Array.isArray(data[id])) {
      out[id] = data[id].filter(
        (m) =>
          m &&
          (m.role === 'user' || m.role === 'model') &&
          typeof m.content === 'string',
      )
    }
  }
  return out
}

export function saveHistories(histories) {
  safeSet(KEYS.histories, histories)
}

// --- Accusations ------------------------------------------------------------
// Shape: Array<{ characterId: string, correct: boolean, at: number }>

export function loadAccusations() {
  const data = safeGet(KEYS.accusations)
  if (!Array.isArray(data)) return []
  return data.filter(
    (a) =>
      a &&
      typeof a.characterId === 'string' &&
      typeof a.correct === 'boolean' &&
      typeof a.at === 'number',
  )
}

export function saveAccusations(accusations) {
  safeSet(KEYS.accusations, accusations)
}

// --- Wipe everything --------------------------------------------------------

export function clearAll() {
  for (const key of Object.values(KEYS)) {
    safeRemove(key)
  }
}
