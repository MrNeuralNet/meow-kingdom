import { useState, useEffect } from "react";

const STORAGE_KEY = "meow_kingdom_state";
const UNLOCK_THRESHOLDS = { mittens: 50, zara: 150, grimshaw: 300 };

const DEFAULT_STATE = {
  playerName: "",
  hashedFealty: false,
  stature: 0,
  unlockedNPCs: ["biscuit"],
  npcRelationship: { biscuit: 0, mittens: 0, grimshaw: 0, zara: 0 },
  conversationHistory: { biscuit: [], mittens: [], grimshaw: [], zara: [] },
};

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
  }
}

export function useGameState() {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  function pledgeFealty(playerName) {
    setState((s) => ({ ...s, playerName, hashedFealty: true }));
  }

  function updateAfterInteraction(npc_id, relationship_delta, stature_delta, npc_text, intent) {
    setState((s) => {
      const newRelationship = {
        ...s.npcRelationship,
        [npc_id]: s.npcRelationship[npc_id] + relationship_delta,
      };
      const newStature = Math.max(0, s.stature + stature_delta);
      const newUnlocked = [...s.unlockedNPCs];

      Object.entries(UNLOCK_THRESHOLDS).forEach(([npcId, threshold]) => {
        if (newStature >= threshold && !newUnlocked.includes(npcId)) {
          newUnlocked.push(npcId);
        }
      });

      const entry = { intent, npc_text, timestamp: new Date().toISOString() };
      const newHistory = {
        ...s.conversationHistory,
        [npc_id]: [...s.conversationHistory[npc_id], entry],
      };

      return {
        ...s,
        npcRelationship: newRelationship,
        stature: newStature,
        unlockedNPCs: newUnlocked,
        conversationHistory: newHistory,
      };
    });
  }

  function resetGame() {
    localStorage.removeItem(STORAGE_KEY);
    setState(DEFAULT_STATE);
  }

  return { ...state, pledgeFealty, updateAfterInteraction, resetGame };
}
