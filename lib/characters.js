// Character and room data for the Ravensworth Manor mystery.
//
// `personality` is the voice the model takes on. It is intentionally left
// blank in this starter — the workshop room writes one for each character
// together in Segment 3.
//
// `facts` are NOT here. They live behind the ravensworth-api endpoint and
// are fetched server-side in getSystemPrompt below, so they never reach the
// client bundle.

export const characters = {
  crane: {
    id: 'crane',
    name: 'Victor Crane',
    role: "Edmund's personal solicitor",
    location: 'drawing-room',
    portrait: '/assets/characters/crane.png',
    personality: '',
  },
  arthur: {
    id: 'arthur',
    name: 'Arthur Lowe',
    role: "Edmund's nephew and sole heir",
    location: 'drawing-room',
    portrait: '/assets/characters/arthur.png',
    personality: '',
  },
  dora: {
    id: 'dora',
    name: 'Dora Hobbs',
    role: 'Manor housekeeper',
    location: 'kitchen',
    portrait: '/assets/characters/dora.png',
    personality: '',
  },
  aldric: {
    id: 'aldric',
    name: 'Father Aldric',
    role: 'Local vicar',
    location: 'kitchen',
    portrait: '/assets/characters/aldric.png',
    personality: '',
  },
  pryce: {
    id: 'pryce',
    name: 'Reginald Pryce',
    role: "Edmund's business rival",
    location: 'garden-terrace',
    portrait: '/assets/characters/pryce.png',
    personality: '',
  },
  margaret: {
    id: 'margaret',
    name: 'Margaret Whitfield',
    role: "Edmund's widowed daughter-in-law",
    location: 'antiques-gallery',
    portrait: '/assets/characters/margaret.png',
    personality: '',
  },
  reid: {
    id: 'reid',
    name: 'Callum Reid',
    role: 'Scottish antiques dealer',
    location: 'antiques-gallery',
    portrait: '/assets/characters/reid.png',
    personality: '',
  },
  thomas: {
    id: 'thomas',
    name: 'Thomas Hale',
    role: "Edmund's private driver",
    location: 'servants-quarters',
    portrait: '/assets/characters/thomas.png',
    personality: '',
  },
}

// Hotspot positions are percentages of the manor-map.png dimensions,
// describing a rectangular click target. Eyeballed from the asset.
export const rooms = {
  'drawing-room': {
    id: 'drawing-room',
    name: 'Drawing Room',
    background: '/assets/rooms/drawing-room.png',
    characters: ['crane', 'arthur'],
    hotspot: { left: 63, top: 47, width: 22, height: 31 },
    characterPositions: {
      crane: { left: 55, bottom: 3, scale: 0.95 },
      arthur: { left: 30, bottom: 20, scale: 0.7 },
    },
  },
  kitchen: {
    id: 'kitchen',
    name: 'Kitchen',
    background: '/assets/rooms/kitchen.png',
    characters: ['aldric', 'dora'],
    hotspot: { left: 11, top: 44, width: 20, height: 25 },
    // Per-character placement in the room view.
    //   left:   horizontal center, in % of the room width (0 = far left)
    //   bottom: distance from the floor of the room view, in % (default 0)
    //   scale:  portrait scale multiplier (default 1)
    // Aldric stands by the stove on the left; Dora by the door on the right —
    // keeps them clear of the prep table in the centre of the background.
    characterPositions: {
      aldric: { left: 23, bottom: 5 },
      dora: { left: 73, bottom: 13, scale: 0.85 },
    },
  },
  'garden-terrace': {
    id: 'garden-terrace',
    name: 'Garden Terrace',
    background: '/assets/rooms/garden-terrace.png',
    characters: ['pryce'],
    hotspot: { left: 38, top: 22, width: 27, height: 27 },
  },
  'antiques-gallery': {
    id: 'antiques-gallery',
    name: 'Antiques Gallery',
    background: '/assets/rooms/antiques-gallery.png',
    characters: ['margaret', 'reid'],
    hotspot: { left: 65, top: 18, width: 29, height: 25 },
    characterPositions: {
      margaret: { left: 40, bottom: 22, scale: 0.65 },
      reid: { left: 65, bottom: 5, scale: 1 },
    },
  },
  'servants-quarters': {
    id: 'servants-quarters',
    name: "Servants' Quarters",
    background: '/assets/rooms/servants-quarters.png',
    characters: ['thomas'],
    hotspot: { left: 21, top: 70, width: 19, height: 23 },
  },
  study: {
    id: 'study',
    name: 'The Study',
    background: '/assets/rooms/study.png',
    characters: [],
    isCrimeScene: true,
    hotspot: { left: 20, top: 18, width: 18, height: 24 },
    clues: [
      {
        title: 'The desk',
        body:
          'An ornate writing desk beneath the window. Papers, an inkwell, a stack of unopened correspondence. The leather blotter bears the impression of an object habitually laid across it — but no such object lies there now.',
      },
      {
        title: 'The window',
        body:
          'The window onto the garden terrace is shut but the latch hangs loose, as though never quite engaged. Beads of rain cling to the inside of the frame.',
      },
      {
        title: 'The door',
        body:
          'A heavy oak door, splintered slightly near the frame. The household say it was locked from the inside when Edmund failed to appear for the birthday toast; an officer forced it open shortly after ten.',
      },
      {
        title: 'The outline',
        body:
          'A chalk outline beside the desk marks where Edmund was found, slumped from his chair. A single wound to the chest. The body has since been removed.',
      },
      {
        title: 'Beyond the glass',
        body:
          'Through the rain-streaked window: the terrace flagstones, and a path receding into the dark of the garden.',
      },
    ],
  },
}

export async function getSystemPrompt(characterId, playerProfile) {
  const character = characters[characterId]
  if (!character) throw new Error(`Unknown character: ${characterId}`)

  // TODO 1: fetch character facts from the API
  //         use process.env.NEXT_PUBLIC_API_URL + '/api/character?id=' + characterId
  //         the response JSON has a 'facts' field

  // TODO 2: build and return the system prompt string combining:
  //         - character.name and character.role
  //         - character.personality
  //         - facts from the API
}
