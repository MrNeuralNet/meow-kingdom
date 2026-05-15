import { useState } from "react";
import { useGameState } from "./hooks/useGameState";
import KingCeremony from "./components/KingCeremony";
import VillageMap from "./components/VillageMap";
import GameWorld from "./components/GameWorld";
import { NPC_CONFIG } from "./data/npcs";

export default function App() {
  const gameState = useGameState();
  const [activeNPC, setActiveNPC] = useState(null);
  const [prevUnlocked, setPrevUnlocked] = useState(gameState.unlockedNPCs);

  function handleFealtyPledged(name) {
    gameState.pledgeFealty(name);
  }

  function handleSelectNPC(npc) {
    setActiveNPC(npc);
  }

  function handleBackToVillage() {
    setActiveNPC(null);
  }

  function handleInteraction(npc_id, relationship_delta, stature_delta, npc_text, intent) {
    const before = [...gameState.unlockedNPCs];
    gameState.updateAfterInteraction(npc_id, relationship_delta, stature_delta, npc_text, intent);
    setPrevUnlocked(before);
  }

  const recentlyUnlocked = gameState.unlockedNPCs.filter((id) => !prevUnlocked.includes(id));

  if (!gameState.hashedFealty) {
    return <KingCeremony onFealtyPledged={handleFealtyPledged} />;
  }

  if (activeNPC) {
    return (
      <GameWorld
        npc={activeNPC}
        stature={gameState.stature}
        npcRelationship={gameState.npcRelationship}
        conversationHistory={gameState.conversationHistory}
        onBack={handleBackToVillage}
        onInteraction={handleInteraction}
      />
    );
  }

  return (
    <VillageMap
      stature={gameState.stature}
      playerName={gameState.playerName}
      unlockedNPCs={gameState.unlockedNPCs}
      onSelectNPC={handleSelectNPC}
      recentlyUnlocked={recentlyUnlocked}
    />
  );
}
