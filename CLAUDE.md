# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the project

Two processes must run simultaneously:

**Backend** (Python / FastAPI):
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Frontend** (React / Vite):
```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
npm run build      # production build
npm run preview    # serve the production build locally
```

If port 8000 is already in use: `lsof -ti :8000 | xargs kill -9`

## Architecture

The pipeline for every player action is linear and worth understanding end-to-end:

```
Browser mic → MediaRecorder (audio/webm blob)
  → base64 encode → POST /meow
  → audio_analyzer.py: extract 5 features (pitch, duration, tone_direction, intensity, meow_count)
  → intent_classifier.py: rule table → one of 10 intents (or "unknown")
  → dialogue_engine.py: NPC_RESPONSES[npc_id][intent] → random response variant
  → game_state.py: relationship_delta → stature_delta (+2 / -1 / 0)
  → MeowResponse JSON → React state update → UI render
```

### Backend (`backend/`)

- **`audio_analyzer.py`** — the only file that touches audio bytes. Uses `librosa.yin` for pitch, `librosa.feature.rms` for intensity, `librosa.onset.onset_detect` for meow count. Always resamples to 22050 Hz.
- **`intent_classifier.py`** — pure rule table, no ML. Rules are checked in order 1–10; first match wins. `intensity=any` means skip that check; `count=3+` means `>= 3`.
- **`dialogue_engine.py`** — all NPC personality lives here in `NPC_RESPONSES` dict. Four NPCs: `biscuit`, `mittens`, `grimshaw`, `zara`. Each has 11 intents × 3 response variants.
- **`game_state.py`** — single function mapping relationship_delta sign to stature_delta.
- **`main.py`** — four endpoints: `POST /meow`, `GET /npc/{npc_id}`, `POST /pledge`, `GET /health`. Every `/meow` call prints extracted features and detected intent to stdout.

### Frontend (`frontend/src/`)

State management uses no external library — two custom hooks only:

- **`useGameState.js`** — single source of truth, persisted to `localStorage` under key `meow_kingdom_state`. Tracks stature, per-NPC relationship scores, conversation history, and which NPCs are unlocked. NPC unlock thresholds: Mittens=50, Zara=150, Grimshaw=300.
- **`useAudioRecorder.js`** — wraps `MediaRecorder` API. `stopRecording()` returns a Promise that resolves with the audio Blob.

Routing is state-based in `App.jsx` (no React Router): `!hashedFealty` → `KingCeremony`, `hashedFealty && !activeNPC` → `VillageMap`, `hashedFealty && activeNPC` → `GameWorld`.

NPC data (ids, names, emoji maps, map positions, unlock thresholds) is the single source of truth in `src/data/npcs.js` — it drives both the `VillageMap` pins and the `GameWorld` emoji display.

## Git discipline

Commit and push to GitHub after every meaningful unit of work — a working feature, a bug fix, a refactor, a new file. Never let more than one logical change accumulate in an uncommitted state.

Commit message format: short imperative subject line, no period. Examples:
- `Add pitch classification to audio_analyzer`
- `Fix stature delta not persisting on page refresh`
- `Wire GameWorld back button to VillageMap`

Before committing, stage specific files by name rather than `git add -A`. Push to the remote (`git push`) immediately after each commit so progress is never local-only.

If the repo has no remote yet, remind the user to create one on GitHub and run `git remote add origin <url>` before the first push.

## Key constraints

- **No TypeScript** — plain JS only.
- **No Tailwind / styled-components** — plain CSS files co-located with each component.
- **No React Router** — state-based screen switching in `App.jsx`.
- **No additional backend libraries** beyond what's in `requirements.txt`.
- **No image assets** — NPCs are represented entirely by emoji strings defined in `npcs.js`.
- The game must work in **Chrome on desktop** (MediaRecorder with `audio/webm` is Chrome-specific).
