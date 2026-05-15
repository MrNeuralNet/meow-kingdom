import { useState } from "react";
import MeowButton from "./MeowButton";
import StatBar from "./StatBar";
import { sendMeow } from "../utils/api";
import "./GameWorld.css";

export default function GameWorld({ npc, stature, npcRelationship, conversationHistory, onBack, onInteraction }) {
  const [emotion, setEmotion] = useState("neutral");
  const [npcText, setNpcText] = useState(`*${npc.name} looks at you expectantly.*`);
  const [intentLabel, setIntentLabel] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [delta, setDelta] = useState(null);
  const [error, setError] = useState("");

  const currentEmoji = npc.emoji[emotion] ?? npc.emoji.neutral;
  const history = conversationHistory[npc.id] ?? [];
  const relationship = npcRelationship[npc.id] ?? 0;

  async function handleMeow(audioBlob) {
    setIsLoading(true);
    setError("");
    setDelta(null);
    try {
      const data = await sendMeow(audioBlob, npc.id, stature);
      setEmotion(data.npc_emotion);
      setNpcText(data.npc_text);
      setIntentLabel(data.intent_label);
      setDelta(data.stature_delta);
      onInteraction(npc.id, data.relationship_delta, data.stature_delta, data.npc_text, data.intent);

      setTimeout(() => setDelta(null), 2500);
    } catch {
      setError("The kingdom's messenger pigeon got lost. Try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="gameworld">
      <div className="gameworld__topbar">
        <button className="gameworld__back" onClick={onBack}>← Village</button>
        <span className="gameworld__npc-name">{npc.name}</span>
        <div className="gameworld__rel">
          <span className="gameworld__rel-label">Bond</span>
          <span className="gameworld__rel-value" style={{ color: relationship >= 0 ? "#ffd700" : "#ff6b6b" }}>
            {relationship > 0 ? "+" : ""}{relationship}
          </span>
        </div>
      </div>

      <StatBar stature={stature} label="⚔️ Stature" />

      <div className="gameworld__npc-display">
        <div className="gameworld__emoji">{currentEmoji}</div>
        {delta !== null && (
          <div className={`gameworld__delta ${delta >= 0 ? "gameworld__delta--pos" : "gameworld__delta--neg"}`}>
            {delta >= 0 ? "+" : ""}{delta} stature
          </div>
        )}
      </div>

      <div className="gameworld__bubble">
        <p className="gameworld__npc-text">{npcText}</p>
        {intentLabel && <p className="gameworld__intent-label">{intentLabel}</p>}
      </div>

      {error && <p className="gameworld__error">{error}</p>}

      {history.length > 0 && (
        <div className="gameworld__history">
          {history.slice(-5).map((entry, i) => (
            <div key={i} className="gameworld__history-entry">
              <span className="gameworld__history-intent">{entry.intent}</span>
              <span className="gameworld__history-text">{entry.npc_text}</span>
            </div>
          ))}
        </div>
      )}

      <div className="gameworld__meow-wrap">
        <MeowButton onMeowComplete={handleMeow} isLoading={isLoading} />
      </div>
    </div>
  );
}
