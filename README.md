# ravensworth-game

Starter repo for the **Building with LLMs: A Mystery Detective Game** workshop.

By the end of the workshop you'll have an AI-powered noir mystery: eight Gemini-powered
characters at Ravensworth Manor, each with their own personality and their own facts
about a 1947 murder. You interrogate them to find the killer.

The game itself — intro, manor map, room views, chat UI, accusation modal, settings,
persistence — is already wired up for you. What you'll write tonight is the **LLM
integration layer**: two functions in `lib/`, a one-line bug fix, and eight personality
strings the room writes together. That's the whole workshop.

## Setup

```bash
npm install
cp .env.local.example .env.local
# edit .env.local — paste your Gemini API key (no trailing spaces!)
npm run dev
```

Open <http://localhost:3000>.

Get a free Gemini API key at <https://aistudio.google.com/apikey>.

### Environment variables

| Name | What it's for |
|---|---|
| `GEMINI_API_KEY` | Your own Gemini API key. Free tier is fine for the workshop. |
| `NEXT_PUBLIC_API_URL` | Base URL of the character-facts API. Already filled in. Don't change it. |

## What you'll write tonight

| File | What | When |
|---|---|---|
| `lib/gemini.js` | Body of `sendMessage` (4 TODOs) + a one-line bug fix | Segment 2 |
| `lib/characters.js` | Eight `personality` strings, decided as a group | Segment 3 |
| `lib/characters.js` | Body of `getSystemPrompt` (2 TODOs) | Segment 4 |
| `lib/gemini.js` | Add a `temperature` parameter — observe its effect | Segment 4 |
| `lib/characters.js` | One-line guardrail in the system prompt — observe how it suppresses hallucinations | Segment 5 |

Everything else — the intro screen, persistence, manor map hotspots, character
positioning, accusation modal, settings — is already built. If you're curious how
something works, open it after the workshop.

## Game flow

1. **Dispatch & sign-in.** A noir intro plays, you sign in as a detective.
2. **Manor map.** Click any room to enter it.
3. **Rooms.** Each room shows the characters who are in it. Click a portrait to
   interrogate them. The study has no characters — it shows the crime scene
   observations instead.
4. **Chat.** A modal opens. Question the character. Their reply is generated live by
   Gemini using a system prompt built from their personality (what you wrote) and
   their facts (fetched from the workshop API).
5. **Accusation.** The persistent **Make accusation** button opens the suspect grid
   once you've questioned at least one character. The Accuse button itself is
   sealed by the presenter — the killer's identity is revealed live at the end
   of the workshop.

## Architecture

```
Browser (React state)
   │
   ├─ IntroScreen → ManorMap → RoomView → CharacterChat
   │  Per-character chat history is persisted to localStorage.
   │
   └─ POST /api/chat { characterId, messages, playerProfile }
         │
         └─ app/api/chat/route.js   (server-side)
              │
              ├─ getSystemPrompt()    ← lib/characters.js   (you write this)
              │     fetches character facts from the workshop API
              │
              └─ sendMessage()         ← lib/gemini.js       (you write this)
                    calls Gemini 2.5 Flash
```

Character facts (motives, alibis, what each character is hiding) live behind a
separate API and never reach the browser bundle.

## Repo layout

```
app/
├── api/chat/route.js   server-side chat orchestrator
├── globals.css         tailwind + noir base styles
├── layout.js
└── page.js             top-level view + per-character history
components/
├── IntroScreen.jsx
├── ManorMap.jsx
├── RoomView.jsx
├── CharacterChat.jsx
├── AccusationScreen.jsx
├── SettingsButton.jsx
└── ChatMessage.jsx
lib/
├── characters.js       character + room data + getSystemPrompt   ← you edit
├── gemini.js           Gemini SDK wrapper                          ← you edit
└── storage.js          localStorage helpers (already wired up)
public/assets/          backgrounds, portraits, manor-map.png
```

## Troubleshooting

- **401 Unauthorized on the first chat.** Expected during Segment 2 — there's a
  deliberate one-character typo in `lib/gemini.js`. Read the error and find it.
- **`.env.local` changes not taking effect.** Restart the dev server (`Ctrl+C`,
  then `npm run dev` again). Code changes hot-reload; env changes do not.
- **Accuse button is missing from the modal.** That's intentional. The presenter
  reveals the killer at the end of the workshop.
- **Want to reset and replay the intro?** Click the gear icon → **Restart game**.
