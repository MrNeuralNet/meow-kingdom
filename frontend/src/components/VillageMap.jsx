import { NPC_CONFIG } from "../data/npcs";
import "./VillageMap.css";

export default function VillageMap({ stature, playerName, unlockedNPCs, onSelectNPC, recentlyUnlocked }) {
  return (
    <div className="village">
      <div className="village__hud">
        <span className="village__player">🐾 {playerName}</span>
        <span className="village__stature">⚔️ Stature: {stature}</span>
      </div>

      <h2 className="village__title">Meow Kingdom</h2>

      <div className="village__map">
        {NPC_CONFIG.map((npc) => {
          const unlocked = unlockedNPCs.includes(npc.id);
          return (
            <div
              key={npc.id}
              className={`npc-pin ${unlocked ? "npc-pin--unlocked" : "npc-pin--locked"}`}
              style={{ left: `${npc.location.x}%`, top: `${npc.location.y}%` }}
              onClick={() => unlocked && onSelectNPC(npc)}
              title={unlocked ? npc.name : `Requires ${npc.unlock_stature} stature`}
            >
              <div className="npc-pin__bubble">
                {unlocked ? npc.emoji.neutral : "🔒"}
              </div>
              <span className="npc-pin__label">{npc.name}</span>
              {!unlocked && (
                <span className="npc-pin__lock-hint">⚔️ {npc.unlock_stature}</span>
              )}
            </div>
          );
        })}
      </div>

      {recentlyUnlocked && recentlyUnlocked.length > 0 && (
        <div className="village__scroll">
          {recentlyUnlocked.map((id) => {
            const npc = NPC_CONFIG.find((n) => n.id === id);
            return npc ? <span key={id} className="village__scroll-item">✨ {npc.name} has joined the kingdom!</span> : null;
          })}
        </div>
      )}
    </div>
  );
}
